const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const port = 3100;

// converts data into json
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// EJS
app.set("view engine", "ejs");

// Data Base
require("./db/conn");
const userSchema = require("./model/schema");
const { name } = require("ejs");
const { Collection } = require("mongoose");

// Loading pages

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Register Page
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  const existingUser = await userSchema.findOne({ name: data.name });
  if (existingUser) {
    res.send("User already exists. Please choose a different username.");
  } else {
    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; // replaced to hash password to original password

    const userData = await userSchema.insertMany(data);
    console.log(userData);
  }
});

// login page

app.post("/login", async (req, res) => {
  try {
    const check = await userSchema.findOne({ name: req.body.username });
    if (!check) {
      res.send("user name cannot found");
    }

    // comparing plane password to hash password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.render("index");
    } else {
      req.send("wrong password");
    }
  } catch {
    console.log("wrong details");
  }
});

// port

app.listen(port, (req, res) => {
  console.log(`server listening at port ${port}`);
});
