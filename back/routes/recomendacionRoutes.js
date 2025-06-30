const express = require('express');
const router = express.Router();
const Leccion = require('../models/Leccion');
const Evaluacion = require('../models/Evaluacion');
const { tree, recorrerArbol } = require('../decisionTree');

router.post('/', async (req, res) => {
  const { tiempo, leccionId } = req.body;

  // 🔎 Buscar la lección actual
  const leccionActual = await Leccion.findByPk(leccionId);
  if (!leccionActual) {
    return res.status(404).json({ mensaje: "Lección actual no encontrada" });
  }

  // 🔥 Buscar la última evaluación registrada de esta lección
  const evaluacion = await Evaluacion.findOne({
    where: { LeccionId: leccionId },
    order: [['createdAt', 'DESC']]
  });

  if (!evaluacion || evaluacion.puntaje_obtenido === null) {
    return res.status(404).json({ mensaje: "No hay puntaje registrado en la evaluación de esta lección" });
  }

  const puntaje = evaluacion.puntaje_obtenido;

  // ✅ Preparar datos de entrada para el árbol
  const data = {
    puntaje,
    tiempo
  };

  // 🌳 Obtener recomendación usando el árbol de decisión
  const recomendacion = recorrerArbol(tree, data);

  res.json({ recomendacion });
});

module.exports = router;
