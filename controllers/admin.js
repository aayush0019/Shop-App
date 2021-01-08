const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false
    })
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(null, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
    product.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    Product.findById(req.params.productId, product => {
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const postId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(postId, updatedTitle, updatedImageUrl, updatedDesc, updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: "Shop",
            path: "/admin/products"
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect("/admin/products");
}