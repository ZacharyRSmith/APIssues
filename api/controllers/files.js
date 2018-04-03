'use strict';

const async = require('async');
const fs = require('fs');
const mongoose = require('mongoose');

const { CustomError } = require('../helpers');
const Issue = require('../models/issue');

const config = require('../../config');

function create(req, res) {
    const issueID = req.swagger.params.issueID.value;
    // TODO: Store value's `originalname` somewhere...
    const { buffer } = req.swagger.params.upfile.value;

    async.auto({
        issue: cb => Issue.findOne({ _id: issueID }, cb),
        writeFile: ['issue', ({ issue }, cb) => {
            if (!issue) return void cb(new CustomError({ code: 404 }, `Issue not found with _id '${issueID}'.`));
            const fileID = new mongoose.Types.ObjectId();
            issue.files.push(fileID);
            fs.writeFile(`${config.filesDir}/${fileID}`, buffer, cb);
        }],
        saveIssue: ['writeFile', ({ issue }, cb) => issue.save(cb)]
    }, (mainErr, { issue } = {}) => {
        if (mainErr) return void res.status(mainErr.code || 500).send(mainErr);
        res.status(201).json(issue);
    });
}

function getByID(req, res) {
    const id = req.swagger.params.id.value;
    fs.readFile(`${config.filesDir}/${id}`, (err, file) => {
        if (err) {
            if (err.code === 'ENOENT') return void res.sendStatus(404);
            return void res.status(500).send(err);
        }
        res.status(200).send(file);
    });
}

module.exports = {
    create,
    getByID
};
