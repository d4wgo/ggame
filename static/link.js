var origT;
var name1 = "Guest";
var name2 = "Guest";
function pingTest(){
    socket.emit("ping1");
    origT = Date.now();
}
/*
socket.on("pong",function(){
    var p = Date.now() - origT;
    //console.log("Ping to server is: " + p);
});
socket.on("diffname", function(nname){
    console.log(nname);
    name1 = nname;
});*/
function setTrueName(a){
    name1 = a;
    name2 = a;
}
function setName(a){
    name1 = a;
}
function getName(){
    return name1;
}
function getTrueName(){
    return name2;
}
/*
function signInEvent(){
    if(name1 != "Guest"){
        socket.emit("signin",name1);
    }
}*/

