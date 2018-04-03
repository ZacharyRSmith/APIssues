'use strict';
const async = require('async');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const request = require('supertest');

const Issue = require('../../../api/models/issue');
const server = require('../../../app');

const MONGODB = process.env.MONGODBTEST || 'mongodb://localhost:27017/issuesTest';

describe('controllers - issues', () => {
    let issue;
    let issue2;

    before((done) => {
        mongoose.connect(MONGODB, (err) => {
            if (err) return void done(err);
            issue = new Issue({ name: 'foo' });
            issue2 = new Issue({ name: 'foo2' });
            async.parallel([
                cb => issue.save(cb),
                cb => issue2.save(cb)
            ], done);
        });
    });

    after((done) => {
        mongoose.disconnect(done);
    });

    describe('GET /issues', () => {
        it('should return an array of issues', (done) => {
            request(server)
                .get('/issues')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(err).not.to.exist;

                    expect(Array.isArray(res.body)).to.be.true;
                    expect(res.body[0].name).to.match(new RegExp(`${issue.name}|${issue2.name}`));
                    expect(res.body[1].name).to.match(new RegExp(`${issue.name}|${issue2.name}`));

                    done();
                });
        });
    });

    describe('GET /issues/{_id}', () => {
        it('should return an issue when _id matches', (done) => {
            request(server)
                .get(`/issues/${issue._id}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(err).not.to.exist;

                    expect(res.body.name).to.equal(issue.name);

                    done();
                });
        });

        it('should return 404 when _id does not match', (done) => {
            request(server)
                .get(`/issues/foobar`)
                .set('Accept', 'application/json')
                .expect(404)
                .end((err) => {
                    expect(err).to.exist;

                    done();
                });
        });
    });

    describe('POST /issues', () => {
        it('should create an issue', (done) => {
            const newIssue = { name: 'newIssue' };

            // TODO: Assert that record was added to issues collection,
            // and see if node module "test-mongoose-utils" could run this assertion
            // with this testing setup.
            request(server)
                .post(`/issues`)
                .send(newIssue)
                .set('accept', 'json')
                .expect(201)
                .expect('content-type', /json/)
                .end((err, res) => {
                    expect(err).not.to.exist;

                    expect(res.body.name).to.equal(newIssue.name);

                    done();
                });
        });
    });
});
