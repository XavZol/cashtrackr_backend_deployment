"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// La resolución de dns en la base de datos
// import { setServers } from 'node:dns/promises'
// setServers(["1.1.1.1", "8.8.8.8"]);
exports.db = new sequelize_typescript_1.Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*'],
    logging: false,
    dialectOptions: {
        ssl: {
            require: false
        }
    }
});
//# sourceMappingURL=db.js.map