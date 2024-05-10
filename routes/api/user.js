"use strict";
const responseCodes = require("../../helpers/response-codes");
const express = require("express");
const router = express.Router();
const jsonResponse = require("../../utils/json-response-handler");
const userHandler = require("../../model_handlers/api/user-handler");
const labels = require("../../utils/labels.json");
const errors = require("../../utils/error-handler");
const { verifyToken } = require('../../utils/common');

router.get("/list", async (req, res) => {
  try {
    const response = await userHandler.list(req.query);
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

router.get("/get-profile", verifyToken, async (req, res) => {
  try {
    if (!req.query.user_id) {
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
        null
      );
      return;
    }
    const response = await userHandler.getProfile(req.query);
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

router.post("/update-profile", verifyToken, async (req, res) => {
  try {
    if (!req.body.user_id || !(req.body.first_name || req.body.password)) {
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
        null
      );
      return;
    }
    const response = await userHandler.updateProfile(req.body);
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

router.delete("/delete-user", async (req, res) => {
  try {
    if (!req.body.user_id) {
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
        null
      );
      return;
    }
    const response = await userHandler.deleteUser(req.body);
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

router.get("/check-access", verifyToken, async (req, res) => {
  try {
    if (!req.query.user_id || !req.query.access_module_id) {
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
        null
      );
      return;
    }
    const response = await userHandler.checkAccess(req.query);
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