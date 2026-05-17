const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const resolvers = {

  Query: {

    me: async (_, __, { user }) => {

      if (!user) {
        throw new Error("Not authenticated");
      }

      return await User.findByPk(user.id);
    }
  },

  Mutation: {

    register: async (_, args) => {

      const hashedPassword = await bcrypt.hash(args.password, 10);

      const user = await User.create({
        name: args.name,
        email: args.email,
        password: hashedPassword,
        role: args.role || "OPERATOR"
      });

      return user;
    },

    login: async (_, { email, password }) => {

      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("User not found");
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return {
        token,
        user
      };
    }
  }
};

module.exports = resolvers;