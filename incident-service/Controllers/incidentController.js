const axios = require("axios");
const Incident = require("../models/Incident");

exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.findAll();
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createIncident = async (req, res) => {
  try {
    const incident = await Incident.create(req.body);

    // NOTIFICATION AUTOMATIQUE
    try {
      await axios.post("http://localhost:4005/api/notifications", {
        message: `Nouvel incident: ${incident.type} - ${incident.title}`,
        type: "INCIDENT"
      });
    } catch (notifError) {
      console.log("Notification error:", notifError.message);
    }

    res.status(201).json(incident);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateIncidentStatus = async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    incident.status = req.body.status;
    await incident.save();

    try {
      await axios.post("http://localhost:4005/api/notifications", {
        message: `Incident #${incident.id} status updated to ${incident.status}`,
        type: "STATUS_UPDATE"
      });
    } catch (notifError) {
      console.log("Notification error:", notifError.message);
    }

    res.json(incident);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    await incident.destroy();

    res.json({ message: "Incident deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};