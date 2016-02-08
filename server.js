var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// sends current users to provided socket
function sendCurrentUsers(socket) {
    var info = clientInfo[socket.id];
    var users = [];
    
    if (typeof info === 'undefined') {
        return;
    } 
    
    Object.keys(clientInfo).forEach(function(socketId) { // iterate all client ids. Ids have their name, room
        var userinfo = clientInfo[socketId];
        
        if (info.room === userinfo.room) {
            users.push(userinfo.name);
        }    
    });
    
    socket.emit('message', {
       name: 'System',
       text: 'Current users: ' + users.join(', '), // takes all array elements, converts to string and passes one by one 
       timestamp: moment().valueOf()
    });
}

io.on('connection', function(socket) { // word socket means an individual connection
   console.log('User Connected via socket.io!');
   
   socket.on('disconnect', function() {
      var userData = clientInfo[socket.id];
      
      if (typeof userData !== 'undefined') {
          socket.leave(userData.room);
          
          io.to(userData.room).emit('message', {
             name: 'System',
             text: userData.name + ' has left...',
             timestamp: moment().valueOf() 
          });
          
          delete clientInfo[socket.id];
      } 
   }); // built in event
   
   socket.on('joinRoom', function(req) {
      clientInfo[socket.id] = req;
      socket.join(req.room);
      socket.broadcast.to(req.room).emit('message', {
         name: 'System',
         text: req.name + ' has joined!',
         timestamp: moment().valueOf()
      });  
   });
   
   socket.on('message', function(message) {
      console.log('Message received: ' + message.text);
      
      if (message.text === '@currentUsers') {
          sendCurrentUsers(socket);
      } else {
         message.timestamp = moment().valueOf(); // return the JS timestamp (ms)
         io.to(clientInfo[socket.id].room).emit('message', message); // only emits to the same room 
      }   
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