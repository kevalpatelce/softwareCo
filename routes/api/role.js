"use strict";
const responseCodes = require("../../helpers/response-codes");
const express = require("express");
const router = express.Router();
const jsonResponse = require("../../utils/json-response-handler");
const roleHandler = require("../../model_handlers/api/role-handler.js");
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
    const response = await roleHandler.create(req.body);
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
    const response = await roleHandler.list(req.body);
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
    if (!req.query.role_id) {
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
        null
      );
      return;
    }
    const response = await roleHandler.details(req.query);
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
    if (!req.body.role_id) {
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
        null
      );
      return;
    }
    const response = await roleHandler.update(req.body);
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

router.delete("/delete-role", async (req, res) => {
  try {
    if (!req.body.role_id) {
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
        null
      );
      return;
    }
    const response = await roleHandler.deleteRole(req.body);
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
