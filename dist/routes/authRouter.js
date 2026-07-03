"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AuthController_1 = require("../controllers/AuthController");
const validation_1 = require("../middleware/validation");
const limiter_1 = require("../config/limiter");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(limiter_1.limiter); // Protegemos el Router
router.post('/create-account', (0, express_validator_1.body)('name')
    .notEmpty().withMessage('El Nombre no puede ir vacío'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('El password es muy corto, mínimo 8 caracteres'), (0, express_validator_1.body)('email')
    .isEmail().withMessage('E-mail no válido'), validation_1.handleInputErrors, AuthController_1.AuthController.createAccount);
router.post('/confirm-account', 
//limiter    Proteger uno en específico
(0, express_validator_1.body)('token')
    .isLength({ min: 6, max: 6 })
    .withMessage('Token no válido'), validation_1.handleInputErrors, AuthController_1.AuthController.confirmAccount);
router.post('/login', (0, express_validator_1.body)('email')
    .isEmail().withMessage('Email no válido'), (0, express_validator_1.body)('password')
    .notEmpty().withMessage('El password es obligatorio'), validation_1.handleInputErrors, AuthController_1.AuthController.login);
router.post('/forgot-password', (0, express_validator_1.body)('email')
    .isEmail().withMessage('Email no válido'), validation_1.handleInputErrors, AuthController_1.AuthController.forgotPassword);
router.post('/validate-token', (0, express_validator_1.body)('token')
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage('Token no válido'), validation_1.handleInputErrors, AuthController_1.AuthController.validateToken);
router.post('/reset-password/:token', (0, express_validator_1.param)('token')
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage('Token no válido'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('El password es muy corto, mínimo 8 caracteres'), validation_1.handleInputErrors, AuthController_1.AuthController.resetPasswordWithToken);
router.get('/user', auth_1.authenticate, AuthController_1.AuthController.user);
router.put('/user', auth_1.authenticate, AuthController_1.AuthController.updateUser);
router.post('/update-password', auth_1.authenticate, (0, express_validator_1.body)('current_password')
    .notEmpty().withMessage('El password actual no puede ir vacío'), (0, express_validator_1.body)('password')
    .isLength({ min: 8 }).withMessage('El password nuevo es muy corto, mínimo 8 caracteres'), validation_1.handleInputErrors, AuthController_1.AuthController.updateCurrentUserPassword);
router.post('/check-password', auth_1.authenticate, (0, express_validator_1.body)('password')
    .notEmpty().withMessage('El password actual no puede ir vacío'), validation_1.handleInputErrors, AuthController_1.AuthController.checkPassword);
exports.default = router;
//# sourceMappingURL=authRouter.js.map