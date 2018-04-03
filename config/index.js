'use strict';

module.exports = {
    MONGODB: process.env.MONGODB || 'mongodb://localhost:27017/issues',
    server: {
        PORT: process.env.PORT || 10010
    }
};
