"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BudgetController_1 = require("../controllers/BudgetController");
const validation_1 = require("../middleware/validation");
const budget_1 = require("../middleware/budget");
const ExpenseController_1 = require("../controllers/ExpenseController");
const expense_1 = require("../middleware/expense");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate); // Protegemos todos los métodos del router 
router.param('budgetId', budget_1.validateBudgetId); // con esto evitamos la duplicidad de códgo en cada endpoint
router.param('budgetId', budget_1.validateBudgetExists); // con esto evitamos la duplicidad de códgo en cada endpoint
router.param('budgetId', budget_1.hasAccess); // revisa si alguien tiene acceso a los presupuestos
router.param('expenseId', expense_1.validateExpenseId);
router.param('expenseId', expense_1.validateExpenseExists);
router.param('expenseId', expense_1.belongsToBudget);
router.get('/', BudgetController_1.BudgetController.getAll);
router.post('/', budget_1.validateBudgetInput, validation_1.handleInputErrors, BudgetController_1.BudgetController.create);
router.get('/:budgetId', BudgetController_1.BudgetController.getById);
router.put('/:budgetId', budget_1.validateBudgetInput, validation_1.handleInputErrors, BudgetController_1.BudgetController.updateById);
router.delete('/:budgetId', BudgetController_1.BudgetController.deleteById);
/** Routes for expenses  */
// Patron Roa arquitectura orienntada a recursos
router.get('/:budgetId/expenses', ExpenseController_1.ExpensesController.getAll);
router.post('/:budgetId/expenses', expense_1.validateExpenseInput, validation_1.handleInputErrors, ExpenseController_1.ExpensesController.create);
/** Obtener, actualizar y eliminar */
router.get('/:budgetId/expenses/:expenseId', ExpenseController_1.ExpensesController.getById);
router.put('/:budgetId/expenses/:expenseId', expense_1.validateExpenseInput, validation_1.handleInputErrors, ExpenseController_1.ExpensesController.updateById);
router.delete('/:budgetId/expenses/:expenseId', ExpenseController_1.ExpensesController.deleteById);
exports.default = router;
//# sourceMappingURL=budgetRouter.js.map