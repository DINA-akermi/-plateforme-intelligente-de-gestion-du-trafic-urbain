const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Vehicle = sequelize.define("Vehicle", {
  plateNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Vehicle;