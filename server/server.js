const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message.js')
var app = express();

const publicPath = path.join(__dirname, '../public'); 
const port = process.env.PORT || 3000;
var server = http.createServer(app);  //server created
var io = socketIO(server); //serversocket created here and io() used to create socket on client's end 

io.on('connection', (socket) => {
	console.log('New User Connected');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});

	socket.on('createMessage', (message, callback) => {
		console.log('Received a new message', message);

		io.emit('newMessage', generateMessage(message.from, message.text));

		callback('This is from the server');
	});
});
server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

app.use(express.static(publicPath));


