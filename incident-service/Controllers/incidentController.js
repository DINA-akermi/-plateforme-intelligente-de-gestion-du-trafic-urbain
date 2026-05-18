const Incident = require("../models/Incident");
const axios = require("axios");

const NOTIFICATION_URL =
  process.env.NOTIFICATION_URL || "http://127.0.0.1:4005/api/notifications";

exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.findAll({
      order: [["createdAt", "DESC"]]
    });

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
    const incident = await Incident.create({
      ...req.body,
      status: req.body.status || "OPEN"
    });

    
    try {
      await axios.post(NOTIFICATION_URL, {
        message: `New incident reported: ${incident.type} - ${incident.title}`,
        type: "INCIDENT",
        recipientRole: "ALL"
      });
    } catch (notifError) {
      console.error("Notification error:", notifError.message);
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
      await axios.post(NOTIFICATION_URL, {
        message: `Incident #${incident.id} status updated to ${incident.status}`,
        type: "STATUS_UPDATE",
        recipientRole: "ALL"
      });
    } catch (notifError) {
      console.error("Notification error:", notifError.message);
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

    res.json({
      success: true,
      message: "Incident deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};