const express = require('express');
const router = express.Router();
const { obtenerRecomendacionAleatoria } = require('../decisionTree'); // o '../recomendacionAI' si la tienes separada

router.get('/', (req, res) => {
  const recomendacion = obtenerRecomendacionAleatoria();
  res.json({ recomendacion });
});

module.exports = router;
