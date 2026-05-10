require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const { ApolloServer } = require("apollo-server-express");

const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/authRoutes");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

async function startServer() {

  // Apollo Server (GraphQL)
  const server = new ApolloServer({

    typeDefs,
    resolvers,

    context: ({ req }) => {

      const token = req.headers.authorization || "";

      if (token) {
        try {

          const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET
          );

          return { user: decoded };

        } catch (err) {
          console.log("Invalid token");
          return {};
        }
      }

      return {};
    }
  });

  await server.start();

  server.applyMiddleware({ app });

  sequelize.sync()
    .then(() => {

      app.listen(process.env.PORT, () => {

        console.log(` Auth Service running on http://localhost:${process.env.PORT}`);

        console.log(`REST API: http://localhost:${process.env.PORT}/api/auth`);

        console.log(` GraphQL: http://localhost:${process.env.PORT}${server.graphqlPath}`);
      });
    })
    .catch(err => {
      console.log("DB Error:", err);
    });
}

startServer();