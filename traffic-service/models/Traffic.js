const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Traffic = sequelize.define("Traffic", {

  location: {
    type: DataTypes.STRING,
    allowNull: false
  },

  level: {
    type: DataTypes.ENUM("FLUID", "MEDIUM", "HEAVY"),
    defaultValue: "FLUID"
  },

  speed: {
    type: DataTypes.FLOAT,
    allowNull: true
  }

});

module.exports = Traffic;