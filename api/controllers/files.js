/**
 * Files controller.
 * @module api/controllers/files
 */
'use strict';

const fs = require('fs');

const { files } = require('../helpers');

const config = require('../../config');

/**
 * Creates a file.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function create(req, res) {
    const issueID = req.swagger.params.issueID.value;
    // TODO: Store value's `originalname` somewhere...
    const { buffer } = req.swagger.params.upfile.value;

    files.create({ buffer, issueID }, (err, issue) => {
        if (err) return void res.status(err.code || 500).send(err);
        res.status(201).json(issue);
    });
}

/**
 * Gets a file by ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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
