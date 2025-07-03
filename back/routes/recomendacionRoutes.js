const express = require('express');
const router = express.Router();

const Leccion = require('../models/Leccion');
const Evaluacion = require('../models/Evaluacion');
const { tree, recorrerArbol } = require('../decisionTree');

router.post('/', async (req, res) => {
  const { tiempo, leccionId } = req.body;

  const leccionActual = await Leccion.findByPk(leccionId);
  if (!leccionActual) {
    return res.status(404).json({ mensaje: "Lección no encontrada" });
  }

  const evaluaciones = await Evaluacion.findAll({
    where: { LeccionId: leccionId }
  });

  const ultimaEval = evaluaciones[evaluaciones.length - 1];
  const reintentos = evaluaciones.length;

  // 🔥 NUEVO: propiedades simuladas para prueba
  const data = {
    noSesionDias: 10, // ejemplo: 10 días sin entrar
    puntaje: ultimaEval ? ultimaEval.puntaje_obtenido : 0,
    tiempoRespuestaPromedio: 8, // ejemplo: promedio en segundos
    lecturasAdicionales: true, // ejemplo: true si leyó extra
    reintentos: reintentos,
    vioVideos: false, // ejemplo: no vio videos
  };

  const recomendacion = recorrerArbol(tree, data);

  res.json({ recomendacion });
});

module.exports = router; // ✅ EXPORTACIÓN NECESARIA
