import {  Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
dotenv.config()
// La resolución de dns en la base de datos
// import { setServers } from 'node:dns/promises'
// setServers(["1.1.1.1", "8.8.8.8"]);
export const db = new Sequelize(process.env.DATABASE_URL , {
    models: [__dirname + '/../models/**/*' ],
    logging: false,
    dialectOptions: {
        ssl: {
            require: false
        }
    }
}) 