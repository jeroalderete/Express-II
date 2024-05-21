import express from 'express'
// import { ProductManager } from './productManager.js';
import { cartsRouter } from './routes/carts.router.js';

const PORT = 3000

const app = express();

app.use(express.json())


app.use('/api/carts', cartsRouter)


app.listen(PORT, (req, res) => {
    console.log(`servidor escuchando en el puerto ${PORT}`)
})


