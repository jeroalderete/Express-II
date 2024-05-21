import { Router } from "express";
import { CartManager } from "../cartManager.js";


// almacenamos el cart mannager en una variable para poder ser manipulado directamente
const cartManager = new CartManager();

const cartsRouter = Router();

// CREAR UN NUEVO CARRITO /API/CARTS

cartsRouter.post('/', async (req, res) => {
    try {
        const response = await cartManager.newCart()
        res.json(response)
    } catch (error) {
        res.status(500).json({ message: 'Error al crear carrito' });
    }
})

// la ruta get /c:id debera listar los productos que pertenezcan al carrito con el parametro cid proporcionado

cartsRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        // obtenemos todos los productos del carrito , necesitamos el id del carrito
        const response = await cartManager.getCartProducts(cid);

        res.json(response);
    } catch (error) {
        res.send({
            message: "error al intentar enviar los productos del carrito",
        });
    }
});

// la ruta POST /c:id/product/:pid debera agregar el producto al arreglo products del carrito seleccionado, agregandose como un objeto bajo el siguiente formato

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    
    const { cid, pid } = req.params;

    try {
        // esta vez necesitamos ambos id del req params
        await cartManager.addProductToCart(cid, pid)
        res.send('producto agregado exitosamente')

    } catch (error) {
        res.send({
            message: "error al intentar guardar el producto"
        })
    }
})

export { cartsRouter };
