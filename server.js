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
    var aimArray = users.findOne({uname: "topAimArray"});
    if(aimArray == null){
        users.insert({uname: "topAimArray", namesArray: topAimScoreArray, timesArray: topAimScoreArrayTime});
    }
    else{
        topAimScoreArray = aimArray.namesArray;
        topAimScoreArrayTime = aimArray.timesArray;
    }
}
app.set('port', 8080);
app.use('/static', express.static(__dirname + '/static'));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/client/play.html'));
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
            var writeA = true;
            var preincluded = false;
            if(topAimScoreArray.includes(name)){
                var ind = topAimScoreArray.indexOf(name);
                if(topAimScoreArrayTime[ind] < parseFloat(time)){
                    writeA = false;
                }
                else{
                    topAimScoreArray.splice(ind,1);
                    topAimScoreArrayTime.splice(ind,1);
                    topAimScoreArray.push("temp");
                }
            }
            if(parseFloat(time) < topAimScoreArrayTime[9] && writeA){
                topAimScoreArrayTime.push(parseFloat(time));
                topAimScoreArrayTime.sort(function(a, b){return a - b});
                for(var i = 0; i < topAimScoreArrayTime.length; i++){
                    if(topAimScoreArrayTime[i] == parseFloat(time)){
                        for(var j = 9; j > i; j--){
                            topAimScoreArray[j] = topAimScoreArray[j - 1];
                        }
                        topAimScoreArray[i] = name;
                        if(topAimScoreArrayTime.length > 10){
                            topAimScoreArrayTime.splice(10,1);
                        }
                    }
                }
                var savedArray = users.findOne({uname: "topAimArray"});
                savedArray.namesArray = topAimScoreArray;
                savedArray.timesArray = topAimScoreArrayTime;
                users.update(savedArray);
            }
            var tempUser = users.findOne({uname: name});
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
        var tempUser = users.findOne({uname: name});
        if(tempUser == null){
            users.insert({uname: name, bestaimtime: 999.9});
        }
    });
    socket.on('disconnect', function() {
	});
});