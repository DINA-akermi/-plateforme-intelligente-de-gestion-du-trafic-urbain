const Incident = require("../models/Incident");
const axios = require("axios");

const NOTIFICATION_URL =
  process.env.NOTIFICATION_URL || "http://127.0.0.1:4005/api/notifications";

const resolvers = {

  Query: {
    incidents: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");

      return await Incident.findAll();
    },

    incident: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");

      const incident = await Incident.findByPk(id);
      if (!incident) throw new Error("Incident not found");

      return incident;
    }
  },

  Mutation: {
    /* CREATE INCIDENT */
    createIncident: async (_, args, { user }) => {
      if (!user) throw new Error("Authentication required");

      const incident = await Incident.create({
        ...args,
        status: args.status || "OPEN"
      });

      
      try {
        await axios.post(NOTIFICATION_URL, {
          message: `New incident reported by ${user.role} #${user.id}: ${incident.type} - ${incident.title}`,
          type: "INCIDENT",
          recipientRole: "ALL"
        });
      } catch (err) {
        console.error("Notification error:", err.message);
      }

      return incident;
    },

    /* UPDATE STATUS */
    updateIncidentStatus: async (_, { id, status }, { user }) => {
      if (!user) throw new Error("Authentication required");

      if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
        throw new Error("Unauthorized: only ADMIN or OPERATOR can update status");
      }

      const incident = await Incident.findByPk(id);
      if (!incident) throw new Error("Incident not found");

      incident.status = status;
      await incident.save();

      // 🎯 Notification status update
      try {
        await axios.post(NOTIFICATION_URL, {
          message: `Incident #${incident.id} status updated to ${status}`,
          type: "STATUS_UPDATE",
          recipientRole: "ALL"
        });
      } catch (err) {
        console.error("Notification error:", err.message);
      }

      return incident;
    },

    /* DELETE INCIDENT */
    deleteIncident: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");

      if (user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin only");
      }

      const incident = await Incident.findByPk(id);
      if (!incident) throw new Error("Incident not found");

      await incident.destroy();

      return {
        success: true,
        message: "Incident deleted successfully"
      };
    }
  }
};

module.exports = resolvers;