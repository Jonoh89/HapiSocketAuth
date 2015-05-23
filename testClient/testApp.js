'use strict';

var socket = io('http://localhost:3000');

document.querySelector('.submit-btn').addEventListener('click', function() {
  var username = document.querySelector('.username-input').value;
  var password = document.querySelector('.password-input').value;
  var status = document.querySelector('.login-status');

  socket.emit('login', {username: username, password: password}, function(response) {
    status.value(response.token);
  })
});