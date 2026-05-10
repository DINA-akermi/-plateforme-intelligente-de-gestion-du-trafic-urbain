const Notification = require("../models/Notification");

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getNotificationById = async (req, res) => {
  try {

    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    res.json(notification);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.createNotification = async (req, res) => {
  try {

    const notification = await Notification.create(req.body);

    res.status(201).json(notification);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {

    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    notification.isRead = true;

    await notification.save();

    res.json(notification);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};