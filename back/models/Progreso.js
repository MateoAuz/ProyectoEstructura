const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Progreso = sequelize.define('Progreso', {
  EstudianteId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  CursoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ModuloDesbloqueado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});


module.exports = Progreso;
