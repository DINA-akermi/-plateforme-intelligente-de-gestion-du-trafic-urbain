const Notification = require("../models/Notification");

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching notifications",
      error: err.message
    });
  }
};


exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching notification",
      error: err.message
    });
  }
};


exports.createNotification = async (req, res) => {
  try {
    const { message, type, recipientRole } = req.body;

    if (!message || !type || !recipientRole) {
      return res.status(400).json({
        message: "message, type and recipientRole are required"
      });
    }

    const notification = await Notification.create({
      message,
      type,
      recipientRole,
      isRead: false
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({
      message: "Error creating notification",
      error: err.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      message: "Notification marked as read",
      notification
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating notification",
      error: err.message
    });
  }
};