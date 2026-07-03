"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
class ExpensesController {
    static getAll = async (req, res) => {
        res.json(req.expense);
    };
    static create = async (req, res) => {
        try {
            const expense = await Expense_1.default.create(req.body);
            expense.budgetId = req.budget.id;
            await expense.save();
            res.status(201).json('Gasto Agregado Correctamente');
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
    static getById = async (req, res) => {
        res.json(req.expense);
    };
    static updateById = async (req, res) => {
        try {
            await req.expense.update(req.body);
            res.json('Se Actualizó Correctamente');
        }
        catch (error) {
            if (error.errors) {
                return res.status(400).json({
                    errors: error.errors.map((err) => err.message)
                });
            }
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static deleteById = async (req, res) => {
        await req.expense.destroy();
        res.json('Gasto Eliminado Correctamente');
    };
}
exports.ExpensesController = ExpensesController;
//# sourceMappingURL=ExpenseController.js.map