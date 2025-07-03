const express = require('express');
const router = express.Router();
const Recomendacion = require('../models/Recomendacion');

// GET - recomendaciones de una evaluación
router.get('/evaluacion/:evaluacionId', async (req, res) => {
  const recs = await Recomendacion.findAll({ where: { EvaluacionId: req.params.evaluacionId } });
  res.json(recs);
});

// POST - crear recomendación
router.post('/', async (req, res) => {
  const { texto, EvaluacionId } = req.body;
  const rec = await Recomendacion.create({ texto, EvaluacionId });
  res.json(rec);
});

module.exports = router;
