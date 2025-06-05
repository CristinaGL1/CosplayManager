require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser') // Manejo de cookies

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',  // o el puerto donde está tu frontend
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'Localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_DATABASE || 'cosplaymanager'
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conexión a MySQL exitosa!');
});


// Ruta para el registro de usuarios
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    try {

        // Insertar el nuevo usuario en la base de datos
        const sql = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';
        connection.query(sql, [email, password], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // Si el email ya existe
                    return res.status(409).json({ message: 'El email ya está registrado.' });
                }
                console.error('Error al registrar usuario:', err);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            }
            res.status(201).json({ message: 'Usuario registrado exitosamente.', userId: result.insertId });
        });
    } catch (error) {
        console.error('Error en el proceso de registro:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});


// Ruta para el login de usuarios
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validación básica de entrada
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    // Buscar el usuario por email
    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }

        if (results.length === 0) {
            // Usuario no encontrado
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const user = results[0];

        if (password == user.password) {
            
            res.status(200).json({ message: 'Login exitoso.', userId: user.id, email: user.email });

        } else {
            res.status(401).json({ message: 'Credenciales inválidas.' });
        }
    });
});

// 
//#region ----- API Manejo de cookies -----

//#endregion

app.get('/cosplayList', async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ message: 'Se requiere el ID del usuario para obtener sus cosplays.' });
    }

    const sql = 'SELECT * FROM cosplays WHERE userId = ?';
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error al buscar cosplays:', err);
            return res.status(500).json({ message: 'Error interno del servidor al buscar cosplays.' });
        }
        res.json(results); // Envía la lista de cosplays para el userId
    });
});

// Ruta para el registro de cosplays
app.post('/addcosplay', async (req, res) => {
    const { nombre, estado, descripcion, fechaInicio, fechaFin, userId, imagenURL } = req.body;

    try {

        // Insertar el nuevo usuario en la base de datos
        const sql = 'INSERT INTO cosplays (nombre, estado, descripcion, fechaInicio, fechaFin, userId, imagenURL) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [nombre, estado, descripcion, fechaInicio, fechaFin, userId, imagenURL], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // Si el email ya existe
                    return res.status(409).json({ message: 'ERROR 409' });
                }
                console.error('Error al registrar el cosplay:', err);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            }
            res.status(201).json({ message: 'Cosplay registrado exitosamente.', userId: result.insertId });
        });
    } catch (error) {
        console.error('Error en el proceso de registro:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Ruta para obtener todos los cosplays DE UN USUARIO ESPECÍFICO
app.get('/api/cosplays/:id', (req, res) => {
    const cosplayId = req.params.id;
    connection.query('SELECT * FROM cosplays WHERE id = ?', [cosplayId], (error, results) => {
        if (error) {
            console.error('Error al obtener los cosplays:', error);
            res.status(500).json({ error: 'Error al obtener los cosplays' });
            return;
        }
        res.json(results);
    });
});

// Ruta para modificar un cosplay
app.put('/changecosplay/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre, estado, descripcion, fechaInicio, fechaFin, imagenURL } = req.body;
    try {
        const sql = 'UPDATE cosplays SET nombre = ?, estado = ?, descripcion = ?, fechaInicio = ?, fechaFin = ?, imagenURL = ? WHERE id = ?';
        connection.query(sql, [nombre, estado, descripcion, fechaInicio, fechaFin, imagenURL, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar el cosplay:', err);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Cosplay actualizado exitosamente.' });
            } else {
                res.status(404).json({ message: 'Cosplay no encontrado.' });
            }
        });
    } catch (error) {
        console.error('Error en el proceso de actualización:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Ruta para modificar un cosplay
app.delete('/deleteCosplays/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const sql = 'DELETE FROM cosplays WHERE id = ?';
        connection.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al borrar el cosplay:', err);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Cosplay eliminido exitosamente.' });
            } else {
                res.status(404).json({ message: 'Cosplay no encontrado.' });
            }
        });
    } catch (error) {
        console.error('Error en el proceso de actualización:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});