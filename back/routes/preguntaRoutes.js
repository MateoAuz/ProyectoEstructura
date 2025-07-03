const express = require('express');
const router = express.Router();
const Pregunta = require('../models/Pregunta');

// GET - preguntas de una evaluación
router.get('/evaluacion/:evaluacionId', async (req, res) => {
  try {
    const preguntas = await Pregunta.findAll({ where: { EvaluacionId: req.params.evaluacionId } });
    res.json(preguntas);
  } catch (error) {
    console.error("Error al obtener preguntas:", error);
    res.status(500).json({ error: "Error al obtener preguntas" });
  }
});

router.post('/', async (req, res) => {
  try {
    const { texto, opciones, respuesta_correcta, EvaluacionId } = req.body;
    const pregunta = await Pregunta.create({ texto, opciones, respuesta_correcta, EvaluacionId });
    res.json(pregunta);
  } catch (error) {
    console.error("Error al crear pregunta:", error);
    res.status(500).json({ error: "Error al crear pregunta" });
  }
});

module.exports = router;