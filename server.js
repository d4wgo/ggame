var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var loki = require('lokijs');
var topAimScoreArray = ["Unknown","Unknown","Unknown","Unknown","Unknown","Unknown","Unknown","Unknown","Unknown","Unknown"];
var topAimScoreArrayTime = [999.9,999.9,999.9,999.9,999.9,999.9,999.9,999.9,999.9,999];
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
    socket.on("aimScoreSubmit", function(name,time){
        if(name != "Guest"){
            if(parseFloat(time) < topAimScoreArrayTime[9]){
                topAimScoreArrayTime.push(parseFloat(time));
                topAimScoreArrayTime.sort(function(a, b){return a - b});
                for(var i = 0; i < 10; i++){
                    if(topAimScoreArrayTime[i] == parseFloat(time)){
                        for(var j = 9; j > i; j--){
                            topAimScoreArray[j] = topAimScoreArray[j - 1];
                        }
                        topAimScoreArray[i] = name;
                        topAimScoreArrayTime.splice(10,1);
                    }
                }
            }
            var tempUser = users.findOne({name: data});
            if(tempUser != null){
                if(tempUser.bestaimtime > parseFloat(time)){
                    tempUser.bestaimtime = parseFloat(time);
                    users.update(tempUser);
                }
                socket.emit("bestScore",tempUser.bestaimtime);
            }
        }
        socket.emit("aimScores",topAimScoreArray,topAimScoreArrayTime);
    });
    socket.on("signin", function(name){
        var tempUser = users.findOne({name: data});
        if(tempUser == null){
            users.insert({uname: name, bestaimtime: 999.9});
        }
    });
    socket.on('disconnect', function() {
	});
});