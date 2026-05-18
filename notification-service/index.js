require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("apollo-server-express");

const sequelize = require("./config/db");
const notificationRoutes = require("./routes/notificationRoutes");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Notification Service running 🚀" });
});

async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");

        if (token && token !== "null" && token !== "undefined") {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return { user: decoded };
          } catch (err) {
            console.log("JWT Verification failed in Notification Service");
          }
        }

        return {};
      }
    });

    await server.start();
    server.applyMiddleware({ app, cors: false });

    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true });
    console.log("Models synced");

    const PORT = process.env.PORT || 4005;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Notification Service running on http://localhost:${PORT}`);
      console.log(`REST: http://localhost:${PORT}/api/notifications`);
      console.log(
        `GraphQL: http://localhost:${PORT}${server.graphqlPath}`
      );
    });

  } catch (err) {
    console.error("Error:", err);
  }
}

startServer();