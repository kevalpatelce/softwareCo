"use strict";
const responseCodes = require("../../helpers/response-codes");
const express = require("express");
const router = express.Router();
const jsonResponse = require("../../utils/json-response-handler");
const authHandler = require("../../model_handlers/api/auth-handler");
const labels = require("./../../utils/labels.json");
const errors = require("../../utils/error-handler");
const { verifyToken } = require('../../utils/common');

router.post("/sign-up", async (req, res) => {
  try {
    if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone_number || !req.body.password) {
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
        null
      );
      return;
    }
    const response = await authHandler.signUp(req.body);
    jsonResponse(res, responseCodes.OK, null, response);
  } catch (error) {
    console.log("error", error);
    try {
      jsonResponse(res, responseCodes.InternalServer, error, null);
      return;
    } catch (err) {
      jsonResponse(res, responseCodes.InternalServer, err, null);
      return;
    }
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      jsonResponse(
        res,
        responseCodes.BadRequest,
        errors(labels.LBL_MISSING_PARAMETERS["EN"], responseCodes.BadRequest),
        null
      );
      return;
    }
    const response = await authHandler.signIn(req.body);
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

router.post("/logout", verifyToken, async (req, res) => {
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
    const response = await authHandler.logout(req.body);
    jsonResponse(res, responseCodes.OK, null, response);
  } catch (error) {
    console.log("error", error);
    try {
      jsonResponse(res, responseCodes.Conflict, error, null);
      return;
    } catch (err) {
      jsonResponse(res, responseCodes.InternalServer, err, null);
      return;
    }
  }
});

module.exports = router;