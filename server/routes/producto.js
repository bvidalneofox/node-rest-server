const express = require('express');
let app = express();

const { verificaToken } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');

// Mostrar los productos
app.get('/productos', (req, res) => {
    // populate de usuario y categoria
    // paginado
    Producto.find({ disponible: true })
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo: conteo
                })
            });
        });
});

// Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    // populate de usuario y categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            res.json({
                ok: true,
                producto
            });
        });
});

// BUscar productos
app.get('/productos/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});

// Crear un nuevo producto
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar categoria
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });
});

// Actualizar productos
app.put('/productos/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

// Eliminar Producto
app.delete('/productos/:id', (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible:false}, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

module.exports = app;