const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET = "mysecret";

let users = [];

app.post("/register", (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.json(user);
});

app.post("/login", (req, res) => {
  const user = users.find(u => u.email === req.body.email);

  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET
  );

  res.json({ token });
});

app.listen(3000, () => console.log("Auth service running"));