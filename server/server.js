const path = require('path');
const express = require('express');
var app = express();

const publicPath = path.join(__dirname, '../public'); 
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});

app.use(express.static(publicPath));


