const Notification = require("../models/Notification");

exports.getAllNotifications = async (req, res) => {
  try {
<<<<<<< HEAD
    const notifications = await Notification.findAll({ order: [['createdAt', 'DESC']] });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
=======
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
  }
};

exports.getNotificationById = async (req, res) => {
  try {
<<<<<<< HEAD
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
=======

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
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
  }
};

exports.createNotification = async (req, res) => {
  try {
<<<<<<< HEAD
    const { message, type, recipientRole } = req.body;
    const notification = await Notification.create({ message, type, recipientRole });
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
=======

    const notification = await Notification.create(req.body);

    res.status(201).json(notification);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
  }
};

exports.markAsRead = async (req, res) => {
  try {
<<<<<<< HEAD
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
=======

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
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
  }
};