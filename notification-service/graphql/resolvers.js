const Notification = require("../models/Notification");
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
    }
  },

  Mutation: {
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
      return notification;
    }
  }
};

module.exports = resolvers;