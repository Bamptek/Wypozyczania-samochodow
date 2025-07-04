const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationCode } = require('../services/email.service');
const crypto = require('crypto');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        const verificationToken = crypto.randomInt(100000, 999999).toString();
        const tokenExpires = new Date(Date.now() + 10 * 60 * 1000); 

        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpires: tokenExpires,
                emailVerified: false, 
            },
        });

        
        sendVerificationCode(email, verificationToken);

        res.status(201).send({ message: "Użytkownik zarejestrowany. Sprawdź e-mail, aby dokończyć weryfikację." });
    } catch (error) {
        console.error("Błąd podczas rejestracji:", error);
        if (error.code === 'P2002') {
            return res.status(400).send({ message: "Użytkownik o tym e-mailu lub nazwie już istnieje." });
        }
        return res.status(500).send({ message: "Wystąpił wewnętrzny błąd serwera." });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, token } = req.body;
    try {
        const user = await prisma.user.findFirst({ where: { email, emailVerificationToken: token } });
        if (!user) {
            return res.status(400).send({ message: "Nieprawidłowy kod weryfikacyjny lub e-mail." });
        }
        if (new Date() > new Date(user.emailVerificationTokenExpires)) {
            return res.status(400).send({ message: "Kod weryfikacyjny wygasł. Zarejestruj się ponownie." });
        }
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationTokenExpires: null,
            }
        });
        res.status(200).send({ message: "E-mail pomyślnie zweryfikowany. Możesz się teraz zalogować." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { loginIdentifier, password } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: { OR: [{ email: loginIdentifier }, { username: loginIdentifier }] }
        });
        if (!user) {
            return res.status(404).send({ message: "Użytkownik nie znaleziony." });
        }
        if (!user.emailVerified) {
            return res.status(403).send({ message: "Proszę najpierw zweryfikować swój adres e-mail." });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Nieprawidłowe hasło!" });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: 86400 });
        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            points: user.points,
            accessToken: token
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};