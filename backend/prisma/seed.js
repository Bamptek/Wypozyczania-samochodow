const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const carsData = [
  { make: 'Toyota', model: 'Yaris', year: 2023, licensePlate: 'W0 YARIS', pricePerDay: 120.00, imageUrl: 'https://overdrive.pl/wp-content/uploads/2023/05/Yaris_2024_Premiere_edition_MC24_YAR_PREM_01_PR_stat.jpg' },
  { make: 'Skoda', model: 'Fabia', year: 2022, licensePlate: 'W1 FABIA', pricePerDay: 110.00, imageUrl: 'https://img.chceauto.pl/skoda/fabia/skoda-fabia-hatchback-5-drzwiowy-4574-50916_head.webp' },
  { make: 'Kia', model: 'Picanto', year: 2023, licensePlate: 'W2 PICAN', pricePerDay: 100.00, imageUrl: 'https://i.ytimg.com/vi/9QiPkXXrgpg/maxresdefault.jpg' },
  { make: 'Volkswagen', model: 'Golf', year: 2022, licensePlate: 'W3 GOLF', pricePerDay: 150.00, imageUrl: 'https://www.cnet.com/a/img/resize/d4f81c0c40a17c6283f36c072ab73233ec88f13b/hub/2021/06/01/fb647f04-bc0d-474e-822a-ff0eef54dced/2022-vw-golf-r-012.jpg?auto=webp&width=1200' },
  { make: 'Ford', model: 'Focus', year: 2021, licensePlate: 'W4 FOCUS', pricePerDay: 145.00, imageUrl: 'https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6ImtpdWFxaWJyMHRoZy1PVE9NT1RPUEwiLCJ3IjpbeyJmbiI6IndnNGducXA2eTFmLU9UT01PVE9QTCIsInMiOiIxNiIsImEiOiIwIiwicCI6IjEwLC0xMCJ9XX0.es7oCLLPz75UmqId8pRPAVmLFhGtdpKPWv5O1wO5-Mk/image;s=5120x0;q=80' },
  { make: 'Hyundai', model: 'i30', year: 2023, licensePlate: 'W5 I30', pricePerDay: 140.00, imageUrl: 'https://a.allegroimg.com/s1024/0c2f93/f59f404340dbbfe26d38691c8430' },
  { make: 'Dacia', model: 'Duster', year: 2022, licensePlate: 'W6 DUSTER', pricePerDay: 180.00, imageUrl: 'https://ireland.apollo.olxcdn.com/v1/files/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmbiI6IjVyYWVxMTJqYjFvbDMtT1RPTU9UT1BMIiwidyI6W3siZm4iOiJ3ZzRnbnFwNnkxZi1PVE9NT1RPUEwiLCJzIjoiMTYiLCJhIjoiMCIsInAiOiIxMCwtMTAifV19.kQzrfidooQLr6wrwCyXuOvoQ9CMdl-TLaexycYDNQ1I/image;s=5120x0;q=80' },
  { make: 'Toyota', model: 'RAV4', year: 2023, licensePlate: 'W7 RAV4', pricePerDay: 250.00, imageUrl: 'https://cdn.motor1.com/images/mgl/mMxq0P/s1/toyota-rav4-gr-sport.jpg' },
  { make: 'Nissan', model: 'Qashqai', year: 2022, licensePlate: 'W8 QASH', pricePerDay: 220.00, imageUrl: 'https://www.autocentrum.pl/Nzk1LmpwYRsKUzpeXwxsD0kLbkIRFGMcAl0pQhMWPFcdVD4eGRggVV0DKl5FEi8ZDwEuXkZGfExbBn9ZR0B3T0VbPApSCg' },
  { make: 'BMW', model: 'Seria 3', year: 2023, licensePlate: 'W9 BMW3', pricePerDay: 350.00, imageUrl: 'https://nowoczesnaflota.pl/media/k2/items/cache/c0c573e5dc7131bbef234c1db8be04d8_L.jpg?t=20220529_071351' },
  { make: 'Mercedes-Benz', model: 'Klasa C', year: 2022, licensePlate: 'W10 MERC', pricePerDay: 380.00, imageUrl: 'https://img.chceauto.pl/mercedes-benz/c-klasa/mercedes-benz-c-klasa-sedan-4597-51331_head.webp' },
  { make: 'Audi', model: 'A4', year: 2023, licensePlate: 'W11 AUDI', pricePerDay: 360.00, imageUrl: 'https://d3s8goeblmpptu.cloudfront.net/mrp/audi/2023/a4/2023-audi-a4mrp_624778.jpg' },
];

async function main() {
  console.log(`Rozpoczynam seedowanie z nowymi linkami...`);
  const result = await prisma.car.createMany({
    data: carsData,
    skipDuplicates: true,
  });
  console.log(`Dodano ${result.count} nowych samochodów.`);
  console.log(`Seedowanie zakończone.`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
  }).finally(async () => {
    await prisma.$disconnect();
  });