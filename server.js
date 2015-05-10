'use strict';

var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({port: 3000});

server.register([
  {register: require('hapi-auth-jwt2'), options:{}},
  {register: require('./server/auth'), options:{}},
  {register: require('./server/api/login'), options:{}},
  {register: require('./server/api/restricted'), options:{}}
], function (err) {
  console.log('plugin error: ' + err);
});

server.start(function() {
  console.log('Server running at:', server.info.uri);
});