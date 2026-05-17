const Vehicle = require("../models/Vehicle");
const axios = require("axios");

const resolvers = {
  Query: {
    getVehicles: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Vehicle.findAll();
    },
    getVehicle: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Vehicle.findByPk(id);
    }
  },

  Mutation: {
    createVehicle: async (_, args, { user }) => {
      if (!user) throw new Error("Authentication required");
      if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
        throw new Error("Unauthorized action");
      }
      
      const vehicle = await Vehicle.create(args);
      
      // Notify ALL staff (including Admin) when a vehicle is registered
      try {
        await axios.post("http://127.0.0.1:4005/api/notifications", {
          message: `${user.role} registered a new vehicle: ${vehicle.plateNumber}`,
          type: "INFO",
          recipientRole: "ALL"
        });
      } catch (err) {
        console.error("Failed to call notification service:", err.message);
      }
      
      return vehicle;
    },
    updateVehicleStatus: async (_, { id, status }, { user }) => {
      if (!user) throw new Error("Authentication required");
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) throw new Error("Vehicle not found");
      vehicle.status = status;
      await vehicle.save();
      return vehicle;
    },
    deleteVehicle: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      if (user.role !== "ADMIN") throw new Error("Admin role required for deletion");
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) throw new Error("Vehicle not found");
      await vehicle.destroy();
      return "Vehicle deleted";
    }
  }
};

module.exports = resolvers;
