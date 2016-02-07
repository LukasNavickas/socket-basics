var socket = io();

socket.on('connect', function() {
   console.log('connected to socket.io server!'); 
});

socket.on('message', function(message) {
    var momentTimestamp = moment.utc(message.timestamp); // standartized UTC time
    console.log('New message');
    console.log(message.text); // we saved object message in backend
    
    $('.messages').append('<p><strong>' + momentTimestamp.local().format('h:mm a') + ': </strong>' + message.text + '</p>');
});

// handles submiting of new message
$('#message-form').on('submit', function(event) {
   event.preventDefault();
   var $message = $('#message-form').find('input[name=message]');
   
   socket.emit('message', {
      text: $message.val() 
   });
   
   $message.val('');
});