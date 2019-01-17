var express = require('express');  
var app = express();  
var port = process.env.port || 82;  
var apiurl = "/api/v1.0/";
var bodyParser = require('body-parser');  
var commonFun = require('./Common/commonFun'); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

var authController = require('./Controller/AuthController')(); 
var customerController = require('./Controller/CustomerController')(); 
var commonController = require('./Controller/CommonController')(); 

app.use(""+apiurl+"auth", authController)
app.use(""+apiurl+"Customer", customerController)
app.use(""+apiurl+"Common", commonController)

process.on('uncaughtException', function(ex) {
    commonFun.errorLog(ex);
})

app.listen(port, function () {  
    var datetime = new Date();  
    var message = "Server runnning on Port:- " + port + " Started at :- " + datetime;  
    console.log(message);  
}); 

