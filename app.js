"use strict";
var express = require("express");
var app = express();
const routes = require("./routes/index");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require('./utils/logger-handler');
global.basedir = __dirname;
const { verifyToken } = require('./utils/common');

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger("\n", "Database Connected Suceessfully", "\n");
  })
  .catch((error) => {
    logger("\n", "error while connectiong database!", "\n");
    logger(error);
  });

//routes

//api
const auth = require("./routes/api/auth");
const user = require("./routes/api/user");
const role = require("./routes/api/role");
const accessModule = require("./routes/api/access-module");

//other configurations
const favicon = require("serve-favicon");
const multiparty = require("connect-multiparty");
const upload = require("express-fileupload");
const multipartyMiddleWare = multiparty();

//express configurations
app.disable("x-powered-by");
app.use(favicon(path.join(__dirname, "./public/img", "favicon.ico")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors());
app.use(multipartyMiddleWare);

//route url define
app.use("/", routes);

//api
app.use("/api/auth", auth);
app.use("/api/user", verifyToken, user);
app.use("/api/role", verifyToken, role);
app.use("/api/access-module", verifyToken, accessModule);

app.use(upload());

app.use(() => {
  logger("Error: No route found or Wrong method name");
});

if (app.get("env") === "development") {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

// no stack traces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

module.exports = app;