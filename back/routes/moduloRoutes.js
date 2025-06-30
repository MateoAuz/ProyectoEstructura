const express = require('express');
const router = express.Router();
const Modulo = require('../models/Modulo');

// GET - listar todos los módulos
router.get('/', async (req, res) => {
  const modulos = await Modulo.findAll();
  res.json(modulos);
});

// GET - módulos de un curso específico
router.get('/curso/:cursoId', async (req, res) => {
  const modulos = await Modulo.findAll({ where: { CursoId: req.params.cursoId } });
  res.json(modulos);
});

// POST - crear módulo
router.post('/', async (req, res) => {
  const modulo = await Modulo.create(req.body);
  res.json(modulo);
});

// PUT - actualizar módulo
router.put('/:id', async (req, res) => {
  await Modulo.update(req.body, { where: { id: req.params.id } });
  const modulo = await Modulo.findByPk(req.params.id);
  res.json(modulo);
});

// DELETE - eliminar módulo
router.delete('/:id', async (req, res) => {
  await Modulo.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Módulo eliminado' });
});

module.exports = router;
