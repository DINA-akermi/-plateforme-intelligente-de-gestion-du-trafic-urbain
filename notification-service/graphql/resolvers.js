const Notification = require("../models/Notification");

const resolvers = {

  Query: {

    // GET ALL NOTIFICATIONS
    getNotifications: async () => {

      return await Notification.findAll({
        order: [["createdAt", "DESC"]]
      });
    },

    // GET ONE NOTIFICATION
    getNotification: async (_, { id }) => {

      return await Notification.findByPk(id);
    }
  },

  Mutation: {

    // CREATE NOTIFICATION
    createNotification: async (_, args) => {

      const notification = await Notification.create({

        message: args.message,

        type: args.type || "INFO",

        isRead: false
      });

      return notification;
    },

    // MARK AS READ
    markAsRead: async (_, { id }) => {

      const notification = await Notification.findByPk(id);

      if (!notification) {
        throw new Error("Notification not found");
      }

      notification.isRead = true;

      await notification.save();

      return notification;
    }
  }
};

module.exports = resolvers;