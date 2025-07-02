const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Evaluacion = sequelize.define('Evaluacion', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // IMPORTANTE: Este campo ahora se usa para almacenar el puntaje mínimo para aprobar, NO el máximo
  puntaje_maximo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  puntaje_obtenido: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  LeccionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Evaluacion;