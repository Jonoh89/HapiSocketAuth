var Joi = require('joi');
var ObjectAssign = require('object-assign');
var BaseModel = require('hapi-mongo-models').BaseModel;
var Async = require('async');
var Bcrypt = require('bcrypt');

var User = BaseModel.extend({

  constructor: function(attrs) {

    ObjectAssign(this, attrs);
  }
});

User._collection = 'users';

User.schema = Joi.object().keys({
  username: Joi.string().lowercase().required(),
  password: Joi.string().min(6).required(),
  timeCreated: Joi.date()
});

User.indexes = [
  [{ username: 1 }, { unique: true }],
  [{ email: 1 }, { unique: true }]
];

User.generatePasswordHash = function (password, callback) {

  Async.auto({
    salt: function (done) {

      Bcrypt.genSalt(10, done);
    },
    hash: ['salt', function (done, results) {

      Bcrypt.hash(password, results.salt, done);
    }]
  }, function (err, results) {

    if (err) {
      return callback(err);
    }

    callback(null, {
      password: password,
      hash: results.hash
    });
  });
};

User.create = function (username, password, callback) {

  var self = this;

  Async.auto({
    passwordHash: this.generatePasswordHash.bind(this, password),
    newUser: ['passwordHash', function (done, results) {

      var document = {
        username: username.toLowerCase(),
        password: results.passwordHash.hash,
        timeCreated: new Date()
      };

      self.insertOne(document, done);
    }]
  }, function (err, results) {

    if (err) {
      return callback(err);
    }

    results.newUser[0].password = results.passwordHash.password;

    callback(null, results.newUser[0]);
  });
};

User.findByCredentials = function (username, password, callback) {

  var self = this;

  Async.auto({
    user: function (done) {

      self.findOne({username: username.toLowerCase()}, done);
    },
    passwordMatch: ['user', function (done, results) {

      if (!results.user) {
        return done(null, false);
      }

      var source = results.user.password;
      Bcrypt.compare(password, source, done);
    }]
  }, function (err, results) {

    if (err) {
      return callback(err);
    }

    if (results.passwordMatch) {
      return callback(null, results.user);
    }

    callback();
  });
};

module.exports = User;