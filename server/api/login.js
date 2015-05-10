var Joi = require('joi');
var Hoek = require('hoek');
var jwt = require('jsonwebtoken');
//var Async = require('async');
//var Bcrypt = require('bcrypt');
//var Config = require('../../config');


exports.register = function (server, options, next) {

  options = Hoek.applyToDefaults({ basePath: '' }, options);


  server.route({
    method: 'POST',
    path: options.basePath + '/login',
    config: {
      validate: {
        payload: {
          username: Joi.string().lowercase().required(),
          password: Joi.string().required()
        }
      },
      auth: false
    },
    handler: function (request, reply) {

      var token = jwt.sign({id: 123}, 'secret');
      reply({token: token});
    }
  });

  next();
};


exports.register.attributes = {
  name: 'login'
};
