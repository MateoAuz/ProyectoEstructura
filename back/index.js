const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Importar modelos para sincronizar
require('./models/Curso');
require('./models/Modulo');
require('./models/Leccion');
require('./models/Evaluacion');

// Sincronizar DB
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Modelos sincronizados'))
  .catch(err => console.log('❌ Error sync:', err));

// Rutas
app.get('/', (req, res) => res.send('API Proyecto Educativo'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

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
const evaluacionSimulacionRoutes = require('./routes/evaluacionSimulacionRoutes');
app.use('/api/evaluacion_simulacion', evaluacionSimulacionRoutes);
app.use('/api', require('./routes/evaluacionSimulacionRoutes'));
