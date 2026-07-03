"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const budgets_1 = require("../mocks/budgets");
const BudgetController_1 = require("../../../controllers/BudgetController");
const Budget_1 = __importDefault(require("../../../models/Budget"));
const Expense_1 = __importDefault(require("../../../models/Expense"));
jest.mock('../../../models/Budget', () => ({
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
}));
describe('BudgetController.getAll', () => {
    beforeEach(() => {
        Budget_1.default.findAll.mockReset(); // Reinicia el mock cada que finalice uno de ellos.
        Budget_1.default.findAll.mockImplementation((options) => {
            const updatedBudgets = budgets_1.budgets.filter(budget => budget.userId === options.where.userId);
            return Promise.resolve(updatedBudgets);
        });
    });
    // beforeAll(() => { // Se va a ejecutar una sola vez
    // })
    // afterAll (() => { // Se va a ejecutar al finalizar todos los test
    // }) 
    // afterEach(() => { // Se ejecuta al finalizar cada test
    // })
    it('should retrieve 2 budgets for user with ID 1', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getAll(req, res);
        const data = res._getJSONData();
        expect(data).toHaveLength(2);
        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });
    it('should retrieve 1 budgets for user with ID 2', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 2 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getAll(req, res);
        const data = res._getJSONData();
        expect(data).toHaveLength(1);
        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });
    it('should retrieve 0 budgets for user with ID 10', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 100 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getAll(req, res);
        const data = res._getJSONData();
        expect(data).toHaveLength(0);
        expect(res.statusCode).toBe(200);
        expect(res.status).not.toBe(404);
    });
    it('should handle errors when fetching budgets', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'GET',
            url: '/api/budgets',
            user: { id: 100 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        Budget_1.default.findAll.mockRejectedValue(new Error('Fallo en la simulación'));
        await BudgetController_1.BudgetController.getAll(req, res);
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Hubo un error' });
    });
});
describe('BudgetConstroller', () => {
    it('Should create a new budget and respond with statusCode 201', async () => {
        const mockBudget = {
            save: jest.fn().mockResolvedValue(true)
        };
        Budget_1.default.create.mockResolvedValue(mockBudget);
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'POST',
            url: '/api/budgets',
            user: { id: 1 },
            body: { name: 'Presupuesto Prueba', amount: 1000 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.create(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(201);
        expect(data).toBe('Presupuesto Creado Correctamente'); // Usar Mayusulas para que pase la prueba
        expect(mockBudget.save).toHaveBeenCalled(); // Esta función se llamo
        expect(mockBudget.save).toHaveBeenCalledTimes(1);
        expect(Budget_1.default.create).toHaveBeenCalledWith(req.body);
    });
    it('Should handle budget creation error', async () => {
        const mockBudget = {
            save: jest.fn()
        };
        Budget_1.default.create.mockRejectedValue(new Error('Fallo en la simulación'));
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'POST',
            url: '/api/budgets',
            user: { id: 1 },
            body: { name: 'Presupuesto Prueba', amount: 1000 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.create(req, res);
        const data = res._getJSONData();
        // Mandamos a que no se llamen ciertos métodos
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: 'Hubo un error' });
        expect(mockBudget.save).not.toHaveBeenCalled();
        expect(Budget_1.default.create).toHaveBeenCalledWith(req.body);
    });
});
describe('BudgetController.getById', () => {
    beforeEach(() => {
        Budget_1.default.findByPk.mockImplementation((id, include) => {
            const budget = budgets_1.budgets.filter(b => b.id === id)[0];
            return Promise.resolve(budget);
        });
    });
    it('should return a budget with ID 1 and 3 expenses', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'GET',
            url: '/api/budgets/:budgetId',
            budget: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(3);
        expect(Budget_1.default.findByPk).toHaveBeenCalled();
        expect(Budget_1.default.findByPk).toHaveBeenCalledTimes(1);
        expect(Budget_1.default.findByPk).toHaveBeenCalledWith(req.budget.id, {
            include: [Expense_1.default]
        });
    });
    it('should return a budget with ID 2 and 2 expenses', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: { id: 2 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(2);
    });
    it('should return a budget with ID 3 and 0 expenses', async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'GET',
            url: '/api/budgets/:id',
            budget: { id: 3 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.getById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data.expenses).toHaveLength(0);
    });
});
describe('BudgetController.updateById', () => {
    it('should update the budget and return a success message', async () => {
        const budgetMock = {
            update: jest.fn().mockResolvedValue(true)
        };
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'PUT',
            url: '/api/budgets/:budgetId',
            budget: budgetMock,
            body: { name: 'Presupuesto Actualizado', amount: 5000 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.updateById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toBe('Presupuesto actualizado correctamente');
        expect(budgetMock.update).toHaveBeenCalled();
        expect(budgetMock.update).toHaveBeenCalledTimes(1);
        expect(budgetMock.update).toHaveBeenCalledWith(req.body);
    });
});
describe('BudgetController.deleteById', () => {
    it('should delete the budget and the return a success message', async () => {
        const budgetMock = {
            destroy: jest.fn().mockResolvedValue(true)
        };
        const req = (0, node_mocks_http_1.createRequest)({
            method: 'DELETE',
            url: '/api/budgets/:budgetId',
            budget: budgetMock
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await BudgetController_1.BudgetController.deleteById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toBe('Presupuesto eliminado correctamente');
        expect(budgetMock.destroy).toHaveBeenCalled();
        expect(budgetMock.destroy).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=BudgetController.test.js.map