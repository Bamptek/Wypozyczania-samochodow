const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');


const options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}
const transporter = nodemailer.createTransport(sgTransport(options));


const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to: ${mailOptions.to}`);
    } catch (error) {
        console.error(`Error sending email to ${mailOptions.to}:`, error);
        if (error.response) {
            console.error(error.response.body.errors);
        }
    }
};


const sendBookingConfirmation = async (userEmail, bookingDetails) => {
  const { id, car, startDate, endDate, totalPrice, cancellation_token } = bookingDetails;
  const cancelUrl = `http://localhost:5000/api/bookings/cancel/${id}/${cancellation_token}`;
  const viewUrl = `http://localhost:5173/my-bookings`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h1 style="color: #333;">Dziękujemy za Twoją rezerwację!</h1>
      <p>Poniżej znajdują się szczegóły Twojej rezerwacji.</p>
      <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; background-color: #f9f9f9;">
        <img src="${car.imageUrl}" alt="${car.make} ${car.model}" style="max-width: 100%; height: auto; border-radius: 5px;" />
        <h2 style="color: #0056b3;">${car.make} ${car.model}</h2>
        <ul>
            <li><strong>Data odbioru:</strong> ${new Date(startDate).toLocaleDateString()}</li>
            <li><strong>Data zwrotu:</strong> ${new Date(endDate).toLocaleDateString()}</li>
            <li><strong>Całkowity koszt:</strong> ${totalPrice.toFixed(2)} PLN</li>
        </ul>
      </div>
      <p style="margin-top: 20px;">
        <a href="${viewUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Zobacz swoje rezerwacje</a>
        <a href="${cancelUrl}" style="display: inline-block; background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Anuluj rezerwację</a>
      </p>
    </div>
  `;
  await sendEmail({ from: process.env.SENDER_EMAIL, to: userEmail, subject: 'Potwierdzenie rezerwacji samochodu', html: emailHtml });
};


const sendVerificationCode = async (userEmail, token) => {
  await sendEmail({
    from: process.env.SENDER_EMAIL,
    to: userEmail,
    subject: 'Potwierdź swoją rejestrację w Wypożyczalni Auto-Super',
    html: `<h1>Witaj w naszej wypożyczalni!</h1>
           <p>Dziękujemy za rejestrację. Aby dokończyć proces, użyj poniższego kodu:</p>
           <h2 style="font-size: 24px; letter-spacing: 2px; text-align: center;">${token}</h2>
           <p>Kod jest ważny przez 10 minut.</p>`
  });
};


const sendReturnReminder = async (userEmail, bookingDetails) => {
  const { car, endDate } = bookingDetails;
  await sendEmail({
    from: process.env.SENDER_EMAIL,
    to: userEmail,
    subject: 'Przypomnienie o zwrocie samochodu',
    html: `<h1>Przypomnienie!</h1><p>Twoja rezerwacja na <strong>${car.make} ${car.model}</strong> kończy się jutro, czyli ${new Date(endDate).toLocaleDateString()}.</p>`
  });
};


module.exports = { 
  sendBookingConfirmation,
  sendVerificationCode,
  sendReturnReminder
};