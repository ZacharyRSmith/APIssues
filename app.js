'use strict';

const async = require('async');
const errStackLib = require('async-error-stack');
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const mongoose = require('mongoose');

const config = require('./config');

const NODE_ENV = String(process.env.NODE_ENV || 'production');

const logger = console;

errStackLib({
  disable: NODE_ENV === 'production',
  logger
});

process.on('unhandledRejection', (error, p) => {
  logger.error('Unhandled Rejection at: Promise', p, 'error:', error);
  throw error;
});

module.exports = app; // for testing

const swaggerConfig = {
  appRoot: __dirname // required config
};

const initTasks = [
  cb => {
    mongoose.connect(config.MONGODB, cb);
  },
  cb => {
    SwaggerExpress.create(swaggerConfig, function (err, swaggerExpress) {
      if (err) { throw err; }

      swaggerExpress.register(app);

      const port = config.server.PORT;
      app.listen(port, cb);

      if (swaggerExpress.runner.swagger.paths['/hello']) {
        logger.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
      }
    });
  }
];

async.series(initTasks);
