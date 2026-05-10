const express = require("express");
const router = express.Router();

const controller = require("../controllers/trafficController");

router.get("/", async (req, res) => {
  try {
    const data = await controller.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await controller.getById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Traffic not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = await controller.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/level", async (req, res) => {
  try {
    const data = await controller.updateLevel(
      req.params.id,
      req.body.level
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await controller.delete(req.params.id);
    res.json({ message: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;