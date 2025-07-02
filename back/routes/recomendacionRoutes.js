const express = require('express');
const router = express.Router();
const Leccion = require('../models/Leccion');
const Evaluacion = require('../models/Evaluacion');
const { tree, recorrerArbol } = require('../decisionTree');

// Ahora acepta puntaje directamente desde el body,
// y ya no depende de buscar la última evaluación registrada.
// El tiempo se pone por defecto a 0, o puedes agregarlo si lo requieres.
router.post('/', async (req, res) => {
  const { puntaje, leccionId } = req.body;

  const leccionActual = await Leccion.findByPk(leccionId);
  if (!leccionActual) {
    return res.status(404).json({ mensaje: "Lección no encontrada" });
  }

  // Puedes eliminar la búsqueda de Evaluacion si ya no es necesaria.
  // Si quieres mantenerla para validación adicional, la puedes dejar.
  // Aquí la eliminamos para que la simulación funcione con el puntaje ingresado.

  // Preparar datos de entrada para el árbol de decisión.
  const data = {
    puntaje: parseInt(puntaje),
    tiempo: 0 // o puedes aceptar un campo tiempo si lo necesitas.
  };

  // Obtener recomendación usando el árbol de decisión
  const recomendacion = recorrerArbol(tree, data);

  // Si el árbol retorna objeto con mensaje, extraer mensaje.
  const mensaje = typeof recomendacion === "string" ? recomendacion : recomendacion.mensaje;

  res.json({ mensaje });
});

module.exports = router;
