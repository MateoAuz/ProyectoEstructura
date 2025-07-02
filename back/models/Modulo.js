const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Curso = require('./Curso');

const Modulo = sequelize.define('Modulo', {
  nombreModulo: DataTypes.STRING,
  contenido: DataTypes.TEXT, // Nuevo campo para contenido adicional
});

Curso.hasMany(Modulo, { onDelete: 'CASCADE' });
Modulo.belongsTo(Curso);

module.exports = Modulo;