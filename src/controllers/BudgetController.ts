import type { Request, Response } from 'express'
import Budget from '../models/Budget';
import Expense from '../models/Expense';

export class BudgetController {

    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                where: {
                    userId: req.user.id
                }
            })
            res.json(budgets)
        } catch (error) {
            // console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.create(req.body)
            budget.userId = req.user.id   // Autenticación
            await budget.save()
            res.status(201).json('Presupuesto Creado Correctamente')
        } catch (error: any) {
            // console.log(error)
            if (error.errors) {
                return res.status(400).json({
                    errors: error.errors.map((err: any) => err.message)
                })
            }
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getById = async (req: Request, res: Response) => {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense] // Como se puede tener relaciones con multiples modelos solo agregamos el nombre del modelo
        })

        res.json(budget)
    }
    
    static updateById = async (req: Request, res: Response) => {
        try {
            // Escribir los cambios del body
            await req.budget.update(req.body)
            res.json('Presupuesto actualizado correctamente')
        } catch (error: any) {
            if (error.errors) {
                return res.status(400).json({
                    errors: error.errors.map((err: any) => err.message)
                })
            }
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static deleteById = async (req: Request, res: Response) => {
            await req.budget.destroy()  // en el destroy colocamos req
            res.json('Presupuesto eliminado correctamente')
    }
}