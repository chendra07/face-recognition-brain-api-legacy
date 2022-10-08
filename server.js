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

dotenv.config();
const app = express();
const whitelist = process.env.FRONTEND_BASEURL.split(", ");
console.log("whitelist: ", whitelist);

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const PORT = 2000;
const saltRounds = 12;

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    // port: process.env.DB_PORT,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME,
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

app.listen(process.env.PORT || PORT, () => {
  console.log("App is running on: ", process.env.PORT);
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
