const Notification = require("../models/Notification");
<<<<<<< HEAD
const { Op } = require("sequelize");

const resolvers = {
  Query: {
    getNotifications: async (_, __, { user }) => {
      // Temporarily removing authentication check to debug connectivity
      console.log("Fetching notifications for user:", user?.role || "GUEST");
      
      try {
        if (!user) {
          // If no user, just return public or all for debug
          return await Notification.findAll({ order: [['createdAt', 'DESC']] });
        }

        return await Notification.findAll({
          where: {
            [Op.or]: [
              { recipientRole: { [Op.in]: [user.role, "ALL"] } },
              { recipientRole: { [Op.is]: null } }
            ]
          },
          order: [['createdAt', 'DESC']]
        });
      } catch (err) {
        console.error("Resolver error:", err);
        throw err;
      }
=======

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
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
    }
  },

  Mutation: {
<<<<<<< HEAD
    createNotification: async (_, { message, type, recipientRole }, { user }) => {
      return await Notification.create({ 
        message, 
        type: type || "INFO", 
        recipientRole: recipientRole || "ALL" 
      });
    },
    markAsRead: async (_, { id }, { user }) => {
      const notification = await Notification.findByPk(id);
      if (notification) {
        notification.isRead = true;
        await notification.save();
      }
=======

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

>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
      return notification;
    }
  }
};

module.exports = resolvers;