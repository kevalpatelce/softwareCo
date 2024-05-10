"use strict";
const config = require("../../config");
const dbConstants = require("../../constants/db-constants");
const responseCodes = require("../../helpers/response-codes");
const query = require("../../utils/query-creator");
const labels = require("../../utils/labels.json");
const _ = require("underscore");
const errors = require("../../utils/error-handler");

const list = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        let compareData = {};
        if (requestParam.search_key) {
          const searchTerm = requestParam.search_key;
          const regex = new RegExp(searchTerm, "i");
          compareData = {
            ...compareData,
            $or: [
              { first_name: { $regex: regex } },
              { last_name: { $regex: regex } }
            ]
          }
        }
        const sizePerPage = requestParam.sizePerPage ? parseInt(requestParam.sizePerPage) : 10;
        let page = requestParam.page ? parseInt(requestParam.page) : 1;
        if (page >= 1) {
          page = parseInt(page) - 1;
        }

        const joinArr = [
          {
            $lookup: {
              from: "roles",
              localField: "role_id",
              foreignField: "role_id",
              as: "roleDetail",
            },
          },
          {
            $unwind: {
              path: "$roleDetail",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: compareData,
          },
          {
            $sort: { created_at: -1 },
          },
          {
            $project: {
              _id: 0,
              user_id: "$user_id",
              role_id: "$role_id",
              first_name: "$first_name",
              last_name: "$last_name",
              email: "$email",
              phone_number: "$phone_number",
              role_name: "$roleDetail.name",
              access_module: "$roleDetail.access_modules"
            },
          },
          {
            $skip: page * sizePerPage,
          },
          {
            $limit: sizePerPage,
          },
        ];

        let resData = await query.joinWithAnd(
          dbConstants.dbSchema.users,
          joinArr
        );
        resolve(resData);
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

const getProfile = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        const response = await query.selectWithAndOne(
          dbConstants.dbSchema.users,
          {
            user_id: requestParam.user_id
          }, { _id: 0 }
        );
        if (!response) {
          reject(errors(labels.LBL_USER_NOT_FOUND["EN"], responseCodes.Invalid));
          return;
        }
        resolve(response);
        return;
      } catch (error) {
        reject(error);
        return;
      }
    }
    main();
  });
};

const updateProfile = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        let compareData = {};
        let response;
        const exist_user = await query.selectWithAndOne(dbConstants.dbSchema.users, compareData, { _id: 0, password: 0 });
        if (!exist_user) {
          reject(errors(labels.LBL_USER_NOT_FOUND["EN"], responseCodes.Invalid));
          return;
        }

        if (requestParam.update_type == "many") {
          await query.updateMultiple(dbConstants.dbSchema.users, { $set: { lastName: requestParam.last_name } }, {})
          response = await query.selectWithAnd(dbConstants.dbSchema.users, {}, { _id: 0, password: 0, access_token: 0 })
          resolve(response);
          return;
        } else {
          let columnToUpdate = {};
          if (requestParam.password) {
            requestParam.password = await passwordHandler.encrypt(
              requestParam.password
            );
            columnToUpdate = { ...columnToUpdate, password: requestParam.password }
          }
          if (requestParam.first_name) {
            columnToUpdate = { ...columnToUpdate, first_name: requestParam.first_name }
          }
          if (requestParam.last_name) {
            columnToUpdate = { ...columnToUpdate, last_name: requestParam.last_name }
          }
          if (requestParam.email) {
            columnToUpdate = { ...columnToUpdate, email: requestParam.email }
          }
          if (requestParam.phone_number) {
            columnToUpdate = { ...columnToUpdate, phone_number: requestParam.phone_number }
          }
          if (requestParam.role_id) {
            columnToUpdate = { ...columnToUpdate, role_id: requestParam.role_id }
          }
          await query.updateSingle(dbConstants.dbSchema.users, columnToUpdate, compareData);
          response = await query.selectWithAndOne(dbConstants.dbSchema.users, compareData, { _id: 0, password: 0, access_token: 0 })
          resolve(response);
          return;
        }

      } catch (error) {
        reject(error);
        return;
      }
    }
    main();
  });
};

const deleteUser = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        const resData = await query.selectWithAndOne(dbConstants.dbSchema.users, { user_id: requestParam.user_id }, { _id: 0 });
        if (!resData) {
          reject(errors(labels.LBL_USER_NOT_FOUND["EN"], responseCodes.Invalid));
          return;
        }
        await query.removeMultiple(dbConstants.dbSchema.users, { user_id: requestParam.user_id })
        resolve({ message: "record deleted successfully" });
        return;
      } catch (error) {
        reject(error);
        return;
      }
    }
    main();
  });
};


const checkAccess = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        const exist_user = await query.selectWithAndOne(dbConstants.dbSchema.users, { user_id: requestParam.user_id }, { _id: 0, password: 0 });
        if (!exist_user) {
          reject(errors(labels.LBL_USER_NOT_FOUND["EN"], responseCodes.Invalid));
          return;
        }
        const roleData = await query.selectWithAndOne(dbConstants.dbSchema.roles, { role_id: exist_user.role_id }, { _id: 0, access_module_ids: 1 });
        const response = _.contains(roleData.access_module_ids, requestParam.access_module_id);
        resolve({ isAccess: response })
        return
      } catch (error) {
        reject(error);
        return;
      }
    }
    main();
  });
};

module.exports = {
  list,
  getProfile,
  updateProfile,
  deleteUser,
  checkAccess
};