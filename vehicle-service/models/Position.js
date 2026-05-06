const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Vehicle = require("./Vehicle");

const Position = sequelize.define("Position", {
  lat: DataTypes.FLOAT,
  lng: DataTypes.FLOAT,
});

Vehicle.hasMany(Position);
Position.belongsTo(Vehicle);

module.exports = Position;