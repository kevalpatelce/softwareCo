"use strict";
const dbConstants = require("./../../constants/db-constants");
const responseCodes = require("./../../helpers/response-codes");
const query = require("./../../utils/query-creator");
const labels = require("./../../utils/labels.json");
require("./../../models/role");
const errors = require("../../utils/error-handler");
const idGeneratorHandler = require("../../utils/id-generator-handler");

const create = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        const existData = await query.selectWithAndOne(dbConstants.dbSchema.roles, { name: requestParam.name }, { _id: 0, name: 1 })
        if (existData) {
          reject(errors(labels.LBL_ROLE_NAME_ALREADY_EXIST["EN"], responseCodes.Conflict));
          return;
        }
        requestParam.role_id = await idGeneratorHandler.generateId("ROL")
        requestParam.access_module_ids = JSON.parse(requestParam.access_module_ids)
        await query.insertSingle(dbConstants.dbSchema.roles, requestParam);
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
              from: "accessmodules",
              localField: "access_module_ids",
              foreignField: "access_module_id",
              as: "accessModuleDetail",
            },
          },
          {
            $unwind: {
              path: "$accessModuleDetail",
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
              role_id: "$role_id",
              name: "$name",
              access_module_name: "$accessModuleDetail.name"
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
          dbConstants.dbSchema.roles,
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

const details = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        const resData = await query.selectWithAndOne(dbConstants.dbSchema.roles, { role_id: requestParam.role_id }, { _id: 0 });
        if (!resData) {
          reject(errors(labels.LBL_INALID_ROLE["EN"], responseCodes.Invalid));
          return;
        }
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

const update = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        const resData = await query.selectWithAndOne(dbConstants.dbSchema.roles, { role_id: requestParam.role_id }, { _id: 0 });
        if (!resData) {
          reject(errors(labels.LBL_INVALID_ROLE["EN"], responseCodes.Invalid));
          return;
        }
        const existData = await query.selectWithAndOne(dbConstants.dbSchema.roles, { name: requestParam.name, role_id: { $ne: requestParam.role_id } }, { _id: 0, name: 1 })
        if (existData) {
          reject(errors(labels.LBL_ROLE_NAME_ALREADY_EXIST["EN"], responseCodes.Conflict));
          return;
        }
        if (requestParam.access_module_ids) {
          requestParam.access_module_ids = JSON.parse(requestParam.access_module_ids)
        }
        await query.updateSingle(dbConstants.dbSchema.roles, requestParam, { role_id: requestParam.role_id })
        resolve({ message: "record updated successfully" });
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

const deleteRole = (requestParam) => {
  return new Promise((resolve, reject) => {
    async function main() {
      try {
        const resData = await query.selectWithAndOne(dbConstants.dbSchema.roles, { role_id: requestParam.role_id }, { _id: 0 });
        if (!resData) {
          reject(errors(labels.LBL_INVALID_ROLE["EN"], responseCodes.Invalid));
          return;
        }
        await query.removeMultiple(dbConstants.dbSchema.roles, { role_id: requestParam.role_id })
        resolve({ message: "record deleted successfully" });
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

module.exports = {
  create,
  list,
  details,
  update,
  deleteRole
};
