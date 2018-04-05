var socket = io();

socket.on('connect', function() {
	console.log('Connected to server');
});

socket.on('disconnect', function() {
	console.log('Server disconnected');
});

socket.on('newMessage', function(newMessage) {
	console.log('Received a new message from the server', newMessage);

	var li = $('<li></li>');
	li.text(`${newMessage.from} : ${newMessage.text}`);
	$('#messages').append(li);
});

socket.on('newLocationMessage', function(newMessage) {
	var li = $('<li></li>');
	var a = $('<a target="_blank">My Location</a>')
	li.text(`${newMessage.from} `);
	a.attr('href', newMessage.url);
	li.append(a);
	$('#messages').append(li);
});

var messageTextBox = $('[name = message]');

$('#message-form').on('submit', function(e){
	e.preventDefault();

	socket.emit('createMessage', {
		'from' : 'User',
		'text' : messageTextBox.val()
	}, function() {
		messageTextBox.val('');
	});
});

var locationButton = $('#send-location');

locationButton.on('click', function(){
	if(!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled','disabled').text('Sending Location...');
	navigator.geolocation.getCurrentPosition( function(position) {
		locationButton.removeAttr('disabled').text('Send Location');
		socket.emit('createLocationMessage', {
			'latitude' : position.coords.latitude,
			'longitude' : position.coords.longitude
		});
	}, function() {
		locationButton.removeAttr('disabled').text('Send Location');
		alert('Unable to fetch geolocation');
	});
});