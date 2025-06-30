const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Evaluacion = sequelize.define('Evaluacion', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  puntaje_maximo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  puntaje_obtenido: { // 🔥 nuevo campo
    type: DataTypes.INTEGER,
    allowNull: true
  },
  LeccionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Evaluacion;
