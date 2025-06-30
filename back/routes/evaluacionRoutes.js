const express = require('express');
const router = express.Router();
const Evaluacion = require('../models/Evaluacion');

// GET - listar todas las evaluaciones
router.get('/', async (req, res) => {
  const evaluaciones = await Evaluacion.findAll();
  res.json(evaluaciones);
});

// GET - evaluaciones de una lección específica
router.get('/leccion/:leccionId', async (req, res) => {
  const evaluaciones = await Evaluacion.findAll({ where: { LeccionId: req.params.leccionId } });
  res.json(evaluaciones);
});

// POST - crear evaluación
router.post('/', async (req, res) => {
  const evaluacion = await Evaluacion.create(req.body);
  res.json(evaluacion);
});

// PUT - actualizar evaluación
router.put('/:id', async (req, res) => {
  await Evaluacion.update(req.body, { where: { id: req.params.id } });
  const evaluacion = await Evaluacion.findByPk(req.params.id);
  res.json(evaluacion);
});

// DELETE - eliminar evaluación
router.delete('/:id', async (req, res) => {
  await Evaluacion.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Evaluación eliminada' });
});

router.patch('/:id/puntaje', async (req, res) => {
  const { puntaje_obtenido } = req.body;

  const evaluacion = await Evaluacion.findByPk(req.params.id);
  if (!evaluacion) {
    return res.status(404).json({ mensaje: "Evaluación no encontrada" });
  }

  evaluacion.puntaje_obtenido = puntaje_obtenido;
  await evaluacion.save();

  res.json({ mensaje: "Puntaje registrado correctamente", evaluacion });
});


module.exports = router;
