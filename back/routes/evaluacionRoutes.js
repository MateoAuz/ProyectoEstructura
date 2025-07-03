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

  console.log("✅ Puntaje registrado:", puntaje_obtenido);

  // 🔥 NUEVO: actualizar progreso si aprueba
  if (puntaje_obtenido >= evaluacion.puntaje_maximo * 0.6) {
    const Leccion = require('../models/Leccion');
    const Modulo = require('../models/Modulo');
    const Progreso = require('../models/Progreso');

    const leccion = await Leccion.findByPk(evaluacion.LeccionId);
    const modulo = await Modulo.findByPk(leccion.ModuloId);

    console.log("✅ Leccion:", leccion ? leccion.id : "No encontrada");
    console.log("✅ Modulo:", modulo ? modulo.id : "No encontrado");
    console.log("✅ CursoId del modulo:", modulo ? modulo.CursoId : "No encontrado");

    if (!modulo || !modulo.CursoId) {
      console.log("❌ Error: Modulo o CursoId no encontrados.");
      return res.status(500).json({ mensaje: "Modulo o CursoId no encontrados." });
    }

    // 🔥 NUEVO: obtener todos los módulos de ese curso ordenados por ID
    const modulosCurso = await Modulo.findAll({
      where: { CursoId: modulo.CursoId },
      order: [['id', 'ASC']]
    });

    console.log("✅ Modulos del curso:", modulosCurso.map(m => m.id));

    // 🔍 Buscar el índice del módulo actual
    const indexActual = modulosCurso.findIndex(m => m.id === modulo.id);
    console.log("✅ Índice actual:", indexActual);

    // 🔍 Obtener el siguiente módulo en la lista
    const siguienteModulo = modulosCurso[indexActual + 1];
    console.log("✅ Siguiente modulo:", siguienteModulo ? siguienteModulo.id : "No existe");

    // 🔧 Buscar progreso actual
    let progreso = await Progreso.findOne({ where: { EstudianteId: 1, CursoId: modulo.CursoId } });

    if (!progreso) {
      // Si no existe progreso, crearlo con el módulo actual desbloqueado
      await Progreso.create({
        EstudianteId: 1,
        CursoId: modulo.CursoId,
        ModuloDesbloqueado: modulo.id
      });
      console.log("✅ Progreso creado con ModuloDesbloqueado =", modulo.id);
    } else {
      // ✅ Actualizar progreso si hay un siguiente módulo
      if (siguienteModulo && progreso.ModuloDesbloqueado < siguienteModulo.id) {
        progreso.ModuloDesbloqueado = siguienteModulo.id;
        await progreso.save();
        console.log("✅ Progreso actualizado a ModuloDesbloqueado =", siguienteModulo.id);
      }
    }
  }

  res.json({ mensaje: "Puntaje registrado y progreso procesado", evaluacion });
});






module.exports = router;
