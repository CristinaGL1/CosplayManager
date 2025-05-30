require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const admin = require('firebase-admin'); // Importa Firebase Admin SDK

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'cosplaymanager'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL exitosa!');
});

// Inicialización de Firebase Admin SDK usando variables de entorno
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID, // Si esta variable existe en tu .env
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN // Si esta variable existe en tu .env
};

if (serviceAccount.private_key) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.initializeApp(); // Intenta usar las credenciales del entorno si la clave privada no está
  console.warn('Firebase Admin SDK initialized without explicit private key from environment variables. Ensure environment is correctly configured.');
}

// Configuración de multer para guardar los archivos subidos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware para verificar el token de Firebase
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Nueva ruta para obtener la información del usuario logueado
app.get('/api/users/me', authenticate, async (req, res) => {
  const uid = req.uid;
  connection.query('SELECT id FROM usuarios WHERE firebase_uid = ?', [uid], (error, results) => {
    if (error) {
      console.error('Error al obtener el usuario:', error);
      return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ id: results[0].id });
  });
});

// Ruta para obtener todos los cosplays DE UN USUARIO ESPECÍFICO
app.get('/api/cosplays', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Se requiere el userId para obtener los cosplays.' });
  }
  connection.query('SELECT * FROM cosplays WHERE userId = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error al obtener los cosplays:', error);
      res.status(500).json({ error: 'Error al obtener los cosplays' });
      return;
    }
    res.json(results);
  });
});
// Nueva ruta para CREAR un nuevo cosplay
app.post('/api/cosplays', upload.single('imagen'), authenticate, async (req, res) => {
  const { nombre, estado, descripcion, fechaInicio, fechaFin } = req.body;
  const firebaseUid = req.uid; // Obtenemos el UID del usuario autenticado por Firebase
  let imagenUrl = '';
  if (req.file) {
    imagenUrl = `/uploads/${req.file.filename}`;
  }
  // 1. Buscar el id del usuario en la tabla 'usuarios' basado en el firebase_uid
  connection.query('SELECT id FROM usuarios WHERE firebase_uid = ?', [firebaseUid], (error, userResults) => {
    if (error) {
      console.error('Error al buscar el usuario:', error);
      return res.status(500).json({ error: 'Error al buscar el usuario' });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const userId = userResults[0].id;
    // 2. Insertar el nuevo cosplay con el userId encontrado
    const query = 'INSERT INTO cosplays (userId, nombre, estado, descripcion, fechaInicio, fechaFin, imagenUrl) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [userId, nombre, estado, descripcion, fechaInicio || null, fechaFin || null, imagenUrl];
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error al crear el cosplay:', error);
        res.status(500).json({ error: 'Error al crear el cosplay' });
        return;
      }
      const newCosplayId = results.insertId;
      connection.query('SELECT * FROM cosplays WHERE id = ?', [newCosplayId], (err, newCosplayResults) => {
        if (err) {
          console.error('Error al obtener el nuevo cosplay:', err);
          res.status(201).json({ message: 'Cosplay creado' });
          return;
        }
        res.status(201).json(newCosplayResults[0]);
      });
    });
  });
});
// Nueva ruta para obtener un cosplay por su ID
app.get('/api/cosplays/:id', (req, res) => {
  const cosplayId = req.params.id;
  connection.query('SELECT * FROM cosplays WHERE id = ?', [cosplayId], (error, results) => {
    if (error) {
      console.error('Error al obtener el cosplay:', error);
      res.status(500).json({ error: 'Error al obtener el cosplay' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'Cosplay no encontrado' });
      return;
    }
    res.json(results[0]); // Devolvemos el primer (y único) resultado
  });
});

