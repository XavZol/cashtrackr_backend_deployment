"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const budget_1 = require("../../../../middleware/budget");
const Budget_1 = __importDefault(require("../../../../models/Budget"));
const budgets_1 = require("../../mocks/budgets");
jest.mock('../../../../models/Budget', () => ({
    findByPk: jest.fn()
}));
describe('budget - validateBudgetExists', () => {
    it('should handle non-existent budget', async () => {
        Budget_1.default.findByPk.mockResolvedValue(null);
        const req = (0, node_mocks_http_1.createRequest)({
            params: {
                budgetId: 1
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, budget_1.validateBudgetExists)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: 'Presupuesto no encontrado' });
        expect(next).not.toHaveBeenCalled(); // con next no se manda a llamar el middleware
    });
    it('should call next middleware if expense exists', async () => {
        Budget_1.default.findByPk.mockRejectedValue(new Error('Hubo un error'));
        const req = (0, node_mocks_http_1.createRequest)({
            params: {
                budgetId: 1
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, budget_1.validateBudgetExists)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: 'Hubo un error' });
        expect(next).not.toHaveBeenCalled(); // con next no se manda a llamar el middleware
    });
    it('should proced to next middleware if budget exists', async () => {
        Budget_1.default.findByPk.mockResolvedValue(budgets_1.budgets[0]); // Vamos a hacer que el presupuesto exista
        const req = (0, node_mocks_http_1.createRequest)({
            params: {
                budgetId: 1
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, budget_1.validateBudgetExists)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.budget).toEqual(budgets_1.budgets[0]);
    });
});
describe('Budget Middleware - validateBudgetExists', () => {
});
describe('Budget Middleware - hasAccess', () => {
    it('should call next() if user has access to budget', () => {
        const req = (0, node_mocks_http_1.createRequest)({
            budget: budgets_1.budgets[0],
            user: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        (0, budget_1.hasAccess)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
    it('should return 401 error if userId does not have access to budget', () => {
        const req = (0, node_mocks_http_1.createRequest)({
            budget: budgets_1.budgets[0],
            user: { id: 2 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        (0, budget_1.hasAccess)(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({ error: 'Acción no válida' });
    });
});
//# sourceMappingURL=budget.test.js.map