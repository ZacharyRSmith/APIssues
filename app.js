'use strict';

const errStackLib = require('async-error-stack');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();

const NODE_ENV = String(process.env.NODE_ENV || 'production');

errStackLib({
  disable: NODE_ENV === 'production'
});

process.on('unhandledRejection', (error, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'error:', error);
  throw error;
});

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