// Nueva ruta para actualizar un cosplay por su ID (incluyendo la subida de imagen)
app.put('/api/cosplays/:id', upload.single('imagenFile'), (req, res) => {
  const cosplayId = req.params.id;
  const { nombre, estado, descripcion, fechaInicio, fechaFin, imagenUrl: urlDesdeForm } = req.body;
  let imagenUrl = urlDesdeForm; // Mantener la URL si se proporcionó en el formulario
  if (req.file) {
    imagenUrl = `/uploads/${req.file.filename}`; // Generamos la nueva URL si se subió un archivo
  } else {
    connection.query('SELECT imagenUrl FROM cosplays WHERE id = ?', [cosplayId], (err, results) => {
      if (err) {
        console.error('Error al obtener la imagen actual:', err);
      } else if (results.length > 0 && results[0].imagenUrl) {
        imagenUrl = results[0].imagenUrl; // Usar la URL existente de la base de datos
      }
      const query = 'UPDATE cosplays SET nombre = ?, estado = ?, descripcion = ?, fechaInicio = ?, fechaFin = ?, imagenUrl = ? WHERE id = ?';
      const values = [nombre, estado, descripcion, fechaInicio || null, fechaFin || null, imagenUrl, cosplayId];
      connection.query(query, values, (error, results) => {
        if (error) {
          console.error('Error al actualizar el cosplay:', error);
          res.status(500).json({ error: 'Error al actualizar el cosplay' });
          return;
        }
        if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Cosplay no encontrado' });
          return;
        }
        connection.query('SELECT * FROM cosplays WHERE id = ?', [cosplayId], (err, updatedResults) => {
          if (err) {
            console.error('Error al obtener el cosplay actualizado:', err);
            res.status(200).json({ message: 'Cosplay actualizado' });
            return;
          }
          res.json(updatedResults[0]);
        });
      });
    });
    return;
  }
  const query = 'UPDATE cosplays SET nombre = ?, estado = ?, descripcion = ?, fechaInicio = ?, fechaFin = ?, imagenUrl = ? WHERE id = ?';
  const values = [nombre, estado, descripcion, fechaInicio || null, fechaFin || null, imagenUrl, cosplayId];
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error al actualizar el cosplay:', error);
      res.status(500).json({ error: 'Error al actualizar el cosplay' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Cosplay no encontrado' });
      return;
    }
    connection.query('SELECT * FROM cosplays WHERE id = ?', [cosplayId], (err, updatedResults) => {
      if (err) {
        console.error('Error al obtener el cosplay actualizado:', err);
        res.status(200).json({ message: 'Cosplay actualizado' });
        return;
      }
      res.json(updatedResults[0]);
    });
  });
});
// Ruta para ELIMINAR un cosplay por su ID
app.delete('/api/cosplays/:id', authenticate, (req, res) => {
  const cosplayId = req.params.id;
  const firebaseUid = req.uid; // Obtén el UID del usuario autenticado
  connection.query('SELECT userId FROM cosplays c JOIN usuarios u ON c.userId = u.id WHERE c.id = ? AND u.firebase_uid = ?', [cosplayId, firebaseUid], (error, results) => {
    if (error) {
      console.error('Error al verificar la propiedad del cosplay:', error);
      return res.status(500).json({ error: 'Error al verificar la propiedad del cosplay' });
    }
    if (results.length === 0) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este cosplay o no existe.' });
    }
    connection.query('DELETE FROM cosplays WHERE id = ?', [cosplayId], (error, deleteResults) => {
      if (error) {
        console.error('Error al eliminar el cosplay:', error);
        return res.status(500).json({ error: 'Error al eliminar el cosplay' });
      }
      if (deleteResults.affectedRows === 0) {
        return res.status(404).json({ message: 'Cosplay no encontrado' });
      }
      res.json({ message: 'Cosplay eliminado con éxito' });
    });
  });
});
// Nueva ruta para registrar un usuario desde Firebase
app.post('/api/users', (req, res) => {
  const { firebaseUid, email } = req.body;
  if (!firebaseUid || !email) {
    return res.status(400).json({ error: 'Se requiere firebaseUid y email' });
  }
  const query = 'INSERT INTO usuarios (firebase_uid, email) VALUES (?, ?)';
  connection.query(query, [firebaseUid, email], (error, results) => {
    if (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
      return;
    }
    res.status(201).json({ message: 'Usuario registrado con éxito', userId: results.insertId });
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});