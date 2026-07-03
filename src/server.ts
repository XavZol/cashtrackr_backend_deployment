import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from './routes/budgetRouter'
import authRouter from './routes/authRouter'
// import { limiter } from './config/limiter';

// Dns resolve por cualquier problema local de red
// import { setServers } from 'node:dns/promises'
// setServers(["1.1.1.1", "8.8.8.8"]);

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.blue.bold('Conexión exitosa a la BD'))
    } catch (error) {
        // console.log(colors.red .bold('Fallo la conexión a la Bd'))
    }
}
connectDB()

const app = express()

app.use(morgan('dev'))

app.use(express.json())

// app.use(limiter)  Proteger el servidor de request

app.use('/api/budgets', budgetRouter)
app.use('/api/auth', authRouter)

app.use('/', (req, res) => {
    res.send('todo bien')
})

export default app