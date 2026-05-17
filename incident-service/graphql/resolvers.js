const Incident = require("../models/Incident");
const axios = require("axios");

const resolvers = {

  Query: {
    incidents: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Incident.findAll();
    },
    incident: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Incident.findByPk(id);
    }
  },

  Mutation: {
    createIncident: async (_, args, { user }) => {
      if (!user) throw new Error("Authentication required");
      
      const incident = await Incident.create(args);
      
      // Notification Logic
      try {
        // If an operator adds an incident, specifically notify ADMINS
      
        const target = user.role === "OPERATOR" ? "ALL" : "OPERATOR"; 
       
        
        await axios.post("http://127.0.0.1:4005/api/notifications", {
          message: `${user.role} ${user.id} reported new incident: ${incident.type} - ${incident.title}`,
          type: "WARNING",
          recipientRole: "ALL" // Making it visible to everyone ensures Admin sees it too
        });
      } catch (err) {
        console.error("Failed to call notification service:", err.message);
      }
      
      return incident;
    },

    updateIncidentStatus: async (_, { id, status }, { user }) => {
      if (!user) throw new Error("Authentication required");
      if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
        throw new Error("Unauthorized action");
      }

      const incident = await Incident.findByPk(id);
      if (!incident) throw new Error("Incident not found");

      incident.status = status;
      await incident.save();
      return incident;
    },

    deleteIncident: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      if (user.role !== "ADMIN") throw new Error("Admin role required for deletion");

      const incident = await Incident.findByPk(id);
      if (!incident) throw new Error("Incident not found");

      await incident.destroy();
      return "Incident deleted";
    }
  }
};

module.exports = resolvers;