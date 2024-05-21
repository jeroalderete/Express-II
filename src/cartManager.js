import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";


export class CartManager {

    // con el metodo constructor inicializamos la clase
    constructor() {
        this.path = "./carts.json";
        this.carts = [];
    }

    // vamos a traernos todos los carritos que vamos a tener en el cart.json

    getCarts = async () => {
        const response = await fs.readFile(this.path, "utf8");
        const responseJSON = JSON.parse(response) // parseamos la data a json para poder leerla
        return responseJSON; d
    };

    // vamos a a listar todos los poductos que pertenezcan a un carrito en particular
    // accedemos a ese carrito por el id como parametro url para listar todos los productos

    // vamos a recibir el id del carrito
    getCartProducts = async (id) => {

        // como necesitamos leer lo que esta dentro del carrito primero tenemos que traernos todos esos carritos y encontrar cuyo ID sea igual al recibido por parametro
        // vamos a hacer uso de la funcion getCarts para traer todos los carritos y despues el uso del find para encontrar el carrito que coincida coin el id

        // llamamos a la func para traer todos los carritos
        const carts = await this.getCarts();

        // una vez que tenemos todos los carritos vamos a buscar por find para matchear con el id recibido x parametro
        const cart = carts.find((cart) => cart.id === id);

        // si existe ese carrito quiero que me devuelvas todo lo que contiene la propiedad products que tiene un array vacio en esta instancia
        if (cart) {
            return cart.products;
        } else {
            console.log("carrito no encontrado");
        }
    };

    // creamos la funcion para un nuevo carrito

    newCart = async () => {
        try {
            // generamos un id automatico para el cart 
            const id = uuidv4() // esto nos trae un string largo con numero aleatorios
            // hacemos un nuevo carrito que se va a visualizar como objeto 
            // este objeto va a contener el id generado automaticamente y la propiedad productos con el array vacio donde vamos a pushear los productos
            const newCart = { id, products: [] }

            // una vez armado este nuevo carrito, vamos a traernos todos los carritos que existen para guardarlos en el array de arriba this.carts
            this.carts = await this.getCarts(); // la funcione getCarts() lo que hace es leer todo lo que tenemos en cart.json y nos devuelve todo

            // pusheamos el nuevo carrito una vez que tenemos todos los carritos
            // una vez que tenemos todos los carritos en el array pusheamos el nuevo carrito al array , 

            this.carts.push(newCart)

            // una vz que tenemos todos los carritos incluyendo el nuevo vamos a guardarlo en el filesystem
            // escribimos especificando con el path y parseamos a string de this.carts por que es donde tenemos todos los carritos
            // y ya despues podemos escribir en el archivo cart.json todo el array que tenemos en carrito

            await fs.writeFile(this.path, JSON.stringify(this.carts))

            // retornamos el nuevo carrito para poder verlo en postman
            return newCart;

        } catch (error) {
            console.error('Error creating new cart:', error);
            throw new Error('Unable to create new cart');
        }
    }

    // funcion mas compleja - solo hay que agregar el id del producto y la cantidad unicamente, no tood el producto
    // pero si el producto ya existe en el carrito actualizamos la quantity unicamente
    // ademas si un producto ya existente intenta agrearse al producto, incrementar el campo quantity 

    // recibimos el id del carrito al cual queremos agregar el prod y el id del produ que queremos agregar al carrito

    addProductToCart = async (cart_id, product_id) => {

        // obtenemos todos los carritos para su lectura
        const carts = await this.getCarts();
        const index = carts.findIndex(cart => cart.id === cart_id) // encontramos el carrito por su index y evaluamos si coincide con el recibido por parametro

        // si es distinto a -1 es decir encontro algo

        if (index !== -1) {
            // si ese indice existe nos traemos todos los productos que tenga ese carrito con ese id
            const cartProducts = await this.getCartProducts(cart_id)

            const existingProductIndex = cartProducts.findIndex(product => product.product_id === product_id)

            // si existe ese existing product le vamos a sumar uno sino lo pusheamos 
            if (existingProductIndex !== -1) {
                // dsps preguntamos si ese producto ya existe le modifico la propiedad quantity
                cartProducts[existingProductIndex].quantity = cartProducts[existingProductIndex].quantity + 1
            } else {
                cartProducts.push({ product_id, quantity: 1 })
            }

            // accediendo al indice de ese cart y al producto es igual al cart products
            // se iguala a cartproducts porq ue lo modifricamos con el quantity entonces hay que sobreeescribirlo
            carts[index].products = cartProducts

            // una vez que cartproducts ua esta sobrescrito sobrescribo todo el archivo
            await fs.writeFile(this.path, JSON.stringify(carts))

            console.log("produto agregado con exito")

        } else {
            console.log("carrito no encontrado")
        }

    }









}
