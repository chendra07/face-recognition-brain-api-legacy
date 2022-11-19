const express = require("express");
const v1Router = express.Router();

//router
const auth = require("./auth/auth.router");

v1Router.use("/auth", auth);

module.exports = v1Router;
