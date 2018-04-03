const async = require('async');
const expect = require('chai').expect;
const fs = require('fs');
const mongoose = require('mongoose');
const request = require('supertest');

const server = require('../../../app');
const config = require('../../../config');

const MONGODB = process.env.MONGODBTEST || 'mongodb://localhost:27017/issuesTest';

describe('controllers - files', () => {
    const basePath = '/files';

    before((done) => {
        mongoose.connect(MONGODB, done);
    });

    after((done) => {
        mongoose.disconnect(done);
    });

    describe(`GET ${basePath}/{_id}`, () => {
        it('should return a 404', (done) => {
            request(server)
                .get(`/files/noexist`)
                .set('Accept', 'application/octet-stream')
                .expect(404)
                .end(() => {
                    done();
                });
        });

        // Pended because of this:
        // https://github.com/visionmedia/supertest/issues/352
        xit('should return a file', (done) => {
            const fileID = 'fileID';

            async.series([
                cb => {
                    fs.writeFile(`${config.filesDir}/${fileID}`, 'foo', cb);
                },
                cb => {
                    request(server)
                        .get(`/files/${fileID}`)
                        .set('Accept', 'application/octet-stream')
                        .expect(200)
                        .expect('content', /octet-stream/)
                        .end((err, res) => {
                            expect(err).not.to.exist;

                            expect(res.body).to.eql('foo');

                            cb();
                        });
                }
            ], done);
        });
    });
});
