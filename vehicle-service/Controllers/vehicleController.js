const Vehicle = require("../models/Vehicle");
const Position = require("../models/Position");

exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({
      plateNumber: req.body.plateNumber,
    });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll({
    include: Position,
  });
  res.json(vehicles);
};

exports.getVehicleById = async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id, {
    include: Position,
  });

  if (!vehicle) return res.sendStatus(404);

  res.json(vehicle);
};

exports.addPosition = async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);

  if (!vehicle) return res.sendStatus(404);

  const position = await Position.create({
    lat: req.body.lat,
    lng: req.body.lng,
    VehicleId: vehicle.id,
  });

  res.json(position);
};