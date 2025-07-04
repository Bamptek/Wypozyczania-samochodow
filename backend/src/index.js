
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { sendReturnReminder } = require('./services/email.service');
const userRoutes = require('./routes/user.routes');


const prisma = new PrismaClient();
const app = express();


const authRoutes = require('./routes/auth.routes');
const carRoutes = require('./routes/car.routes');
const bookingRoutes = require('./routes/booking.routes');
const adminRoutes = require('./routes/admin.routes');


app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => res.send('API Wypożyczalni Samochodów Działa!'));
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});


cron.schedule('0 9 * * *', async () => {
  console.log('CRON: Uruchamiam codzienne sprawdzanie przypomnień o zwrocie...');
  
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);


  const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
  const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

  try {
 
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        endDate: {
          gte: startOfTomorrow,
          lte: endOfTomorrow,
        },
        status: 'CONFIRMED', 
      },
      include: {
        user: true, 
        car: true,  
      }
    });

    if (upcomingBookings.length > 0) {
      console.log(`CRON: Znaleziono ${upcomingBookings.length} rezerwacji kończących się jutro. Wysyłam przypomnienia...`);
      for (const booking of upcomingBookings) {
        await sendReturnReminder(booking.user.email, booking);
      }
    } else {
      console.log('CRON: Nie znaleziono rezerwacji kończących się jutro.');
    }

  } catch (error) {
    console.error('CRON: Wystąpił błąd podczas sprawdzania przypomnień:', error);
  }
});