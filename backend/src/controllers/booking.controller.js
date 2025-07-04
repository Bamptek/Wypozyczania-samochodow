const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendBookingConfirmation } = require('../services/email.service');
const crypto = require('crypto');

exports.createBooking = async (req, res) => {
    const { carId, startDate, endDate, usePoints } = req.body;
    const userId = req.userId;
    try {
        const car = await prisma.car.findUnique({ where: { id: carId } });
        if (!car) return res.status(404).send({ message: 'Samochód nie znaleziony.' });
        if (car.status !== 'AVAILABLE') return res.status(400).send({ message: 'Ten samochód nie jest obecnie dostępny.' });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (days <= 0) return res.status(400).send({ message: 'Data zwrotu musi być późniejsza niż data odbioru.' });

        let totalPrice = days * car.pricePerDay;
        let pointsUsedForBooking = 0;

        if (usePoints && user.points > 0) {
            const discountPerPoint = 0.1;
            const maxDiscount = totalPrice * 0.5;
            const potentialDiscount = user.points * discountPerPoint;
            const actualDiscount = Math.min(potentialDiscount, maxDiscount);
            pointsUsedForBooking = Math.floor(actualDiscount / discountPerPoint);
            totalPrice -= actualDiscount;
            await prisma.user.update({ where: { id: userId }, data: { points: { decrement: pointsUsedForBooking } } });
        }

        const cancellationToken = crypto.randomUUID();
        const booking = await prisma.booking.create({
            data: {
                userId, carId, startDate: start, endDate: end, totalPrice,
                pointsUsed: pointsUsedForBooking,
                cancellation_token: cancellationToken
            }
        });

        await prisma.car.update({ where: { id: carId }, data: { status: 'RENTED' } });
        const pointsEarned = days * 10;
        await prisma.user.update({ where: { id: userId }, data: { points: { increment: pointsEarned } } });

        const carDetailsForEmail = { make: car.make, model: car.model, imageUrl: car.imageUrl };
        sendBookingConfirmation(user.email, { ...booking, car: carDetailsForEmail });
        
        res.status(201).send(booking);
    } catch (error) {
        res.status(500).send({ message: "Błąd serwera podczas tworzenia rezerwacji: " + error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.userId },
            include: { car: true },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await prisma.booking.findUnique({ where: { id }, include: { user: true } });
        if (!booking || booking.userId !== req.userId) {
            return res.status(403).send({ message: "Nie masz uprawnień do anulowania tej rezerwacji." });
        }
        
        
        if(booking.status === 'CONFIRMED') {
            const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24));
            const pointsEarned = days * 10;
            const pointsToReturn = booking.pointsUsed;
            const netPointChange = pointsToReturn - pointsEarned;
    
            await prisma.user.update({
                where: { id: booking.userId },
                data: { points: { increment: netPointChange } }
            });
        }
        
        await prisma.booking.update({ where: { id }, data: { status: 'CANCELLED' } });
        await prisma.car.update({ where: { id: booking.carId }, data: { status: 'AVAILABLE' } });
        
        res.status(200).send({ message: 'Rezerwacja została pomyślnie anulowana.' });
    } catch (error) {
        res.status(500).send({ message: "Błąd podczas anulowania rezerwacji: " + error.message });
    }
};

exports.cancelBookingFromEmail = async (req, res) => {
    const { id, token } = req.params;
    try {
        const booking = await prisma.booking.findFirst({
            where: { id: id, cancellation_token: token }
        });

        if (!booking) {
            return res.status(404).send("Nie znaleziono rezerwacji lub link do anulowania jest nieprawidłowy.");
        }

       
        if(booking.status === 'CONFIRMED') {
            const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24));
            const pointsEarned = days * 10;
            const pointsToReturn = booking.pointsUsed;
            const netPointChange = pointsToReturn - pointsEarned;

            await prisma.user.update({
                where: { id: booking.userId },
                data: { points: { increment: netPointChange } }
            });
        }

        await prisma.booking.update({ where: { id: id }, data: { status: 'CANCELLED' } });
        await prisma.car.update({ where: { id: booking.carId }, data: { status: 'AVAILABLE' } });
        
        res.redirect('http://localhost:5173/booking-cancelled');
    } catch (error) {
        res.status(500).send("Wystąpił błąd podczas anulowania rezerwacji.");
    }
};