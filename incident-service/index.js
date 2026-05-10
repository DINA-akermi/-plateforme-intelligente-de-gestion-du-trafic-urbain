require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { ApolloServer } = require("apollo-server-express");

const sequelize = require("./config/db");

// Routes REST
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

async function startServer() {
  try {
    
    const server = new ApolloServer({
      typeDefs,
      resolvers
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

    app.listen(PORT, () => {
      console.log(` Incident Service running on http://localhost:${PORT}`);
      console.log(` GraphQL running on http://localhost:${PORT}${server.graphqlPath}`);
    });

  } catch (error) {
    console.error(" Server Error:", error);
  }
}
startServer();