import  type { Request, Response } from 'express'
import Expense from '../models/Expense';
import Budget from '../models/Budget';


export class ExpensesController {
    
    static getAll = async (req: Request, res: Response) => {
        res.json(req.expense)
    }
    static create = async (req: Request, res: Response) => {
        try {
            const expense = await Expense.create(req.body)
            expense.budgetId = req.budget.id
            await expense.save()
            res.status(201).json('Gasto Agregado Correctamente')
        } catch (error: any) {
            // console.log(error)
            if (error.errors) {
                return res.status(400).json({
                    errors: error.errors.map((err: any) => err.message)
                })
            }
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getById = async (req: Request, res: Response) => {
        res.json(req.expense)
    }

    static updateById = async (req: Request, res: Response) => {
        try {
            await req.expense.update(req.body)
            res.json('Se Actualizó Correctamente')
        } catch (error: any) {
            if (error.errors) {
                return res.status(400).json({
                    errors: error.errors.map((err: any) => err.message)
                })
            }
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static deleteById = async (req: Request, res: Response) => {
        await req.expense.destroy()
        res.json('Gasto Eliminado Correctamente')
    }
}