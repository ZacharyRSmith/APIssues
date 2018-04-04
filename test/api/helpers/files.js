'use strict';

const async = require('async');
const expect = require('chai').expect;
const fs = require('fs');
const mongoose = require('mongoose');

const Issue = require('../../../api/models/issue');
const files = require('../../../api/helpers/files');
const config = require('../../../config');

const MONGODB = process.env.MONGODBTEST || 'mongodb://localhost:27017/issuesTest';

describe('helpers - files', () => {
    const issue = new Issue({ name: 'name' });

    before((done) => {
        async.series([
            cb => mongoose.connect(MONGODB, cb),
            cb => mongoose.connection.db.dropDatabase(cb),
            cb => issue.save(cb)
        ], done);
    });

    after((done) => {
        async.series([
            cb => mongoose.connection.db.dropDatabase(cb),
            cb => mongoose.disconnect(cb)
        ], done);
    });

    describe('create', () => {
        it('should create a file', (done) => {
            const filePath = `${config.filesDir}/foo.txt`;
            const fileContents = 'foobar';
            fs.writeFileSync(filePath, fileContents);
            const buffer = fs.readFileSync(filePath);

            files.create({ buffer, issueID: issue._id }, (err, updatedIssue) => {
                if (err) return void done(err);

                const file = fs.readFileSync(
                    `${config.filesDir}/${updatedIssue.files[0]}`,
                    { encoding: 'utf8' }
                );
                expect(file).to.eql(fileContents);
                done();
            });
        });
    });
});
