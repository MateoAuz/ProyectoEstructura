const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Curso = require('./Curso');

const Modulo = sequelize.define('Modulo', {
  nombre: DataTypes.STRING,
});

Curso.hasMany(Modulo, { onDelete: 'CASCADE' });
Modulo.belongsTo(Curso);

module.exports = Modulo;
