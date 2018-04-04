const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var app = express();

const publicPath = path.join(__dirname, '../public'); 
const port = process.env.PORT || 3000;
var server = http.createServer(app);  //server created
var io = socketIO(server); //serversocket created here and io() used to create socket on client's end 

io.on('connection', (socket) => {
	console.log('New User Connected');

	socket.emit('newMessage', {
		'from' : 'Admin',
		'text' : 'Welcome to the chat app',
		'createdAt' : new Date().getTime()
	});

	socket.broadcast.emit('newMessage', {
		'from' : 'Admin',
		'text' : 'New User Joined',
		'createdAt' : new Date().getTime()
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});

	socket.on('createMessage', function(newMessage) {
		console.log('Received a new message', newMessage);

		io.emit('newMessage', {
			'from' : newMessage.from,
			'text' : newMessage.text,
			'createdAt' : new Date().getTime()
		});
	});
});
server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

app.use(express.static(publicPath));


