'use strict';
const mongoose = require('mongoose');
require('mongoose-uuid2')(mongoose);

const IssueSchema = mongoose.Schema({
    name: String,
    files: [mongoose.Types.UUID]
});

module.exports = mongoose.model('issues', IssueSchema);
