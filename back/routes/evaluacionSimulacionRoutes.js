const express = require('express');
const router = express.Router();
const Evaluacion = require('../models/Evaluacion');

// Simular intento de evaluación: solo compara puntaje con nota mínima
router.post('/simular', async (req, res) => {
  const { leccionId, puntaje } = req.body;
  const evaluacion = await Evaluacion.findOne({ where: { LeccionId: leccionId } });
  if (!evaluacion) return res.status(404).json({ mensaje: "Evaluación no encontrada" });
  // Compara el puntaje ingresado con la nota mínima
  const notaMinima = evaluacion.nota_minima || 7;
  const aprobado = parseInt(puntaje) >= notaMinima;
  res.json({ aprobado, notaMinima });
});

router.post('/recomendacion', async (req, res) => {
  const { leccionId, puntaje } = req.body;
  const evaluacion = await Evaluacion.findOne({ where: { LeccionId: leccionId } });
  if (!evaluacion) return res.status(404).json({ mensaje: "Evaluación no encontrada" });
  const notaMinima = evaluacion.nota_minima || 7;
  const aprobado = parseInt(puntaje) >= notaMinima;
  res.json({ aprobado, notaMinima });
});

module.exports = router;