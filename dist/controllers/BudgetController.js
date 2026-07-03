"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
const Expense_1 = __importDefault(require("../models/Expense"));
class BudgetController {
    static getAll = async (req, res) => {
        try {
            const budgets = await Budget_1.default.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                where: {
                    userId: req.user.id
                }
            });
            res.json(budgets);
        }
        catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    static create = async (req, res) => {
        try {
            const budget = await Budget_1.default.create(req.body);
            budget.userId = req.user.id; // Autenticación
            await budget.save();
            res.status(201).json('Presupuesto Creado Correctamente');
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
        const budget = await Budget_1.default.findByPk(req.budget.id, {
            include: [Expense_1.default] // Como se puede tener relaciones con multiples modelos solo agregamos el nombre del modelo
        });
        res.json(budget);
    };
    static updateById = async (req, res) => {
        try {
            // Escribir los cambios del body
            await req.budget.update(req.body);
            res.json('Presupuesto actualizado correctamente');
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
        await req.budget.destroy(); // en el destroy colocamos req
        res.json('Presupuesto eliminado correctamente');
    };
}
exports.BudgetController = BudgetController;
//# sourceMappingURL=BudgetController.js.map