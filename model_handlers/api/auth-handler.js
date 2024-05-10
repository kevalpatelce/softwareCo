"use strict";
const dbConstants = require("./../../constants/db-constants");
const responseCodes = require("./../../helpers/response-codes");
const query = require("./../../utils/query-creator");
const labels = require("./../../utils/labels.json");
require("./../../models/user");
const _ = require("underscore");
const errors = require("../../utils/error-handler");
const passwordHandler = require("../../utils/password-handler")
const idGeneratorHandler = require("../../utils/id-generator-handler")
const { generateToken } = require('../../utils/common');

const signUp = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        requestParam.password = await passwordHandler.encrypt(requestParam.password);
        const exist_email = await query.selectWithAndOne(dbConstants.dbSchema.users, { email: requestParam.email }, { _id: 0, email: 1 });
        if (exist_email) {
          reject(errors(labels.LBL_EMAIL_ALREADY_EXIST["EN"], responseCodes.Conflict));
          return;
        }
        const user_id = await idGeneratorHandler.generateId("USR");
        requestParam.user_id = user_id
        await query.insertSingle(dbConstants.dbSchema.users, requestParam);
        resolve({});
        return;
      } catch (error) {
        reject(error);
        return;
      }
    }
    main();
  });
};

const signIn = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        let exist_user = await query.selectWithAndOne(
          dbConstants.dbSchema.users,
          { email: requestParam.email, },
          { _id: 0, }
        );
        if (!exist_user) {
          reject(errors(labels.LBL_INVALID_EMAIL["EN"], responseCodes.Invalid));
          return;
        }
        requestParam.password = await passwordHandler.encrypt(requestParam.password);
        if (exist_user.password !== requestParam.password) {
          reject(errors(labels.LBL_INVALID_PASSWORD["EN"], responseCodes.Invalid));
          return;
        }
        let dataToken = {};
        dataToken = { ...dataToken, id: exist_user.user_id }
        const access_token = generateToken(dataToken);
        await query.updateSingle(dbConstants.dbSchema.users, { access_token, device_token: requestParam?.device_token }, { email: requestParam.email });
        // exist_user = JSON.parse(JSON.stringify(exist_user))
        exist_user.access_token = access_token;
        resolve(exist_user);
        return;
      } catch (error) {
        console.log("error", error);
        reject(error);
        return;
      }
    }
    main();
  });
};


const logout = (requestParam, req2) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        let compareData = {};
        compareData = { user_id: requestParam.user_id };
        const exist_user = await query.selectWithAndOne(dbConstants.dbSchema.users, compareData, { _id: 0, password: 0 });
        if (!exist_user) {
          reject(errors(labels.LBL_USER_NOT_FOUND["EN"], responseCodes.Invalid));
          return;
        }
        await query.updateSingle(dbConstants.dbSchema.users, { access_token: "", device_token: "" }, compareData);
        resolve({ message: "Logout sucessfully" });
        return;
      } catch (error) {
        reject(error);
        return;
      }
    }
    main();
  });
};


module.exports = {
  signUp,
  signIn,
  logout
};