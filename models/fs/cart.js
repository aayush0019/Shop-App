const fs = require("fs");
const path = require("path");

const p = path.join(
    path.dirname(require.main.filename),
    "data",
    "cart.json"
);

module.exports = class Cart {
    static addProduct(id, price) {
        let cart = { products: [], totalPrice: 0 };
        //Fetch the Cart Products
        fs.readFile(p, (err, fileContent) => {
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            //Analyze whether card already has the product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += +price;
            //Add the product
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice -= (productPrice * productQty);
            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            });
        });
    }

    static getProducts(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err)
                return cb(null);
            const cartProducts = { ...JSON.parse(fileContent) };
            cb(cartProducts);
        });
    }
}