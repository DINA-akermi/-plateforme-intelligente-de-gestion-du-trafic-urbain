require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { ApolloServer } = require("apollo-server-express");

const sequelize = require("./config/db");

const notificationRoutes = require("./routes/notificationRoutes");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

app.use(cors());
app.use(express.json());

// REST
app.use("/api/notifications", notificationRoutes);

// TEST
app.get("/", (req, res) => {
  res.json({ message: "Notification Service running 🚀" });
});

async function startServer() {
  try {

    // GraphQL SERVER (STABLE VERSION)
    const server = new ApolloServer({
      typeDefs,
      resolvers
    });

    await server.start();
    server.applyMiddleware({ app });

    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync();
    console.log("Models synced");

    const PORT = process.env.PORT || 4005;

    app.listen(PORT, () => {
      console.log(` Notification Service running on http://localhost:${PORT}`);
      console.log(` REST: http://localhost:${PORT}/api/notifications`);
      console.log(` GraphQL: http://localhost:${PORT}${server.graphqlPath}`);
    });

  } catch (err) {
    console.error("Error:", err);
  }
}

startServer();