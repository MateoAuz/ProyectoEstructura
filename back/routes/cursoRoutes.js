const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');

router.get('/', async (req, res) => {
  const cursos = await Curso.findAll();
  res.json(cursos);
});

router.post('/', async (req, res) => {
  const curso = await Curso.create(req.body);
  res.json(curso);
});

router.patch('/:id', async (req, res) => {
  const { nombre } = req.body;
  const curso = await Curso.findByPk(req.params.id);
  if (!curso) return res.status(404).json({ mensaje: 'Curso no encontrado' });
  curso.nombre = nombre;
  await curso.save();
  res.json(curso);
});

router.delete('/:id', async (req, res) => {
  await Curso.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Curso eliminado' });
});

module.exports = router;
