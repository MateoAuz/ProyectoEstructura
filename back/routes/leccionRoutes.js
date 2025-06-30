const express = require('express');
const router = express.Router();
const Leccion = require('../models/Leccion');

// GET - listar todas las lecciones
router.get('/', async (req, res) => {
  const lecciones = await Leccion.findAll();
  res.json(lecciones);
});

// GET - lecciones de un módulo específico
router.get('/modulo/:moduloId', async (req, res) => {
  const lecciones = await Leccion.findAll({ where: { ModuloId: req.params.moduloId } });
  res.json(lecciones);
});

// POST - crear lección
router.post('/', async (req, res) => {
  const leccion = await Leccion.create(req.body);
  res.json(leccion);
});

// PUT - actualizar lección
router.put('/:id', async (req, res) => {
  await Leccion.update(req.body, { where: { id: req.params.id } });
  const leccion = await Leccion.findByPk(req.params.id);
  res.json(leccion);
});

// DELETE - eliminar lección
router.delete('/:id', async (req, res) => {
  await Leccion.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Lección eliminada' });
});

module.exports = router;
