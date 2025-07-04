
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                points: true,
            }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send({ message: "Błąd podczas pobierania danych użytkownika." });
    }
};