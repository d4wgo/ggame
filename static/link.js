var socket = io.connect('https://react.dawg.cc');
var origT;
function pingTest(){
    socket.emit("ping1");
    origT = Date.now();
}
socket.on("pong",function(){
    var p = Date.now() - origT;
    console.log("Ping to server is: " + p);
});
