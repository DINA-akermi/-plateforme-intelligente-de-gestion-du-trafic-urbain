const router = require("express").Router();
const controller = require("../controllers/vehicleController");

router.post("/", controller.createVehicle);
router.get("/", controller.getVehicles);
router.get("/:id", controller.getVehicleById);
router.post("/:id/position", controller.addPosition);

module.exports = router;