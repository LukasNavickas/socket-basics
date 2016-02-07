var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) { // word socket means an individual connection
   console.log('User Connected via socket.io!');
   
   socket.on('message', function(message) {
      console.log('Message received: ' + message.text);
      socket.broadcast.emit('message', message); 
   });
   
   socket.emit('message', { // on message do smth
       text: 'Welcome to the chat application!'
   }); 
});

http.listen(PORT, function() {
   console.log('serber started!'); 
});