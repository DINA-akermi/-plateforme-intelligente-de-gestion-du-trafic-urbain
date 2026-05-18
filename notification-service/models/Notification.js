const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Notification = sequelize.define("Notification", {
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: "INFO"
  },
  recipientRole: {
    type: DataTypes.ENUM("ADMIN", "OPERATOR", "ALL"),
    defaultValue: "ALL"
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Notification;