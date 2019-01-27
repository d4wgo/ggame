var socket = io.connect('https://react.dawg.cc');
var origT;
var name1 = "Guest";
function pingTest(){
    socket.emit("ping1");
    origT = Date.now();
}
socket.on("pong",function(){
    var p = Date.now() - origT;
    //console.log("Ping to server is: " + p);
});
function setName(a){
    name1 = a;
}
function getName(){
    return name1;
}
function signInEvent(){
    if(name1 != "Guest"){
        socket.emit("signin",name1);
    }
}
