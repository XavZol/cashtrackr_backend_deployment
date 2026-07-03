"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const expense_1 = require("../../../../middleware/expense");
const Expense_1 = __importDefault(require("../../../../models/Expense"));
const expenses_1 = require("../../mocks/expenses");
const budget_1 = require("../../../../middleware/budget");
const budgets_1 = require("../../mocks/budgets");
jest.mock('../../../../models/Expense', () => ({
    findByPk: jest.fn()
}));
describe('Expenses Middleware - validateExpenseExists', () => {
    beforeEach(() => {
        Expense_1.default.findByPk.mockImplementation((id) => {
            const expense = expenses_1.expenses.find(e => e.id === +id) ?? null;
            return Promise.resolve(expense);
        });
    });
    it('should handle a non-existent expense', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            params: { expenseId: 999 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, expense_1.validateExpenseExists)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: 'Gasto no encontrado' });
        expect(next).not.toHaveBeenCalled();
    });
    it('should call next middleware if expense exists', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            params: { expenseId: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, expense_1.validateExpenseExists)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.expense).toEqual(expenses_1.expenses[0]);
    });
    it('should handle internal server error', async () => {
        Expense_1.default.findByPk.mockRejectedValue(new Error('Hubo un error'));
        const req = (0, node_mocks_http_1.createRequest)({
            params: { expenseId: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, expense_1.validateExpenseExists)(req, res, next);
        const data = res._getJSONData();
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: 'Hubo un error' });
    });
    //cuando alguien quiera crear un gasto a un presupuesto cuando no tiene acceso a hacerlo
    it('should prevent unauthorized users from adding expenses', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            budget: budgets_1.budgets[0],
            user: { id: 20 },
            body: { name: 'Expense Test', amount: 3000 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        (0, budget_1.hasAccess)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(401);
        expect(data).toEqual({ error: 'Acción no válida' });
        expect(next).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=expense.test.js.map