const Incident = require("../models/Incident");

const resolvers = {

  Query: {

    incidents: async () => {
      return await Incident.findAll();
    },

    incident: async (_, { id }) => {
      return await Incident.findByPk(id);
    }
  },

  Mutation: {

    createIncident: async (_, args) => {

      return await Incident.create(args);
    },

    updateIncidentStatus: async (_, { id, status }) => {

      const incident = await Incident.findByPk(id);

      if (!incident) {
        throw new Error("Incident not found");
      }

      incident.status = status;

      await incident.save();

      return incident;
    },

    deleteIncident: async (_, { id }) => {

      const incident = await Incident.findByPk(id);

      if (!incident) {
        throw new Error("Incident not found");
      }

      await incident.destroy();

      return "Incident deleted";
    }
  }
};

module.exports = resolvers;