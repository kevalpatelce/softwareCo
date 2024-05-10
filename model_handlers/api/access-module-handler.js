"use strict";
const dbConstants = require("./../../constants/db-constants");
const responseCodes = require("./../../helpers/response-codes");
const query = require("./../../utils/query-creator");
const labels = require("./../../utils/labels.json");
require("./../../models/accessModule");
const errors = require("../../utils/error-handler");
const idGeneratorHandler = require("../../utils/id-generator-handler");

const create = (requestParam) => {
	return new Promise((resolve, reject) => {
		async function main() {
			try {
				const existData = await query.selectWithAndOne(dbConstants.dbSchema.accessModules, { name: requestParam.name }, { _id: 0, name: 1 })
				if (existData) {
					reject(errors(labels.LBL_ACCESS_MODULE_NAME_ALREADY_EXIST["EN"], responseCodes.Conflict));
					return;
				}
				requestParam.access_module_id = await idGeneratorHandler.generateId("ACM")
				await query.insertSingle(dbConstants.dbSchema.accessModules, requestParam);
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

const list = () => {
	return new Promise((resolve, reject) => {
		async function main() {
			try {
				let resData = await query.selectWithAnd(dbConstants.dbSchema.accessModules, {}, { _id: 0 });
				resData = JSON.parse(JSON.stringify(resData))
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
				const resData = await query.selectWithAndOne(dbConstants.dbSchema.accessModules, { access_module_id: requestParam.access_module_id }, { _id: 0 });
				if (!resData) {
					reject(errors(labels.LBL_INVALID_ACCESS_MODULE["EN"], responseCodes.Invalid));
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
				const resData = await query.selectWithAndOne(dbConstants.dbSchema.accessModules, { access_module_id: requestParam.access_module_id }, { _id: 0 });
				if (!resData) {
					reject(errors(labels.LBL_INVALID_ACCESS_MODULE["EN"], responseCodes.Invalid));
					return;
				}
				const existData = await query.selectWithAndOne(dbConstants.dbSchema.accessModules, { name: requestParam.name, access_module_id: { $ne: requestParam.access_module_id } }, { _id: 0, name: 1 })
				if (existData) {
					reject(errors(labels.LBL_ACCESS_MODULE_NAME_ALREADY_EXIST["EN"], responseCodes.Conflict));
					return;
				}

				await query.updateSingle(dbConstants.dbSchema.accessModules, requestParam, { access_module_id: requestParam.access_module_id })
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

const deleteAccessModule = (requestParam) => {
	return new Promise((resolve, reject) => {
		async function main() {
			try {
				const resData = await query.selectWithAndOne(dbConstants.dbSchema.accessModules, { access_module_id: requestParam.access_module_id }, { _id: 0 });
				if (!resData) {
					reject(errors(labels.LBL_INVALID_ACCESS_MODULE["EN"], responseCodes.Invalid));
					return;
				}
				await query.removeMultiple(dbConstants.dbSchema.accessModules, { access_module_id: requestParam.access_module_id })
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
	deleteAccessModule
};
