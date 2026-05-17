const User = require("./models/User");
const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");

async function createOperator() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create Admin if not exists
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: "admin@gmail.com" },
      defaults: {
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN"
      }
    });
    if (adminCreated) console.log("Admin created: admin@gmail.com");

    // Create Operator if not exists
    const [operator, opCreated] = await User.findOrCreate({
      where: { email: "operator@gmail.com" },
      defaults: {
        name: "Operator User",
        password: hashedPassword,
        role: "OPERATOR"
      }
    });
    if (opCreated) console.log("Operator created: operator@gmail.com");

    console.log("Database populated successfully with @gmail.com accounts");
    process.exit(0);
  } catch (err) {
    console.error("Error populating DB:", err);
    process.exit(1);
  }
}

createOperator();
