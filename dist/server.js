"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./config/db");
const budgetRouter_1 = __importDefault(require("./routes/budgetRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
// import { limiter } from './config/limiter';
// Dns resolve por cualquier problema local de red
// import { setServers } from 'node:dns/promises'
// setServers(["1.1.1.1", "8.8.8.8"]);
async function connectDB() {
    try {
        await db_1.db.authenticate();
        db_1.db.sync();
        // console.log(colors.blue.bold('Conexión exitosa a la BD'))
    }
    catch (error) {
        // console.log(colors.red .bold('Fallo la conexión a la Bd'))
    }
}
connectDB();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// app.use(limiter)  Proteger el servidor de request
app.use('/api/budgets', budgetRouter_1.default);
app.use('/api/auth', authRouter_1.default);
app.use('/', (req, res) => {
    res.send('todo bien');
});
exports.default = app;
//# sourceMappingURL=server.js.map