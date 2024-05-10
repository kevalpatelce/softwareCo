"use strict";
const jsonResponse = require("../utils/json-response-handler");;
const jwt = require('jsonwebtoken');
const query = require("./../utils/query-creator");
const dbConstants = require("./../constants/db-constants");
const errors = require("../utils/error-handler");
const labels = require("./../utils/labels.json");
const responseCodes = require("./../helpers/response-codes");
const config = require("../config");
const secretKey = config.jwt_secret_key;

// Function to generate a JWT token
function generateToken(payload) {
  return jwt.sign(payload, secretKey);
}

// Middleware to verify the JWT token
async function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const tokenBearer = token.split(' ')[1];
  const decodedToken = jwt.decode(tokenBearer, secretKey);

  if (!(decodedToken || tokenBearer)) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const userData = await query.selectWithAndOne(dbConstants.dbSchema.users, { user_id: decodedToken.id }, { _id: 0, access_token: 1 })
  if (userData.access_token !== tokenBearer) {
    jsonResponse(
      res,
      responseCodes.Unauthorized,
      errors(labels.LBL_JWT_TOKEN_INVALID["EN"], responseCodes.Unauthorized),
      null
    );
    return;
  }

  jwt.verify(tokenBearer, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
  generateToken,
  verifyToken
};