'use strict';

const fs = require('fs');

const config = require('../../config');

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
    getByID
};
