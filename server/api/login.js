var Joi = require('joi');
var Hoek = require('hoek');
var jwt = require('jsonwebtoken');

exports.register = function (server, options, next) {

  options = Hoek.applyToDefaults({ basePath: '' }, options);

  server.route({
    method: 'POST',
    path: options.basePath + '/login',
    config: {
      plugins: {
        'hapi-io': 'login'
      },
      validate: {
        payload: {
          username: Joi.string().lowercase().required(),
          password: Joi.string().required()
        }
      },
      auth: false
    },
    handler: function (request, reply) {

      var User = request.server.plugins['hapi-mongo-models'].User;
      var username = request.payload.username;
      var password = request.payload.password;

      User.findByCredentials(username, password, function (err, user) {

        if (err) {
          return reply(err);
        }

        if (user) {
          var token = jwt.sign({id: 123}, 'secret', {expiresInMinutes: 5});
          reply({token: token});
        } else {
          reply({message: 'Invalid Credentials'}).code(400);
        }
      });

    }
  });

  next();
};

exports.register.attributes = {
  name: 'login'
};
