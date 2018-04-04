/**
 * Files helpers.
 * @module api/helpers/files
 */
'use strict';

const async = require('async');
const fs = require('fs');
const mongoose = require('mongoose');

const { CustomError } = require('./index');
const Issue = require('../models/issue');
const config = require('../../config');

/**
 * Writes @param0.buffer to file, then stores file's ID in @issueID's issue.
 * @param {Object} param0 - args
 * @param {Buffer} param0.buffer - Buffer to write to file.
 * @param {string} param0.issueID - ID of issue the created file will belong to.
 * @param {function(Error, Object):void} mainCb - Callback.
 */
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
