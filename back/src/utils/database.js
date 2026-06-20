import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
 
dotenv.config();
 
// TODO
// Create the pool to connect to the database
// Use the database settings from the .env file
const pool = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export { pool };
