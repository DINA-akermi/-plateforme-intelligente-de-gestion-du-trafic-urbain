require("dotenv").config();

const express = require("express");
const sequelize = require("./config/db");

const app = express();

app.use(express.json());

// Routes
app.use("/api/vehicles", require("./routes/vehicleRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("Vehicle Service is running ");
});

// DB connection + server start
sequelize.authenticate()
  .then(() => {
    console.log("Database connected");

    return sequelize.sync(); // mieux que alter en général
  })
  .then(() => {
    console.log(" Database synced");

    app.listen(process.env.PORT || 3001, () => {
      console.log(` Server running on port ${process.env.PORT || 3001}`);
    });
  })
  .catch(err => {
    console.log(" Database error:", err);
  });