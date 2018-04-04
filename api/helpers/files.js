'use strict';

const async = require('async');
const fs = require('fs');
const mongoose = require('mongoose');

const { CustomError } = require('./index');
const Issue = require('../models/issue');
const config = require('../../config');

function create({ buffer, issueID }, mainCb) {
    async.auto({
        issue: cb => Issue.findOne({ _id: issueID }, cb),
        writeFile: ['issue', ({ issue }, cb) => {
            if (!issue) return void cb(new CustomError({ code: 404 }, `Issue not found with _id '${issueID}'.`));
            const fileID = new mongoose.Types.ObjectId();
            issue.files.push(fileID);
            fs.writeFile(`${config.filesDir}/${fileID}`, buffer, cb);
        }],
        saveIssue: ['writeFile', ({ issue }, cb) => issue.save(cb)]
    }, (mainErr, { issue } = {}) => mainCb(mainErr, issue));
}

module.exports = {
    create
};
