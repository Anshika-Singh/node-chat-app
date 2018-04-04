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


