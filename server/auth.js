

exports.register = function(server, options, next) {

  server.auth.strategy('jwt', 'jwt', 'required', {

    key: 'secret',
    validateFunc: function(data, request, callback) {

      var User = request.server.plugins['hapi-mongo-models'].User;
      User.findById(data.id, function(err, user) {
        if (err) {
          return callback(err);
        }

        if (user) {
          return callback(null, false);
        } else {
          return callback(null, true, user);
        }
      });

    }
  });

  next();
};

exports.register.attributes = {
  name: 'auth'
};
