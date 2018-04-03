'use strict';

const MONGODB = process.env.MONGODB || 'mongodb://localhost:27017/issues';
const NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = {
    MONGODB: MONGODB || 'mongodb://localhost:27017/issues',
    filesDir: NODE_ENV === 'test'
        ? `${__dirname}/../test/files`
        : `${__dirname}/../files`,
    server: {
        PORT: process.env.PORT || 10010
    }
};
