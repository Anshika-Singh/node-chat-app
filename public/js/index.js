var socket = io();

socket.on('connect', function() {
	console.log('Connected to server');
});

socket.on('disconnect', function() {
	console.log('Server disconnected');
});

socket.on('newMessage', function(newMessage) {
	var formattedTime = moment(newMessage.createdAt).format('h:mm a');

	var li = $('<li></li>');
	li.text(`${newMessage.from} ${formattedTime} : ${newMessage.text}`);
	$('#messages').append(li);
});

socket.on('newLocationMessage', function(newMessage) {
	var formattedTime = moment(newMessage.createdAt).format('h:mm a');
	var li = $('<li></li>');
	var a = $('<a target="_blank">My Location</a>')
	li.text(`${newMessage.from} ${formattedTime} `);
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