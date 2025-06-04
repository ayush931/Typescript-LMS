// const app = require("./app.js");
import app from './app.js';
// const { config } = require("dotenv")
import { config } from 'dotenv';
import connectionToDB from './config/dbConnection.js';
config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectionToDB();
  console.log(`App is listening on ${PORT}`);
});
