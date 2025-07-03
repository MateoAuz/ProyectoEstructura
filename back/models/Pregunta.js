const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Evaluacion = require('./Evaluacion');

const Pregunta = sequelize.define('Pregunta', {
  texto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  opciones: {
    type: DataTypes.JSON, // guardaremos como array de strings
    allowNull: false
  },
  respuesta_correcta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  EvaluacionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Evaluacion.hasMany(Pregunta, { onDelete: 'CASCADE' });
Pregunta.belongsTo(Evaluacion);

module.exports = Pregunta;
