'use strict';
const mongoose = require('mongoose');

const IssueSchema = mongoose.Schema({
    name: String,
    files: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('issues', IssueSchema);
