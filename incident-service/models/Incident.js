const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Incident = sequelize.define("Incident", {

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM(
      "ACCIDENT",
      "TRAVAUX",
      "ROUTE_FERMEE",
      "EMBOUTEILLAGE"
    ),
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      "SIGNALE",
      "EN_COURS",
      "RESOLU"
    ),
    defaultValue: "SIGNALE"
  },

  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  }

});

module.exports = Incident;