'use strict';
const expect = require('chai').expect;
const uuid = require('uuid/v1');

const Issue = require('../../../api/models/issue');

// I've used mongoose-uuid2 in the past, and have had trouble with it.
// So, let's test it ourselves.
it('validates that file ids are of type uuid (invalid case)', (done) => {
    const invalidIssue = new Issue({
        files: ['notValid']
    });
    invalidIssue.validate((validationErr) => {
        expect(validationErr).not.to.be.undefined;
        done();
    });
});

it('validates that file ids are of type uuid (valid case)', (done) => {
    const validIssue = new Issue({
        files: [uuid()]
    });
    validIssue.validate((validationErr) => {
        expect(validationErr).to.be.null;
        done();
    });
});
