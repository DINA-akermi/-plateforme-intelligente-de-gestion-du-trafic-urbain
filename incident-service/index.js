require("dotenv").config();

const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("apollo-server-express");
=======

const { ApolloServer } = require("apollo-server-express");

>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
const sequelize = require("./config/db");

// Routes REST
const incidentRoutes = require("./Routes/incidentRoutes");

// GraphQL
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

<<<<<<< HEAD
app.use(cors());
app.use(express.json());

// Middleware REST pour vérifier le JWT (optionnel si vous utilisez principalement GraphQL)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
=======

app.use(cors());
app.use(express.json());

>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8

app.get("/", (req, res) => {
  res.json({ message: "Incident Service is running 🚀" });
});

app.use("/api/incidents", incidentRoutes);

async function startServer() {
  try {
<<<<<<< HEAD
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const token = req.headers.authorization?.replace("Bearer ", "") || "";
        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return { user: decoded };
          } catch (err) {
            console.log("Invalid token in GraphQL");
          }
        }
        return {};
      }
=======
    
    const server = new ApolloServer({
      typeDefs,
      resolvers
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
    });

    await server.start();
    server.applyMiddleware({ app });

    /* DB CONNECTION */
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync();
    console.log("Models synchronized");

    /* START EXPRESS SERVER */
    const PORT = process.env.PORT || 4004;

<<<<<<< HEAD
    app.listen(PORT, "127.0.0.1", () => {
      console.log(` Incident Service running on http://127.0.0.1:${PORT}`);
      console.log(` GraphQL running on http://127.0.0.1:${PORT}${server.graphqlPath}`);
=======
    app.listen(PORT, () => {
      console.log(` Incident Service running on http://localhost:${PORT}`);
      console.log(` GraphQL running on http://localhost:${PORT}${server.graphqlPath}`);
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
    });

  } catch (error) {
    console.error(" Server Error:", error);
  }
}
startServer();