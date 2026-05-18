require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("apollo-server-express");

const sequelize = require("./config/db");

// REST routes
const incidentRoutes = require("./Routes/incidentRoutes");

// GraphQL
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Incident Service is running 🚀" });
});

app.use("/api/incidents", incidentRoutes);

const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const user = getUserFromToken(req);

        if (!user) {
          return {};
        }

        return { user };
      }
    });

    await server.start();

    server.applyMiddleware({
      app,
      cors: {
        origin: "*",
        credentials: true
      }
    });

    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync();
    console.log("Models synchronized");

    const PORT = process.env.PORT || 4004;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Incident Service running on http://localhost:${PORT}`);
      console.log(
        `GraphQL running on http://localhost:${PORT}${server.graphqlPath}`
      );
    });

  } catch (error) {
    console.error("Server Error:", error);
  }
}

startServer();