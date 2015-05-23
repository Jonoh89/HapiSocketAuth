'use strict';

var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({port: 3000});

server.register([
  {register: require('hapi-mongo-models'), options:{
    mongodb: {
      url: 'mongodb://localhost:27017/hapi-socket-auth',
      options:{}
    },
    autoIndex: false,
    models: {
      User: './server/models/user'
    }
  }},
  {register: require('hapi-auth-jwt2'), options:{}},
  {register: require('./server/auth'), options:{}},
  {register: require('hapi-io'), options:{auth: {strategy: 'jwt'}}},
  {register: require('./server/api/register'), options:{}},
  {register: require('./server/api/login'), options:{}},
  {register: require('./server/api/restricted'), options:{}}
], function (err) {
  if (err) {
    console.log('plugin error: ' + err);
  } else {
    console.log('plugins loaded');
  }
});

server.start(function() {
  console.log('Server running at:', server.info.uri);
});
