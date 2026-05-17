const axios = require("axios");
const Incident = require("../models/Incident");

<<<<<<< HEAD
=======
/* ========================
   GET ALL INCIDENTS
======================== */
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.findAll();
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

<<<<<<< HEAD
=======
/* ========================
   GET INCIDENT BY ID
======================== */
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
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

<<<<<<< HEAD
=======
/* ========================
   CREATE INCIDENT + NOTIFICATION
======================== */
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
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

<<<<<<< HEAD

=======
/* ========================
   UPDATE INCIDENT STATUS + NOTIFICATION
======================== */
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
exports.updateIncidentStatus = async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    incident.status = req.body.status;
    await incident.save();

<<<<<<< HEAD
=======
    // NOTIFICATION STATUS UPDATE
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
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

<<<<<<< HEAD
=======
/* ========================
   DELETE INCIDENT
======================== */
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
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