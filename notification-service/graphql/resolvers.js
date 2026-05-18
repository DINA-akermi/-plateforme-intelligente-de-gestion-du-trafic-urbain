const Notification = require("../models/Notification");
const { Op } = require("sequelize");

const resolvers = {
  Query: {
    
    getNotifications: async (_, __, { user }) => {
      try {
        console.log("Fetching notifications for:", user?.role || "GUEST");

        
        if (!user) {
          return await Notification.findAll({
            order: [["createdAt", "DESC"]]
          });
        }

        return await Notification.findAll({
          where: {
            [Op.or]: [
              { recipientRole: user.role },   // rôle exact
              { recipientRole: "ALL" }        // notifications globales
            ]
          },
          order: [["createdAt", "DESC"]]
        });

      } catch (err) {
        console.error("getNotifications error:", err);
        throw new Error("Failed to fetch notifications");
      }
    },

    getNotification: async (_, { id }) => {
      try {
        const notification = await Notification.findByPk(id);

        if (!notification) {
          throw new Error("Notification not found");
        }

        return notification;
      } catch (err) {
        throw new Error(err.message);
      }
    }
  },

  Mutation: {
  
    createNotification: async (_, { message, type, recipientRole }) => {
      try {
        if (!message) {
          throw new Error("Message is required");
        }

        const notification = await Notification.create({
          message,
          type: type || "INFO",
          recipientRole: recipientRole || "ALL",
          isRead: false
        });

        return notification;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    markAsRead: async (_, { id }) => {
      try {
        const notification = await Notification.findByPk(id);

        if (!notification) {
          throw new Error("Notification not found");
        }

        notification.isRead = true;
        await notification.save();

        return notification;
      } catch (err) {
        throw new Error(err.message);
      }
    }
  }
};

module.exports = resolvers;