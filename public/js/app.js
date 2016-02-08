var name = getQueryVariable('name') || 'Stranger';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room);

//update h1 tag
$('.room-title').text(room); // add room variable info

socket.on('connect', function() {
   console.log('connected to socket.io server!'); 
   socket.emit('joinRoom', {
       name: name,
       room: room
   });
});

socket.on('message', function(message) {
    var momentTimestamp = moment.utc(message.timestamp); // standartized UTC time
    var $message = $('.messages');
    console.log('New message');
    console.log(message.text); // we saved object message in backend
    
    $message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
    $message.append('<p>' + message.text + '</p>');
});

// handles submiting of new message
$('#message-form').on('submit', function(event) {
   event.preventDefault();
   var $message = $('#message-form').find('input[name=message]');
   
   socket.emit('message', { // perduodam socket.on('message') su textu
      name: name,
      text: $message.val() 
   });
   
   $message.val('');
});