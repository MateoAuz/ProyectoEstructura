const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Curso = sequelize.define('Curso', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Curso;
