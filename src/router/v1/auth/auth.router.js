const express = require("express");
const {
  httpPostSignIn,
  httpPostRegister,
  httpGetProfile,
} = require("./auth.controller");

const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
  httpPostSignIn(req, res);
});

authRouter.post("/register", (req, res) => {
  httpPostRegister(req, res);
});

authRouter.get("/profile/:id", (req, res) => {
  httpGetProfile(req, res);
});

module.exports = authRouter;
