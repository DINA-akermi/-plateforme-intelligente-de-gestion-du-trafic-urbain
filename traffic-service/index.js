require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const { ApolloServer } = require("apollo-server-express");

const sequelize = require("./config/db");

const trafficRoutes = require("./routes/trafficRoutes");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/traffic", trafficRoutes);

const server = http.createServer(app);

async function startServer() {

  try {

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    await sequelize.authenticate();
    console.log("Database connected successfully");
    await sequelize.sync();

    server.listen(process.env.PORT, () => {

      console.log(`Traffic Service running on http://localhost:${process.env.PORT}`);

      console.log(` REST API: http://localhost:${process.env.PORT}/api/traffic`);

      console.log(` GraphQL: http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`);
    });

  } catch (error) {
    console.log("Server error:", error);
  }
}

startServer();