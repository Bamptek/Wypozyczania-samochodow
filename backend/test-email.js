
require('dotenv').config();
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');


const options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
};
const transporter = nodemailer.createTransport(sgTransport(options));

console.log("--- TEST WYSYŁKI E-MAIL ---");
console.log("Używam klucza API, który zaczyna się od:", process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.substring(0, 8) + '...' : 'KLUCZ NIE ZNALEZIONY');
console.log("E-mail nadawcy:", process.env.SENDER_EMAIL);


async function sendTestEmail() {
  console.log("\nPróbuję wysłać e-mail...");
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: process.env.SENDER_EMAIL, 
      subject: 'Testowa wiadomość z Wypożyczalni',
      html: '<h1>Witaj!</h1><p>Jeśli widzisz tę wiadomość, to znaczy, że wysyłka e-maili działa poprawnie.</p>'
    });

    
    console.log("\n✅ SUKCES! E-mail został pomyślnie wysłany. Sprawdź swoją skrzynkę odbiorczą (i folder Spam).");

  } catch (error) {
    
    console.error("\n❌ BŁĄD PODCZAS WYSYŁANIA E-MAILA:");
    console.error(error);
  }
}


sendTestEmail();