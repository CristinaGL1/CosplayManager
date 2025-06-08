require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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


// ---------------------------------------------------- MANEJO DE IMAGENES ----------------------------------------------------

const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, WEBP, AVIF y GIF.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
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
app.post('/addCosplay', upload.single('imagenCosplay'), (req, res) => {


    let imagenURL = null;
    if (req.file) {
        imagenURL = `/uploads/${req.file.filename}`;
    }

    const { nombre, userId } = req.body;
    const estado = req.body.estado || null;
    const descripcion = req.body.descripcion || null;
    const fechaInicio = req.body.fechaInicio || null;
    const fechaFin = req.body.fechaFin || null;

    if (!nombre || !userId) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: 'Nombre, estado, descripción y ID de usuario son campos requeridos.' });
    }

    try {
        const sql = 'INSERT INTO cosplays (nombre, estado, descripcion, fechaInicio, fechaFin, userId, imagenURL) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [nombre, estado, descripcion, fechaInicio, fechaFin, userId, imagenURL], (err, result) => {
            if (err) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'ERROR 409: Ya existe un cosplay con este nombre o ID duplicado.' });
                }
                console.error('Error al registrar el cosplay en la base de datos:', err);
                return res.status(500).json({ message: 'Error interno del servidor al guardar en DB.' });
            }

            res.status(201).json({
                message: 'Cosplay registrado exitosamente.',
                cosplayId: result.insertId,
                imagenURL: imagenURL
            });
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error general en el proceso de registro del cosplay:', error);
        res.status(500).json({ message: 'Error interno del servidor en el catch principal.' });
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


// Recuperar las task sin empezar de un cosplay
app.get('/api/getTask0/:id', async (req, res) => {
    const cosplayId = req.params.id;
    connection.query('SELECT * FROM tasks WHERE cosplayID = ? AND estado = 0', [cosplayId], (error, results) => {
        if (error) {
            console.error('Error al obtener las tareas:', error);
            res.status(500).json({ error: 'Error al obtener las tareas' });
            return;
        }
        res.json(results);
    });
});

// Recuperar las task en proceso de un cosplay
app.get('/api/getTask1/:id', async (req, res) => {
    const cosplayId = req.params.id;
    connection.query('SELECT * FROM tasks WHERE cosplayID = ? AND estado = 1', [cosplayId], (error, results) => {
        if (error) {
            console.error('Error al obtener las tareas:', error);
            res.status(500).json({ error: 'Error al obtener las tareas' });
            return;
        }
        res.json(results);
    });
});

// Recuperar las task finalizadas de un cosplay
app.get('/api/getTask2/:id', async (req, res) => {
    const cosplayId = req.params.id;
    connection.query('SELECT * FROM tasks WHERE cosplayID = ? AND estado = 2', [cosplayId], (error, results) => {
        if (error) {
            console.error('Error al obtener las tareas:', error);
            res.status(500).json({ error: 'Error al obtener las tareas' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/addTask', (req, res) => {

    const { nombre, estado, cosplayID } = req.body;

    console.log(nombre, cosplayID, estado)

    try {
        const sql = 'INSERT INTO tasks (nombre, estado, cosplayID) VALUES (?, ?, ?)';
        connection.query(sql, [nombre, estado, cosplayID], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'ERROR 409: Ya existe un cosplay con este nombre o ID duplicado.' });
                }
                console.error('Error al registrar el cosplay en la base de datos:', err);
                return res.status(500).json({ message: 'Error interno del servidor al guardar en DB.' });
            }

            res.status(201).json({
                message: 'Tarea registrada exitosamente.'
            });
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error general en el proceso de registro del cosplay:', error);
        res.status(500).json({ message: 'Error interno del servidor en el catch principal.' });
    }

});

app.get('/api/getTask/:id', async (req, res) => {
    const taskID = req.params.id;
    connection.query('SELECT * FROM tasks WHERE id = ?', [taskID], (error, results) => {
        if (error) {
            console.error('Error al obtener las tareas:', error);
            res.status(500).json({ error: 'Error al obtener las tareas' });
            return;
        }
        res.json(results);
    });
});

app.put('/saveTaskEdit/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre, estado, descripcion, coste, progreso } = req.body;

    try {
        const sql = 'UPDATE tasks SET nombre = ?, estado = ?, descripcion = ?, coste = ?, progreso = ? WHERE id = ?';
        connection.query(sql, [nombre, estado, descripcion, coste, progreso, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar la tarea:', err);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Tarea actualizada exitosamente.' });
            } else {
                res.status(404).json({ message: 'Tarea no encontrada.' });
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