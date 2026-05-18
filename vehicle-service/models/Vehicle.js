const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Vehicle = sequelize.define("Vehicle", {
  plateNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: "Private",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Parked",
  }
});

module.exports = Vehicle;