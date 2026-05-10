const Traffic = require("../models/Traffic");

const resolvers = {

  Query: {

    getTraffic: async () => {

      return await Traffic.findAll({
        order: [["createdAt", "DESC"]]
      });
    },

    getTrafficById: async (_, { id }) => {

      return await Traffic.findByPk(id);
    }
  },

  Mutation: {

    createTraffic: async (_, args) => {

      return await Traffic.create({
        location: args.location,
        level: args.level || "FLUID",
        speed: args.speed || null
      });
    },

    updateTrafficLevel: async (_, { id, level }) => {

      const traffic = await Traffic.findByPk(id);

      if (!traffic) {
        throw new Error("Traffic not found");
      }

      traffic.level = level;

      await traffic.save();

      return traffic;
    },

    deleteTraffic: async (_, { id }) => {

      const traffic = await Traffic.findByPk(id);

      if (!traffic) {
        throw new Error("Traffic not found");
      }

      await traffic.destroy();

      return "Traffic deleted successfully";
    }
  }
};

module.exports = resolvers;