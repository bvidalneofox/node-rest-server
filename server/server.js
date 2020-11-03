require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.json('Hello World')
});

app.post('/usuario', function (req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es requerido'
        });
    } else {
        res.json({
            ok: true,
            persona: body
        });
    }

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
});