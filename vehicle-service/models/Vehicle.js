const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Vehicle = sequelize.define("Vehicle", {
  plateNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
<<<<<<< HEAD
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
=======
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
});

module.exports = Vehicle;