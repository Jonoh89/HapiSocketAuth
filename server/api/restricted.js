var Joi = require('joi');
var Hoek = require('hoek');


exports.register = function (server, options, next) {

  options = Hoek.applyToDefaults({ basePath: '' }, options);


  server.route({
    method: 'GET',
    path: options.basePath + '/restricted',
    config: {
      auth: {
        strategy: 'jwt'
      }
    },
    handler: function (request, reply) {

      reply('connected');
    }
  });

  next();
};


exports.register.attributes = {
  name: 'restricted'
};
