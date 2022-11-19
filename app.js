const express = require("express");
const cors = require("cors");

//routes
const indexRouter = require("./src/router");
//components
// import image from "./controllers/image.js";

const app = express();
const whitelist = process.env.FRONTEND_BASEURL.split(", ");

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
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(indexRouter);

module.exports = app;

// app.get("/", (req, res) => {
//   res.json({ message: "connected" });
// });

// app.put("/image", (req, res) => {
//   image.incrementUserEntries(req, res, db);
// });

// app.post("/imageUrl", (req, res) => {
//   image.HandleClarifaiApiCall(req, res);
// });
