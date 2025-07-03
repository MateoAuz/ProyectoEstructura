const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./db');

const app = express(); // 🔵 Declaración de app antes de usar app.use

app.use(cors());
app.use(express.json());

// Importar modelos para sincronizar
require('./models/Curso');
require('./models/Modulo');
require('./models/Leccion');
require('./models/Evaluacion');
require('./models/Recomendacion');
require('./models/Progreso');

// Sincronizar DB
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Modelos sincronizados'))
  .catch(err => console.log('❌ Error sync:', err));

// Rutas base
app.get('/', (req, res) => res.send('API Proyecto Educativo'));

// Importar y usar rutas
const cursoRoutes = require('./routes/cursoRoutes');
app.use('/api/cursos', cursoRoutes);

const moduloRoutes = require('./routes/moduloRoutes');
app.use('/api/modulos', moduloRoutes);

const leccionRoutes = require('./routes/leccionRoutes');
app.use('/api/lecciones', leccionRoutes);

const evaluacionRoutes = require('./routes/evaluacionRoutes');
app.use('/api/evaluaciones', evaluacionRoutes);

const recomendacionRoutes = require('./routes/recomendacionRoutes');
app.use('/api/recomendacion', recomendacionRoutes);

const recomendacionCrudRoutes = require('./routes/recomendacionCrudRoutes');
app.use('/api/recomendaciones', recomendacionCrudRoutes);

const preguntaRoutes = require('./routes/preguntaRoutes');
app.use('/api/preguntas', preguntaRoutes);

const progresoRoutes = require('./routes/progresoRoutes');
app.use('/api/progreso', progresoRoutes);

const recomendacionAIRoutes = require('./routes/recomendacionAIRoutes');
app.use('/api/recomendacionAI', recomendacionAIRoutes);



// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
