var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var loki = require('lokijs');
var users;
var db = new loki('loki.json', {
	autoload: true,
	autoloadCallback : databaseInitialize,
	autosave: true, 
	autosaveInterval: 4000
});
function databaseInitialize() {
    users = db.getCollection("users");
    if (users === null) {
      users = db.addCollection("users", { disableChangesApi: false });
    }
}
app.set('port', 8080);
app.use('/static', express.static(__dirname + '/static'));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/client/play.html'));
    //__dirname : It will resolve to your project folder.
});
app.get('/mobile',function(req,res){
    res.sendFile(path.join(__dirname+'/client/mobile.html'));
});
server.listen(8080, function() {
    console.log('Starting server on port 8080');
});
io.on('connection', function (socket) {
    socket.on("ping1", function(){
        socket.emit("pong");
    });
    socket.on('disconnect', function() {
	});
});