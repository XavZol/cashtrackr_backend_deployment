import type { Request, Response, NextFunction } from 'express'
import { param, validationResult, body } from 'express-validator'
import Expense from '../models/Expense';

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseInput  = async (req: Request, res: Response, next: NextFunction) => {

    await body('name')
        .notEmpty().withMessage('El nombre del gasto no puede ir vacío').run(req)

    await body('amount')
        .notEmpty().withMessage('La cantidad del gasto no puede ir vacía')
        .isNumeric().withMessage('Cantidad no válida')
        .custom(value => value > 0).withMessage('El gasto debe ser mayor a 0').run(req)

    next()
}

export const validateExpenseId =  async (req: Request, res: Response, next: NextFunction) => {

    await param('expenseId').isInt().custom(value => value > 0).withMessage('ID no válido').run(req)

    let errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => { // usamos el declare del middleware de budget
        try {
            const { expenseId } = req.params
            const expense = await Expense.findByPk(expenseId.toString()) 

            if(!expense) {
                const error = new Error('Gasto no encontrado')
                return res.status(404).json({error: error.message })
            }
            req.expense = expense
            next()
        } catch(error) {
            // console.log(error)
            res.status(500).json({error: 'Hubo un error'})
        }
}

export const belongsToBudget = async (req: Request, res: Response, next: NextFunction) => {
    console.log()
    if(req.budget.id !== req.expense.budgetId) { // Si queremos eliminar un gasto que no pertenece a este prsupuesto
        const error = new Error('Acción no válida')
        return res.status(403).json({error: error.message})
    }
    next()
}