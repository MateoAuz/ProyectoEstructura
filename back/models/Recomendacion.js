const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Evaluacion = require('./Evaluacion');

const Recomendacion = sequelize.define('Recomendacion', {
  texto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  EvaluacionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Evaluacion.hasMany(Recomendacion, { onDelete: 'CASCADE' });
Recomendacion.belongsTo(Evaluacion);

module.exports = Recomendacion;
