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

$('#message-form').on('submit', function(e){
	e.preventDefault();

	socket.emit('createMessage', {
		'from' : 'User',
		'text' : $('[name = message]').val()
	}, function(data) {
		
	});
});

var locationButton = $('#send-location');

locationButton.on('click', function(){
	if(!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}

	navigator.geolocation.getCurrentPosition( function(position) {
		socket.emit('createLocationMessage', {
			'latitude' : position.coords.latitude,
			'longitude' : position.coords.longitude
		});
	}, function() {
		alert('Unable to fetch geolocation');
	});
});