const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getAllCars = async (req, res) => {
    
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    try {
        const cars = await prisma.car.findMany({
            where: { status: 'AVAILABLE' },
            orderBy: { createdAt: 'desc' },
            take: limit 
        });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).send({ message: "Błąd podczas pobierania listy samochodów: " + error.message });
    }
};


exports.getCarById = async (req, res) => {
    const { id } = req.params; 

    try {
        const car = await prisma.car.findUnique({
            where: {
                id: id
            }
        });

        if (!car) {
            return res.status(404).send({ message: 'Nie znaleziono samochodu o podanym ID.' });
        }

        res.status(200).json(car);
    } catch (error) {
        res.status(500).send({ message: "Błąd podczas pobierania szczegółów samochodu: " + error.message });
    }
};