const express = require('express');
const router = express.Router();
const Leccion = require('../models/Leccion');
const Evaluacion = require('../models/Evaluacion');
const { Op } = require('sequelize');

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
  let recomendacion = "";

  // 🔧 Nueva lógica de árbol de decisión realista
  if (puntaje >= 9) {
    recomendacion = `Excelente desempeño en ${leccionActual.nombre}. Puedes avanzar a una lección avanzada si está disponible.`;

    let siguienteNivel = "";
    if (leccionActual.nivel === 'básico') siguienteNivel = 'intermedio';
    else if (leccionActual.nivel === 'intermedio') siguienteNivel = 'avanzado';

    if (siguienteNivel !== "") {
      const leccionSuperior = await Leccion.findOne({
        where: {
          ModuloId: leccionActual.ModuloId,
          nivel: siguienteNivel
        }
      });

      if (leccionSuperior) {
        recomendacion += ` Te recomendamos: ${leccionSuperior.nombre} (Nivel ${siguienteNivel}).`;
      } else {
        recomendacion += " No hay lecciones de nivel superior en este módulo.";
      }
    }

  } else if (puntaje >= 7) {
    recomendacion = `Buen puntaje en ${leccionActual.nombre}. Te sugerimos reforzar con ejercicios prácticos antes de avanzar.`;
  } else if (puntaje >= 5) {
    recomendacion = `Tu puntaje en ${leccionActual.nombre} indica que debes repasar la teoría y repetir la evaluación para afianzar conocimientos.`;
  } else {
    recomendacion = `Debes reforzar la lección actual: ${leccionActual.nombre} y considera solicitar tutoría o asistencia personalizada.`;
  }

  res.json({ recomendacion });
});

module.exports = router;
