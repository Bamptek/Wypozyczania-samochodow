const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.addCar = async (req, res) => {
    const { make, model, year, licensePlate, pricePerDay, imageUrl } = req.body;
    if (!make || !model || !year || !licensePlate || !pricePerDay) {
        return res.status(400).send({ message: "Wszystkie pola oprócz URL obrazka są wymagane." });
    }
    try {
        const existingCar = await prisma.car.findUnique({ where: { licensePlate } });
        if (existingCar) {
            return res.status(400).send({ message: "Samochód o tym numerze rejestracyjnym już istnieje." });
        }
        const car = await prisma.car.create({
            data: { make, model, year: parseInt(year), licensePlate, pricePerDay: parseFloat(pricePerDay), imageUrl },
        });
        res.status(201).json(car);
    } catch (error) {
        res.status(500).send({ message: "Błąd podczas dodawania samochodu: " + error.message });
    }
};


exports.getAllCarsForAdmin = async (req, res) => {
    try {
        const cars = await prisma.car.findMany({ orderBy: { createdAt: 'desc' } });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).send({ message: "Błąd podczas pobierania listy samochodów dla admina: " + error.message });
    }
};


exports.updateCar = async (req, res) => {
    const { id } = req.params;
    const dataToUpdate = req.body;


    if (dataToUpdate.year) {
        dataToUpdate.year = parseInt(dataToUpdate.year);
    }
    if (dataToUpdate.pricePerDay) {
        dataToUpdate.pricePerDay = parseFloat(dataToUpdate.pricePerDay);
    }

    try {
        const updatedCar = await prisma.car.update({
            where: { id },
            data: dataToUpdate
        });
        res.status(200).json(updatedCar);
    } catch (error) {
        res.status(500).send({ message: "Błąd podczas aktualizacji danych samochodu: " + error.message });
    }
};


exports.updateCarStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedCar = await prisma.car.update({
            where: { id },
            data: { status },
        });
        res.status(200).json(updatedCar);
    } catch (error) {
        res.status(500).send({ message: "Błąd podczas aktualizacji statusu: " + error.message });
    }
};


exports.deleteCar = async (req, res) => {
    const { id } = req.params;
    try {
        const activeBookings = await prisma.booking.count({
            where: { carId: id, status: 'CONFIRMED' }
        });

        if (activeBookings > 0) {
            return res.status(400).send({ message: "Nie można usunąć samochodu, który ma aktywne rezerwacje." });
        }

        await prisma.car.delete({ where: { id } });
        res.status(200).send({ message: "Samochód został pomyślnie usunięty." });
    } catch (error) {
        res.status(500).send({ message: "Błąd podczas usuwania samochodu: " + error.message });
    }
};

exports.addServiceLog = async (req, res) => {
    const { carId, date, description, cost } = req.body;
    if (!carId || !date || !description || !cost) {
        return res.status(400).send({ message: "Wszystkie pola są wymagane." });
    }
    try {
        const log = await prisma.serviceLog.create({
            data: { carId, date: new Date(date), description, cost: parseFloat(cost) }
        });
        res.status(201).json(log);
    } catch (error) {
        res.status(500).send({ message: "Błąd podczas dodawania wpisu serwisowego." });
    }
};