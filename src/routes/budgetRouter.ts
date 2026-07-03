import { Router } from 'express'
import { body} from 'express-validator'
import { BudgetController } from  '../controllers/BudgetController'
import { handleInputErrors } from '../middleware/validation';
import { hasAccess, validateBudgetExists, validateBudgetId, validateBudgetInput } from '../middleware/budget';
import { ExpensesController } from '../controllers/ExpenseController';
import { belongsToBudget, validateExpenseExists, validateExpenseId, validateExpenseInput } from '../middleware/expense';
import { authenticate } from '../middleware/auth';

const router = Router()

router.use(authenticate) // Protegemos todos los métodos del router 

router.param('budgetId', validateBudgetId) // con esto evitamos la duplicidad de códgo en cada endpoint
router.param('budgetId', validateBudgetExists) // con esto evitamos la duplicidad de códgo en cada endpoint
router.param('budgetId', hasAccess) // revisa si alguien tiene acceso a los presupuestos

router.param('expenseId', validateExpenseId) 
router.param('expenseId', validateExpenseExists)  
router.param('expenseId', belongsToBudget)  

router.get('/', BudgetController.getAll)

router.post('/',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create
)
router.get('/:budgetId',
    BudgetController.getById
)

router.put('/:budgetId',
        validateBudgetInput,
        handleInputErrors,
    BudgetController.updateById
)

router.delete('/:budgetId', 
    BudgetController.deleteById
)

/** Routes for expenses  */

// Patron Roa arquitectura orienntada a recursos
router.get('/:budgetId/expenses', ExpensesController.getAll)
router.post('/:budgetId/expenses', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create
)

/** Obtener, actualizar y eliminar */
router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById)
router.put('/:budgetId/expenses/:expenseId', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.updateById)
router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById)

export default router;