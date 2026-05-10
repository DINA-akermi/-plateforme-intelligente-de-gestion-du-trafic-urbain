const Incident = require("../models/Incident");

exports.getAllIncidents = async (req, res) => {

  try {

    const incidents = await Incident.findAll();

    res.json(incidents);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

exports.getIncidentById = async (req, res) => {

  try {

    const incident = await Incident.findByPk(req.params.id);

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found"
      });
    }

    res.json(incident);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

exports.createIncident = async (req, res) => {

  try {

    const incident = await Incident.create(req.body);

    res.status(201).json(incident);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

exports.updateIncidentStatus = async (req, res) => {

  try {

    const incident = await Incident.findByPk(req.params.id);

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found"
      });
    }

    incident.status = req.body.status;

    await incident.save();

    res.json(incident);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

exports.deleteIncident = async (req, res) => {

  try {

    const incident = await Incident.findByPk(req.params.id);

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found"
      });
    }

    await incident.destroy();

    res.json({
      message: "Incident deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};