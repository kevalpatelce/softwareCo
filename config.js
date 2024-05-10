"use strict";
const _ = require("underscore");
const dotenv = require("dotenv");
dotenv.config()

const requiredParams = [
  "API_BASE_URL",
  "APP_NAME_PROJECT_NAME",
  "PORT_PROJECT_NAME"
];

for (let i = 0; i < requiredParams.length; i++) {
  if (!_.has(process.env, requiredParams[i])) {
    throw new Error(
      "Project Name Platform Environment Variables Not Properly Set"
    );
  }
}

module.exports = {
  appName: process.env.APP_NAME_PROJECT_NAME,
  apiURL: process.env.API_BASE_URL,
  port: process.env.PORT_PROJECT_NAME,
  // nodeMailer: {
  //   fromEmail: process.env.FROM_EMAIL,
  //   emailAppPassword: process.env.EMAIL_APP_PASSWORD,
  // },
  jwt_secret_key: process.env.JWT_SECRET_KEY,
};
