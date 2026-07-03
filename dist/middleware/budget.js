"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBudgetInput = exports.validateBudgetExists = exports.validateBudgetId = void 0;
exports.hasAccess = hasAccess;
const express_validator_1 = require("express-validator");
const Budget_1 = __importDefault(require("../models/Budget"));
const validateBudgetId = async (req, res, next) => {
    // Los Middlewares practicamente cson funciones 
    await (0, express_validator_1.param)('budgetId')
        .isInt().withMessage('ID no válido').bail() // Lo que hace bail es si no ejecuta la validación ejecuta las siguientes
        .custom(value => value > 0)
        .withMessage('ID no válido').bail()
        .run(req);
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validateBudgetId = validateBudgetId;
const validateBudgetExists = async (req, res, next) => {
    try {
        const { budgetId } = req.params;
        const budget = await Budget_1.default.findByPk(budgetId.toString());
        if (!budget) {
            const error = new Error('Presupuesto no encontrado');
            return res.status(404).json({ error: error.message });
        }
        req.budget = budget;
        next();
    }
    catch (error) {
        // console.log(error)
        res.status(500).json({ error: 'Hubo un error' });
    }
};
exports.validateBudgetExists = validateBudgetExists;
const validateBudgetInput = async (req, res, next) => {
    // Validación de Nombre y Cantidad
    await (0, express_validator_1.body)('name')
        .notEmpty().withMessage('El nombre del presupuesto no puede ir vacío').run(req);
    await (0, express_validator_1.body)('amount')
        .notEmpty().withMessage('La cantidad del presupuesto no puede ir vacía')
        .isNumeric().withMessage('Cantidad no válida')
        .custom(value => value > 0).withMessage('El presupuesto debe ser mayor a 0').run(req);
    // let errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    // }
    next();
};
exports.validateBudgetInput = validateBudgetInput;
function hasAccess(req, res, next) {
    if (req.budget.userId !== req.user.id) {
        const error = new Error('Acción no válida');
        return res.status(401).json({ error: error.message });
    }
    next();
}
//# sourceMappingURL=budget.js.map