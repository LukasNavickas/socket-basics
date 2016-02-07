var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) { // word socket means an individual connection
   console.log('User Connected via socket.io!');
   
   socket.on('message', function(message) {
      console.log('Message received: ' + message.text);
      
      message.timestamp = moment().valueOf(); // return the JS timestamp (ms)
      io.emit('message', message); 
   });
   
   // timestrap property - JS timestamp (ms)
   
   socket.emit('message', { // on message do smth
       name: 'System',
       text: 'Welcome to the chat application!',
       timestamp: moment().valueOf()
   }); 
});

http.listen(PORT, function() {
   console.log('server started!'); 
});