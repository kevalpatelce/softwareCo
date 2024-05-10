"use strict";
const { Schema, model } = require('mongoose');
const roleSchema = new Schema({
    role_id: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: ""
    },
    access_module_ids: {
        type: Array,
        default: []
    },
    active: {
        type: Boolean,
        default: false
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

const Role = model('Role', roleSchema);
module.exports = Role;