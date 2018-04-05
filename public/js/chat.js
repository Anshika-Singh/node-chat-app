var socket = io();

function scrollToBottom() {
	//selectors
	var messages = $('#messages');
	var newMessage = messages.children('li:last-child')
	//heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function() {
	console.log('Connected to server');
});

socket.on('disconnect', function() {
	console.log('Server disconnected');
});

socket.on('newMessage', function(newMessage) {
	var formattedTime = moment(newMessage.createdAt).format('h:mm a');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		from : newMessage.from,
		text : newMessage.text,
		createdAt : formattedTime
	});
	$('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function(newMessage) {
	var formattedTime = moment(newMessage.createdAt).format('h:mm a');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template, {
		from : newMessage.from,
		url : newMessage.url,
		createdAt : formattedTime
	});
	$('#messages').append(html);
	scrollToBottom();
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