const Vehicle = require("./models/Vehicle");
const sequelize = require("./config/db");

async function populate() {
  try {
    await sequelize.sync({ alter: true });
    await Vehicle.create({ plateNumber: 'TN 123 4567', model: 'Volkswagen Golf', type: 'Private', status: 'Moving' });
    await Vehicle.create({ plateNumber: 'TN 987 6543', model: 'Mercedes Sprinter', type: 'Commercial', status: 'Parked' });
    console.log("Vehicles populated and schema altered");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

populate();
