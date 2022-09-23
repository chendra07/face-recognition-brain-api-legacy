import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import dotenv from "dotenv";

//components
import register from "./controllers/register.js";
import signIn from "./controllers/signin.js";
import profile from "./controllers/profile.js";
import image from "./controllers/image.js";

const app = express();
app.use(express.json()); //body parser
app.use(cors());
// const PORT_NUM = 2000;
const saltRounds = 12;
dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

app.listen(`${PORT}`, () => {
  console.log("App is running");
});

app.get("/", (req, res) => {
  res.json({ message: "connected" });
});

app.post("/signin", (req, res) => {
  signIn.handleSignIn(req, res, db, comparePassword);
});

app.post("/register", (req, res) => {
  register.handleRegsiter(req, res, db, hashPassword);
});

app.get("/profile/:id", (req, res) => {
  profile.getProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.incrementUserEntries(req, res, db);
});

app.post("/imageUrl", (req, res) => {
  image.HandleClarifaiApiCall(req, res);
});
