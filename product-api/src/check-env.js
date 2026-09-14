require('dotenv').config();

console.log("SERVER:", JSON.stringify(process.env.DB_SERVER));
console.log("DATABASE:", JSON.stringify(process.env.DB_NAME));
console.log("USER:", JSON.stringify(process.env.DB_USER));
console.log("PASSWORD LENGTH:", process.env.DB_PASSWORD?.length);