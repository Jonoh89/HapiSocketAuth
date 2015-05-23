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
    path: options.basePath + '/register',
    config: {
      validate: {
        payload: {
          username: Joi.string().lowercase().required(),
          password: Joi.string().required()
        }
      },
      auth: false,
      pre: [
        {
          assign: 'usernameCheck',
          method: function (request, reply) {

            var User = request.server.plugins['hapi-mongo-models'].User;
            var conditions = {
              username: request.payload.username
            };

            User.findOne(conditions, function (err, user) {

              if (err) {
                return reply(err);
              }

              if (user) {
                var response = {
                  message: 'Username already in use.'
                };

                return reply(response).takeover().code(409);
              }

              reply(true);
            });
          }
        }
      ]
    },
    handler: function (request, reply) {

      var user = request.server.plugins['hapi-mongo-models'].User;

      user.create(request.payload.username, request.payload.password, function(err, newUser) {

        if (err) {
          reply({message: err}).code(500);
        }

        var token = jwt.sign({id: 123}, 'secret', {expiresInMinutes: 5});
        reply({token: token});
      });

    }
  });
  next();
};


exports.register.attributes = {
  name: 'register'
};
