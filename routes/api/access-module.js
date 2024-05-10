"use strict";
const responseCodes = require("../../helpers/response-codes");
const express = require("express");
const router = express.Router();
const jsonResponse = require("../../utils/json-response-handler");
const accessModuleHandler = require("../../model_handlers/api/access-module-handler.js");
const labels = require("./../../utils/labels.json");
const errors = require("../../utils/error-handler");

router.post("/create", async (req, res) => {
	try {
		if (!req.body.name) {
			jsonResponse(
				res,
				responseCodes.BadRequest,
				errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
				null
			);
			return;
		}
		const response = await accessModuleHandler.create(req.body);
		jsonResponse(res, responseCodes.OK, null, response);
	} catch (error) {
		try {
			jsonResponse(res, responseCodes.Conflict, error, null);
			return;
		} catch (err) {
			jsonResponse(res, responseCodes.InternalServer, err, null);
			return;
		}
	}
});

router.get("/list", async (req, res) => {
	try {
		const response = await accessModuleHandler.list(req.body);
		jsonResponse(res, responseCodes.OK, null, response);
	} catch (error) {
		try {
			jsonResponse(res, responseCodes.InternalServer, error, null);
			return;
		} catch (err) {
			jsonResponse(res, responseCodes.InternalServer, err, null);
			return;
		}
	}
});

router.get("/details", async (req, res) => {
	try {
		if (!req.query.access_module_id) {
			jsonResponse(
				res,
				responseCodes.BadRequest,
				errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
				null
			);
			return;
		}
		const response = await accessModuleHandler.details(req.query);
		jsonResponse(res, responseCodes.OK, null, response);
	} catch (error) {
		try {
			jsonResponse(res, responseCodes.InternalServer, error, null);
			return;
		} catch (err) {
			jsonResponse(res, responseCodes.InternalServer, err, null);
			return;
		}
	}
});

router.post("/update", async (req, res) => {
	try {
		if (!req.body.access_module_id) {
			jsonResponse(
				res,
				responseCodes.BadRequest,
				errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
				null
			);
			return;
		}
		const response = await accessModuleHandler.update(req.body);
		jsonResponse(res, responseCodes.OK, null, response);
	} catch (error) {
		try {
			jsonResponse(res, responseCodes.InternalServer, error, null);
			return;
		} catch (err) {
			jsonResponse(res, responseCodes.InternalServer, err, null);
			return;
		}
	}
});

router.delete("/delete-access-module", async (req, res) => {
	try {
		if (!req.body.access_module_id) {
			jsonResponse(
				res,
				responseCodes.BadRequest,
				errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
				null
			);
			return;
		}
		const response = await accessModuleHandler.deleteAccessModule(req.body);
		jsonResponse(res, responseCodes.OK, null, response);
	} catch (error) {
		try {
			jsonResponse(res, responseCodes.InternalServer, error, null);
			return;
		} catch (err) {
			jsonResponse(res, responseCodes.InternalServer, err, null);
			return;
		}
	}
});

module.exports = router;
