const express = require('express');
let app = express();

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria');

// Mostrar todas las categorias
app.get('/categoria', (req, res) => {

    Categoria.find({ estado: true })
    .sort('descripcion')
    .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }

            Categoria.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo: conteo
                })
            });
        });

});

// Mostrar una categoria por id
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No existe una categoria con ese ID'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        })

    });

});

// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

});

// Actualizar categoria
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Borrar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });

});

module.exports = app;