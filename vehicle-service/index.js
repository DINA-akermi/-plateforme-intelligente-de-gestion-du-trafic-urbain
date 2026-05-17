require("dotenv").config();

const express = require("express");
<<<<<<< HEAD
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("apollo-server-express");
const sequelize = require("./config/db");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

// Explicit CORS configuration for both REST and GraphQL
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// REST Routes (Legacy)
app.use("/api/vehicles", require("./Routes/vehicleRoutes"));

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
    context: ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "") || "";
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          return { user: decoded };
        } catch (err) {
          console.log("Invalid token in Vehicle GraphQL");
        }
      }
      return {};
    }
  });

  await server.start();
  
  server.applyMiddleware({ 
    app, 
    path: "/graphql",
    cors: false 
  });

  sequelize.authenticate()
    .then(() => {
      console.log("Vehicle DB connected");
      return sequelize.sync();
    })
    .then(() => {
      const PORT = process.env.PORT || 4003;
      app.listen(PORT, "127.0.0.1", () => {
        console.log(`Vehicle Service running on http://127.0.0.1:${PORT}`);
        console.log(`GraphQL: http://127.0.0.1:${PORT}${server.graphqlPath}`);
      });
    })
    .catch(err => {
      console.log("DB Error:", err);
    });
}

startServer();
=======
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
>>>>>>> f668c8a5e1ecfe0121efe460e148ce82d39114f8
