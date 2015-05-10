var accounts = {
  123: {
    id: 123,
    user: 'john',
    fullName: 'John Doe',
    scope: ['a', 'b']
  }
};

exports.register = function(server, options, next) {

  server.auth.strategy('jwt', 'jwt', 'required', {

    key: 'secret',
    validateFunc: function(data, request, callback) {

      if (!accounts[data.id]) {
        return callback(null, false);
      } else {
        return callback(null, true, accounts[data.id]);
      }
    }
  });

  next();
};

exports.register.attributes = {
  name: 'auth'
};
