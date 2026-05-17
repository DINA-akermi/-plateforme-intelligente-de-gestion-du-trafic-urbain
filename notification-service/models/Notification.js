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
<<<<<<< HEAD
  recipientRole: {
    type: DataTypes.ENUM("ADMIN", "OPERATOR", "ALL"),
    defaultValue: "ALL"
  },
=======
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Notification;