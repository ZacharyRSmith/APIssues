/**
 * Issues controller.
 * @module api/controllers/issues
 */
'use strict';

require('mongoose')

const Issue = require('../models/issue');

/**
 * Creates an Issue.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function create(req, res) {
    const body = req.swagger.params.body.value;
    Issue.create(body, (err, issue) => {
        if (err) return void res.status(500).send(err);
        res.status(201).json(issue);
    });
}

/**
 * Gets an Issue by ID.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getByID(req, res) {
    const criteria = { _id: req.swagger.params._id.value };
    Issue.findOne(criteria).lean().exec((err, issue) => {
        if (err) return void res.status(500).send(err);
        if (!issue) return void res.sendStatus(404);
        res.json(issue);
    });
}

/**
 * Gets Issues.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function index(req, res) {
    // TODO paginate
    Issue.find({}).lean().exec((err, issues) => {
        if (err) return void res.status(500).send(err);
        res.json(issues);
    });
}

module.exports = {
    create,
    getByID,
    index
};
