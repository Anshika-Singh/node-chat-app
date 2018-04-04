var socket = io();

socket.on('connect', function() {
	console.log('Connected to server');

	socket.emit('createMessage', {
		'to' : 'Andrew Mead',
		'text' : 'Hello, how are you?'
	});
});

socket.on('disconnect', function() {
	console.log('Server disconnected');
});

socket.on('newMessage', function(newMessage) {
	console.log('Received a new message', newMessage);
});