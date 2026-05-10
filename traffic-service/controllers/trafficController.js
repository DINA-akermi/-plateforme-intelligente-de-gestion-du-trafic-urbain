const Traffic = require("../models/Traffic");
const axios = require("axios");

const INCIDENT_SERVICE_URL = process.env.INCIDENT_SERVICE_URL;

exports.getAll = async () => {

  return await Traffic.findAll({
    order: [["createdAt", "DESC"]]
  });
};

exports.getById = async (id) => {

  return await Traffic.findByPk(id);
};

exports.create = async (data) => {

  const traffic = await Traffic.create(data);

  if (data.level === "HEAVY") {

    try {

      await axios.post(`${INCIDENT_SERVICE_URL}/api/incidents`, {

        type: "TRAFIC",

        title: `Bouchon détecté à ${data.location}`,

        description: "Incident généré automatiquement par le Traffic Service",

        latitude: 0,
        longitude: 0,

        status: "SIGNALE"
      });

      console.log(" Incident créé automatiquement depuis Traffic");

    } catch (error) {

      console.log(" Erreur création incident:", error.message);
    }
  }

  return traffic;
};

exports.updateLevel = async (id, level) => {

  const traffic = await Traffic.findByPk(id);

  if (!traffic) {
    throw new Error("Traffic not found");
  }

  traffic.level = level;

  await traffic.save();

  if (level === "HEAVY") {

    try {

      await axios.post(`${INCIDENT_SERVICE_URL}/api/incidents`, {

        type: "TRAFIC",

        title: `Trafic critique à ${traffic.location}`,

        description: "Changement de niveau détecté",

        latitude: 0,
        longitude: 0,

        status: "SIGNALE"
      });

      console.log(" Incident créé suite update level");

    } catch (err) {

      console.log(" Error incident:", err.message);
    }
  }

  return traffic;
};

exports.delete = async (id) => {

  const traffic = await Traffic.findByPk(id);

  if (!traffic) {
    throw new Error("Traffic not found");
  }

  await traffic.destroy();

  return "Traffic deleted successfully";
};