require("dotenv").config();

const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
const jwt = require("jsonwebtoken");
=======

>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
const { ApolloServer } = require("apollo-server-express");

const sequelize = require("./config/db");

<<<<<<< HEAD
const notificationRoutes = require("./Routes/notificationRoutes");
=======
const notificationRoutes = require("./routes/notificationRoutes");
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

<<<<<<< HEAD
// Total permissive CORS for development
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
=======
app.use(cors());
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
app.use(express.json());

// REST
app.use("/api/notifications", notificationRoutes);

// TEST
app.get("/", (req, res) => {
  res.json({ message: "Notification Service running 🚀" });
});

async function startServer() {
  try {
<<<<<<< HEAD
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
=======

    // GraphQL SERVER (STABLE VERSION)
    const server = new ApolloServer({
      typeDefs,
      resolvers
    });

    await server.start();
    server.applyMiddleware({ app });
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8

    await sequelize.authenticate();
    console.log("Database connected");

<<<<<<< HEAD
    await sequelize.sync({ alter: true });
    console.log("Models synced");

    const PORT = process.env.PORT || 4005;
    const HOST = '0.0.0.0';

    app.listen(PORT, HOST, () => {
      console.log(` Notification Service running on port ${PORT}`);
=======
    await sequelize.sync();
    console.log("Models synced");

    const PORT = process.env.PORT || 4005;

    app.listen(PORT, () => {
      console.log(` Notification Service running on http://localhost:${PORT}`);
      console.log(` REST: http://localhost:${PORT}/api/notifications`);
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
      console.log(` GraphQL: http://localhost:${PORT}${server.graphqlPath}`);
    });

  } catch (err) {
    console.error("Error:", err);
  }
}

startServer();