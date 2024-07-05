const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');

app.use(bodyParser.json({ type: 'application/json' }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_curso_app'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});


//SELECT por medio del (GET)
app.get('/select', function (req, res) {
    connection.query(`SELECT idpersona, cedula, nombres, apellidos, fecha_nacimiento, direccion, telefono 
    FROM persona;`, function (error, results, fields) {
        if (error) throw error;
        res.json({
            p_datos_persona: results
        });
    });
});


//INSERT por medio del (POST)
app.post("/insert", function (req, res) {
    try{
    connection.query(`INSERT INTO persona
    (cedula, nombres, apellidos, fecha_nacimiento, direccion, telefono)
    VALUES(?, ?, ?, ?, ?, ?);
    `, [req.body.cedula, req.body.nombres, req.body.apellidos, req.body.fecha_nacimiento, req.body.direccion, req.body.telefono], function (error, results, fields) {
        if (error) {
            res.json({
                mensaje: "error de guardar"
            });
        }else{
            res.json({
                p_datos_persona: results
            });
        }
    });
}catch{
    res.json({
        mensaje: "error de guardar..."
    });
}
});


//UPDATE por medio del (POST)
app.put('/update', function (req, res) {
    try {
        connection.query(`UPDATE persona SET cedula = ?, nombres = ?, apellidos = ?, fecha_nacimiento = ?, direccion = ?, telefono = ? WHERE idpersona = ?;`,
            [req.body.cedula, req.body.nombres, req.body.apellidos, req.body.fecha_nacimiento, req.body.direccion, req.body.telefono, req.body.idpersona],
            function (error, results, fields) {
                if (error) {
                    res.json({
                        mensaje: "Error al actualizar"
                    });
                } else {
                    res.json({
                        p_datos_persona: results
                    });
                }
            });
    } catch (error) {
        res.json({
            mensaje: "Error al actualizar..."
        });
    }
});


//DELETE por medio del (POST)
app.delete('/delete', function (req, res) {
    try {
        connection.query(`DELETE FROM persona WHERE idpersona = ?;`,
            [req.body.idpersona],
            function (error, results, fields) {
                if (error) {
                    res.json({
                        mensaje: "Error al eliminar"
                    });
                } else {
                    res.json({
                        p_datos_persona: results
                    });
                }
            });
    } catch (error) {
        res.json({
            mensaje: "Error al eliminar..."
        });
    }
});


//WHERE por medio del (POST)
app.post('/where', function (req, res) {
    try {
        connection.query(`SELECT idpersona, cedula, nombres, apellidos, fecha_nacimiento, direccion, telefono FROM persona WHERE cedula = ?;`,
            [req.body.cedula],
            function (error, results, fields) {
                if (error) {
                    res.json({
                        mensaje: "Error al buscar"
                    });
                } else {
                    res.json({
                        p_datos_persona: results
                    });
                }
            });
    } catch (error) {
        res.json({
            mensaje: "Error al buscar..."
        });
    }
});
  
app.listen(3000);
console.log("Servidor iniciado en el puerto: " + 3000);