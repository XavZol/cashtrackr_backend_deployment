"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAccount = async (req, res) => {
        const { email, password } = req.body;
        // Prevenir duplicados 
        const userExists = await User_1.default.findOne({ where: { email } });
        if (userExists) {
            const error = new Error('Un usuario con ese email ya esta registrado');
            return res.status(409).json({ error: error.message });
        }
        try {
            const user = await User_1.default.create(req.body);
            user.password = await (0, auth_1.hashPassword)(password);
            const token = (0, token_1.generateToken)();
            user.token = token;
            // Usamos el Globalthis de node para pasar y comunicar las pruebas
            if (process.env.NODE_ENV !== 'production') {
                globalThis.cashTrackrConfirmationToken = token;
            }
            await user.save();
            await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            });
            res.status(201).json('Cuenta Creada, Revisa tu E-mail para Confirmar Usuario');
        }
        catch (error) {
            // console.log(error)
            if (error.errors) {
                return res.status(400).json({
                    errors: error.errors.map((err) => err.message)
                });
            }
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static confirmAccount = async (req, res) => {
        const { token } = req.body;
        const user = await User_1.default.findOne({ where: { token } });
        if (!user) {
            const error = new Error('Token no válido');
            return res.status(401).json({ error: error.message });
        }
        user.confirmed = true; // Confirmamos el token 
        user.token = null; // Eliminamos el token de un solo uso
        await user.save();
        res.json('Cuenta Confirmada Correctamente');
    };
    static login = async (req, res) => {
        const { email, password } = req.body;
        // Revisar que el usuario exista
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ error: error.message });
        }
        if (!user.confirmed) {
            const error = new Error('La cuenta no ha sido confirmada');
            return res.status(403).json({ error: error.message });
        }
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('Password Incorrecto');
            return res.status(401).json({ error: error.message });
        }
        const token = (0, jwt_1.generateJWT)(user.id); // Hacemos la función que genero el token basado en el id del usuario
        res.json(token);
    };
    static forgotPassword = async (req, res) => {
        const { email } = req.body;
        // Revisar que el usuario exista
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            const error = new Error('Usuario no encontrado');
            return res.status(404).json({ error: error.message });
        }
        user.token = (0, token_1.generateToken)();
        await user.save();
        // Reseteamos el Password
        await AuthEmail_1.AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        });
        res.json('Revisa tu email para instrucciones');
    };
    static validateToken = async (req, res) => {
        const { token } = req.body;
        const tokenExists = await User_1.default.findOne({ where: { token } });
        if (!tokenExists) {
            const error = new Error('Token no válido');
            return res.status(404).json({ error: error.message });
        }
        res.json('Token válido, asigna un nuevo password');
    };
    static resetPasswordWithToken = async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User_1.default.findOne({ where: { token } });
        if (!user) {
            const error = new Error('Token no válido');
            return res.status(404).json({ error: error.message });
        }
        // Asignar el Nuevo Password
        user.password = await (0, auth_1.hashPassword)(password);
        user.token = null;
        await user.save();
        res.json('El Password se Modificó Correctamente');
    };
    static user = async (req, res) => {
        res.json(req.user);
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const { id } = req.user;
        const user = await User_1.default.findByPk(id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto');
            return res.status(401).json({ error: error.message });
        }
        user.password = await (0, auth_1.hashPassword)(password);
        await user.save();
        res.json('El Password se modificó correctamente');
    };
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const { id } = req.user;
        const user = await User_1.default.findByPk(id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto');
            return res.status(401).json({ error: error.message });
        }
        res.json('Password correcto');
    };
    static updateUser = async (req, res) => {
        const { name, email } = req.body;
        try {
            const existingUser = await User_1.default.findOne({ where: { email } });
            if (existingUser && existingUser.id !== req.user.id) {
                const error = new Error('Ese email ya está registrado por otro usuario');
                return res.status(409).json({ error: error.message });
            }
            await User_1.default.update({ email, name }, {
                where: { id: req.user.id }
            });
            res.json('Perfil actualizado correctamente');
        }
        catch (error) {
            res.status(500).json('Hubo un error');
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map