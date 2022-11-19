const express = require("express");
const indexRouter = express.Router();

const v1Router = require("./v1");

indexRouter.use("/v1", v1Router);

module.exports = indexRouter;
