const express = require('express');
const app = express();
app.use(express.static('public'));



//Endpoints
app.post('/signup', function(req, res) {

});

app.post('/login', function(req, res) {

});

app.listen(process.env.PORT || 8080);
module.exports = app;