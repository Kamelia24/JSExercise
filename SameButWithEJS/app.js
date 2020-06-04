const express = require('express');
const app = express();
const bodyParser= require("body-parser");
const session = require('express-session');
const Router = require('./routes/routes.js');

//const { check, validationResult, matchedData } = require('express-validator');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(Router);
var port=3000;
app.listen(port,()=>{console.log(`Node JS API is listening on port: ${port}`);});
