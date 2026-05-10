const express = require("express");

const router = express.Router();

const {
  getAllIncidents,
  getIncidentById,
  createIncident,
  updateIncidentStatus,
  deleteIncident
} = require("../Controllers/incidentController");

router.get("/", getAllIncidents);

router.get("/:id", getIncidentById);

router.post("/", createIncident);

router.put("/:id/status", updateIncidentStatus);

router.delete("/:id", deleteIncident);

module.exports = router;