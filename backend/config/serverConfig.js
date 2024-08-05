const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  mail: process.env.mail,
  pass: process.env.pass,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME:process.env.DB_NAME
};
