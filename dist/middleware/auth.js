"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error('No Autorizado');
        return res.status(401).json({ error: error.message });
    }
    const [, token] = bearer.split(' '); // El primer parámetro es el token y el segundo el bearer, hay que mandarlo vacío para que lo separe con split
    if (!token) {
        const error = new Error('Token no válido');
        return res.status(403).json({ error: error.message });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.id) { // Identificación adicional. Deja de ser un string para convertirse en objeto
            req.user = await User_1.default.findByPk(decoded.id, {
                attributes: ['id', 'name', 'email']
            });
            next();
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Token no válido' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map