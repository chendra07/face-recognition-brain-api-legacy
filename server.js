import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import dotenv from "dotenv";

const app = express();
app.use(express.json()); //body parser
app.use(cors());
const PORT_NUM = 2000;
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

app.listen(PORT_NUM, () => {
  console.log("App is running on port: ", PORT_NUM);
});

app.get("/", (req, res) => {
  res.json({ test: "test" });
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  // comparePassword(password, hash);
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = comparePassword(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json({
              loginStatus: "success",
              ...user[0],
            });
          })
          .catch((error) => {
            console.log(error);
            res
              .status(400)
              .json({ loginStatus: "failed", message: "Unable to get user" });
          });
      } else {
        res
          .status(400)
          .json({ loginStatus: "failed", message: "wrong credentials" });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ loginStatus: "failed", message: "internal server error" });
    });
});

app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  let hash = hashPassword(password);
  // console.log("hash: ", hashPassword(password));
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*") //return all data from column
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((newUser) => {
            res.json({
              registerStatus: "success",
              ...newUser[0],
            });
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({
          registerStatus: "failed",
          message: "unable to register",
        });
      });
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length >= 1) {
        res.json(user[0]);
      } else {
        res.status(400).json({ message: "user not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where({ id: id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json({ entries: entries[0].entries }))
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    });
});
