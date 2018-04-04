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
        async.series([
            cb => mongoose.connect(MONGODB, cb),
            cb => mongoose.connection.db.dropDatabase(cb)
        ], done);
    });

    after((done) => {
        mongoose.disconnect(done);
    });

    beforeEach((done) => {
        issue = new Issue({ name: 'foo' });
        issue2 = new Issue({ name: 'foo2' });

        async.parallel([
            cb2 => issue.save(cb2),
            cb2 => issue2.save(cb2)
        ], done);
    });

    afterEach((done) => {
        Issue.collection.drop(done);
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

                    expect(Array.isArray(res.body.results)).to.be.true;
                    expect(res.body.results[0].name).to.match(new RegExp(`${issue.name}|${issue2.name}`));
                    expect(res.body.results[1].name).to.match(new RegExp(`${issue.name}|${issue2.name}`));

                    done();
                });
        });

        it('should use cursor-based pagination to avoid problems with limit-based pagination', (done) => {
            const issues = Array(35).fill(null).map((item, i) => new Issue({ name: `name_${i}` }));

            async.auto({
                dropIssues: cb => Issue.collection.drop(cb),
                issues: ['dropIssues', (results, cb) => {
                    async.each(issues, (issue, cb2) => issue.save(cb2), cb);
                }],
                firstPage: ['issues', (results, cb) => {
                    request(server)
                        .get(`/issues`)
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .end((err, res) => {
                            expect(err).not.to.exist;
                            const { pageInfo, results } = res.body;

                            results.forEach(issue => expect(issue.name).to.match(/name_\d{1,2}/));

                            expect(pageInfo.hasNextPage).to.be.true;

                            cb(null, pageInfo);
                        });
                }],
                rmFirstRecord: ['firstPage', (results, cb) => {
                    Issue.findOne({}).sort({ _id: 1 }).exec((err, issue) => {
                        if (err) return void cb(err);
                        issue.remove(cb);
                    });
                }],
                assertNextPageHas5Records: ['rmFirstRecord', ({ firstPage }, cb) => {
                    request(server)
                        .get(`/issues?cursor=${firstPage.endCursor}`)
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .end((err, res) => {
                            expect(err).not.to.exist;
                            const { pageInfo, results } = res.body;

                            results.forEach(issue => expect(issue.name).to.match(/name_\d{1,2}/));
                            expect(results.length).to.eql(5);
                            expect(pageInfo.hasNextPage).to.be.false;

                            cb();
                        });
                }]
            }, done);
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
