var socket = io();

socket.on('connect', function() {
   console.log('connected to socket.io server!'); 
});

socket.on('message', function(message) {
    console.log('New message');
    console.log(message.text); // we saved object message in backend
});

socket.emit('message', { // on message do smth
       text: 'Welcome to the chat application!'
   }); 