const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Leccion = sequelize.define('Leccion', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nivel: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['básico', 'intermedio', 'avanzado']]
    }
  },
  ModuloId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Leccion;
