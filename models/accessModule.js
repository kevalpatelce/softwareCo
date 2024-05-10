"use strict";
const { Schema, model } = require('mongoose');
const accessModuleSchema = new Schema({
    access_module_id: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const AccessModule = model('AccessModule', accessModuleSchema);
module.exports = AccessModule;