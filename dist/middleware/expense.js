"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.belongsToBudget = exports.validateExpenseExists = exports.validateExpenseId = exports.validateExpenseInput = void 0;
const express_validator_1 = require("express-validator");
const Expense_1 = __importDefault(require("../models/Expense"));
const validateExpenseInput = async (req, res, next) => {
    await (0, express_validator_1.body)('name')
        .notEmpty().withMessage('El nombre del gasto no puede ir vacío').run(req);
    await (0, express_validator_1.body)('amount')
        .notEmpty().withMessage('La cantidad del gasto no puede ir vacía')
        .isNumeric().withMessage('Cantidad no válida')
        .custom(value => value > 0).withMessage('El gasto debe ser mayor a 0').run(req);
    next();
};
exports.validateExpenseInput = validateExpenseInput;
const validateExpenseId = async (req, res, next) => {
    await (0, express_validator_1.param)('expenseId').isInt().custom(value => value > 0).withMessage('ID no válido').run(req);
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validateExpenseId = validateExpenseId;
const validateExpenseExists = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const expense = await Expense_1.default.findByPk(expenseId.toString());
        if (!expense) {
            const error = new Error('Gasto no encontrado');
            return res.status(404).json({ error: error.message });
        }
        req.expense = expense;
        next();
    }
    catch (error) {
        // console.log(error)
        res.status(500).json({ error: 'Hubo un error' });
    }
};
exports.validateExpenseExists = validateExpenseExists;
const belongsToBudget = async (req, res, next) => {
    console.log();
    if (req.budget.id !== req.expense.budgetId) { // Si queremos eliminar un gasto que no pertenece a este prsupuesto
        const error = new Error('Acción no válida');
        return res.status(403).json({ error: error.message });
    }
    next();
};
exports.belongsToBudget = belongsToBudget;
//# sourceMappingURL=expense.js.map