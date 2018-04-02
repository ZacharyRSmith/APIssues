const expect = require('chai').expect;
const mongoose = require('mongoose');
const request = require('supertest');

const Issue = require('../../../api/models/issue');
const server = require('../../../app');

const MONGODB = process.env.MONGODB;
if (!MONGODB) throw new Error(`process.env.MONGODB must be defined.`);

describe('controllers - issues', () => {
    let issue;

    before((done) => {
        mongoose.connect(MONGODB, (err) => {
            if (err) return void done(err);
            issue = new Issue({ name: 'foo' });
            issue.save(done);
        });
    });

    after((done) => {
        mongoose.disconnect(done);
    });

    describe('GET /index', () => {
        it('should return an array of issues', (done) => {
            request(server)
                .get('/issues')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(err).not.to.exist;

                    expect(Array.isArray(res.body)).to.be.true;
                    // TODO enhance

                    done();
                });
        });
    });

    describe('GET /index/{_id}', () => {
        it('should return an issue', (done) => {
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

        it('should return 404', (done) => {
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
});
