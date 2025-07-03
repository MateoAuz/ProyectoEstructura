const express = require('express');
const router = express.Router();
const Progreso = require('../models/Progreso');

router.post('/actualizar', async (req, res) => {
  const { EstudianteId, nuevoModulo, CursoId } = req.body;

  try {
    let progreso = await Progreso.findOne({ where: { EstudianteId, CursoId } });

    if (progreso) {
      if (progreso.ModuloDesbloqueado < nuevoModulo) {
        progreso.ModuloDesbloqueado = nuevoModulo;
        await progreso.save();
      }
    } else {
      progreso = await Progreso.create({ EstudianteId, CursoId, ModuloDesbloqueado: nuevoModulo });
    }

    res.json({ mensaje: '✅ Progreso actualizado', progreso });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: '❌ Error al actualizar progreso' });
  }
});


router.get('/:estudianteId/:cursoId', async (req, res) => {
  try {
    const progreso = await Progreso.findOne({ where: { EstudianteId: req.params.estudianteId, CursoId: req.params.cursoId } });
    if (progreso) {
      res.json(progreso);
    } else {
      res.json({ ModuloDesbloqueado: 1 }); // default si no existe
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: '❌ Error al obtener progreso' });
  }
});


module.exports = router;
