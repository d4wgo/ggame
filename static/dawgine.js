//image refrences
//---------------
var socket = io.connect('https://react.dawg.cc');
var gameObjects = []; //gameobjects are seen by rayscans
var nullObjects = []; //null objects are not seen by rayscans
var ui = [];
var buttons = []; //clickable buttons
//gameObject
//syntax:
//new var newGO = GameObject(id,x,y,posX,posY,sizeX,sizeY);
//font:
var font = "Iceberg";
var worldTextAlign = "center";
//gameObjects.push(newGO);
class GameObject{
    constructor(a,b,c,d,e){
        this.id = a;
        this.x = b;
        this.y = c;
        this.sizeX = d;
        this.sizeY = e;
        this.image = null;
        this.color = null;
        this.gravity = null;
        this.rotation = null;
        this.clicked = null;
        this.hovered = null;
        this.gravityTimer = 0;
        this.yForce = 0;
        this.text = null;
        this.textColor = "white";
        this.textSize = 20;
        this.textOffsetY = 0;
        this.textOffsetX = 0;
        this.parent = null;
        this.changeX = 0;
        this.changeY = 0;
        this.rotateBox = null;
        this.bringToFront = false;
    }
}
function findObject(id){
    for(var i = 0; i < gameObjects.length; i++){
        if(gameObjects[i].id == id){
            return gameObjects[i];
        }
    }
    for(var i = 0; i < nullObjects.length; i++){
        if(nullObjects[i].id == id){
            return nullObjects[i];
        }
    }
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i].id == id){
            return buttons[i];
        }
    }
    for(var i = 0; i < ui.length; i++){
        if(ui[i].id == id){
            return ui[i];
        }
    }
    return null;
}
function deleteObject(id){
    var found = false;
    for(var i = 0; i < gameObjects.length; i++){
        if(gameObjects[i].id == id){
            gameObjects.splice(i,1);
            found = true;
            break;
        }
    }
    if(!found){
        for(var i = 0; i < nullObjects.length; i++){
            if(nullObjects[i].id == id){
                nullObjects.splice(i,1);
                found = true;
                break;
            }
        }
        if(!found){
            for(var i = 0; i < buttons.length; i++){
                if(buttons[i].id == id){
                    buttons.splice(i,1);
                    found = true;
                    break;
                }
            }
            if(!found){
                for(var i = 0; i < ui.length; i++){
                    if(ui[i].id == id){
                        ui.splice(i,1);
                        break;
                    }
                }
            }
        }
    }
}
//rayscan
//syntax:
//rayscan(starting x, starting y, angle, distance)
function rayscan(startX,startY,angle,dist){
    var checkX = startX;
    var checkY = startY;
    var ang = angle;
    for(var i = 0; i < dist; i++){
        for(var j = 0; j < gameObjects.length; j++){
            var objCheck = gameObjects[j];
            if(objCheck.rotation == null || objCheck.rotation == 0){
                if(checkX >= (objCheck.x - objCheck.sizeX/2) && checkX <= (objCheck.x + objCheck.sizeX/2) && checkY <= (objCheck.y + objCheck.sizeY/2) && checkY >= (objCheck.y - objCheck.sizeY/2)){
                    return objCheck;
                }
            }
            else{
                if(pythagTheorem(objCheck.sizeX/2,objCheck.sizeY/2) > pythagTheorem(objCheck.x - checkX, objCheck.y - checkY)){
                    //tl
                    var farXtL = -(objCheck.sizeX / 2);
                    var farYtL = -(objCheck.sizeY / 2);
                    var radiustL = pythagTheorem(farXtL,farYtL);
                    var initRottL = Math.atan(farYtL / farXtL);
                    var paX = (Math.cos(objCheck.rotation + initRottL) * radiustL) + objCheck.x;
                    var paY = (Math.sin(objCheck.rotation + initRottL) * radiustL) + objCheck.y;
                    //tr
                    var farXtR = (objCheck.sizeX / 2);
                    var farYtR = -(objCheck.sizeY / 2);
                    var radiustR = pythagTheorem(farXtR,farYtR);
                    var initRottR = Math.atan(farYtR / farXtR);
                    var pbX = (Math.cos(objCheck.rotation + initRottR) * radiustR) + objCheck.x;
                    var pbY = (Math.sin(objCheck.rotation + initRottR) * radiustR) + objCheck.y;
                    //br
                    var farXbR = (objCheck.sizeX / 2);
                    var farYbR = (objCheck.sizeY / 2);
                    var radiusbR = pythagTheorem(farXbR,farYbR);
                    var initRotbR = Math.atan(farYbR / farXbR);
                    var pcX = -(Math.cos(objCheck.rotation + initRotbR) * radiusbR) + objCheck.x;
                    var pcY = -(Math.sin(objCheck.rotation + initRotbR) * radiusbR) + objCheck.y;
                    //a to objCheck checker/finder
                    var a1 = pbY - paY; 
                    var b1 = paX - pbX; 
                    var c1 = a1*(paX) + b1*(paY); 
                    var pdX = Math.cos(objCheck.rotation) + checkX;
                    var pdY = Math.sin(objCheck.rotation) + checkY;
                    var a2 = pdY - checkY; 
                    var b2 = checkX - pdX; 
                    var c2 = a2*(checkX)+ b2*(checkY); 
                    var determinant = a1*b2 - a2*b1;  
                    var rzX = (b2*c1 - b1*c2)/determinant;         
                    //objCheck to c checker/finder
                    a1 = pcY - pbY; 
                    b1 = pbX - pcX; 
                    c1 = a1*(pbX) + b1*(pbY); 
                    pdX = Math.cos(objCheck.rotation + 1.57) + checkX;
                    pdY = Math.sin(objCheck.rotation + 1.57) + checkY;
                    a2 = pdY - checkY; 
                    b2 = checkX - pdX; 
                    c2 = a2*(checkX)+ b2*(checkY); 
                    determinant = a1*b2 - a2*b1;  
                    var rz1X = (b2*c1 - b1*c2)/determinant;           
                    //check a -> objCheck
                    var hityes = false;
                    if(paX < pbX){
                        if(rzX > paX && rzX < pbX){
                            hityes = true;
                        }
                    }
                    else{
                        if(rzX < paX && rzX > pbX){
                            hityes = true;
                        }
                    }
                    if(hityes){
                        if(pbX < pcX){
                            if(rz1X > pbX && rz1X < pcX){
                                return objCheck;
                            }
                        }
                        else{
                            if(rz1X < pbX && rz1X > pcX){
                                return objCheck;
                            }
                        }
                    }
                }
            }
        }
        checkX += Math.cos(ang);
        checkY -= Math.sin(ang);
    }
    return null;
}
//input
var input = {
    w:false,
    a:false,
    s:false,
    d:false,
    up:false,
    left:false,
    down:false,
    right:false,
    space:false,
    f:false,
    shift:false,
    one:false,
    two:false,
    three:false,
    four:false,
    five:false,
    six:false,
    seven:false,
    mouse1:false
}
var clickInput = {
    w:false,
    a:false,
    s:false,
    d:false,
    up:false,
    left:false,
    down:false,
    right:false,
    space:false,
    f:false,
    shift:false,
    one:false,
    two:false,
    three:false,
    four:false,
    five:false,
    six:false,
    seven:false,
    mouse1:false
};
var nClick;
document.addEventListener('keydown', function(event) {
    switch(event.code){
        case "KeyW":
            input.w = true;
            clickInput.w = true;
            break;
        case "KeyA":
            input.a = true;
            clickInput.a = true;
            break;
        case "KeyS":
            input.s = true;
            clickInput.s = true;
            break;
        case "KeyD":
            input.d = true;
            clickInput.d = true;
            break;
        case "ArrowUp":
            input.up = true;
            clickInput.up = true;
            break;
        case "ArrowLeft":
            input.left = true;
            clickInput.left = true;
            break;
        case "ArrowDown":
            input.down = true;
            clickInput.down = true;
            break;
        case "ArrowRight":
            input.right = true;
            clickInput.right = true;
            break;
        case "Space":
            input.space = true;
            clickInput.space = true;
            break;
        case "KeyF":
            input.f = true;
            clickInput.f = true;
            break;
        case "ShiftLeft":
            input.shift = true;
            clickInput.shift = true;
            break;
        case "Digit1":
            input.one = true;
            clickInput.one = true;
            break;
        case "Digit2":
            input.two = true;
            clickInput.two = true;
            break;
        case "Digit3":
            input.three = true;
            clickInput.three = true;
            break;
        case "Digit4":
            input.four = true;
            clickInput.four = true;
            break;
        case "Digit5":
            input.five = true;
            clickInput.five = true;
            break;
        case "Digit6":
            input.six = true;
            clickInput.six = true;
            break;
        case "Digit7":
            input.seven = true;
            clickInput.seven = true;
            break;
    }
});
document.addEventListener('keyup', function(event) {
    switch(event.code){
        case "KeyW":
            input.w = false;
            break;
        case "KeyA":
            input.a = false;
            break;
        case "KeyS":
            input.s = false;
            break;
        case "KeyD":
            input.d = false;
            break;
        case "ArrowUp":
            input.up = false;
            break;
        case "ArrowLeft":
            input.left = false;
            break;
        case "ArrowDown":
            input.down = false;
            break;
        case "ArrowRight":
            input.right = false;
            break;
        case "Space":
            input.space = false;
            break;
        case "KeyF":
            input.f = false;
            break;
        case "ShiftLeft":
            input.shift = false;
            break;
        case "Digit1":
            input.one = false;
            break;
        case "Digit2":
            input.two = false;
            break;
        case "Digit3":
            input.three = false;
            break;
        case "Digit4":
            input.four = false;
            break;
        case "Digit5":
            input.five = false;
            break;
        case "Digit6":
            input.six = false;
            break;
        case "Digit7":
            input.seven = false;
            break;
    }
});
document.addEventListener('mousedown', function(event) {
    input.mouse1 = true;
    clickInput.mouse1 = true;
});
document.addEventListener('mouseup', function(event) {
    input.mouse1 = false;
});
document.addEventListener('mousemove', function(event) {
    getCursorPosition(canvas,event);
});
var mousePos = {
    x:0,
    y:0
}
//canvas creation
var canvasName = "myCanvas"; //replace with id of canvas within the html
var canvas = document.getElementById(canvasName);
var ctx = canvas.getContext("2d");
var virtualHeight = 900; //the width of the canvas things are being drawn on before scaling
var virtualWidth = 1600; //the height of the canvas things are being drawn on before scaling
fullScreen = false; //should the canvas fill the whole screen - make sure body and the canvas have a margin and padding of 0
fitAspectRatioFullscreen = true; //should the aspect ratio of the virtual canvas be forced - this removes distortion of stretching
fitDiv = false; //if you want the canvas to be in a part of the page instead of the whole page
/*recomended css settings for canvas
    padding:0;
    margin: 0 auto;
    display:block;
*/
var scaleX;
var scaleY;
if(fullScreen){
    fullScreenCanvas();
}
else if(fitAspectRatioFullscreen){
    aspectRatioFullScreenCanvas();
}
else if(fitDiv){
    fitDivCanvas();
}
scaleX = canvas.width / virtualWidth;
scaleY = canvas.height / virtualHeight;
window.addEventListener('resize', function(){
    if(fullScreen){
        fullScreenCanvas();
    }
    else if(fitAspectRatioFullscreen){
        aspectRatioFullScreenCanvas();
    }
    else if(fitDiv){
        fitDivCanvas();
    }
    scaleX = canvas.width / virtualWidth;
    scaleY = canvas.height / virtualHeight;
});
//refreshes canvas size a set times per second - the "10" is changeable to whatever tickrate works the best
//canvas fit functions
function fullScreenCanvas(){
    canvas.width = window.innerWidth;
    canvas.height =  window.innerHeight;
}
function aspectRatioFullScreenCanvas(){
    var ratio = 0.76;
    var heightW = window.innerHeight * ratio;
    var widthW = window.innerWidth * ratio;
    var aspectR = virtualWidth / virtualHeight;
    if(aspectR > widthW/heightW){
        canvas.width = widthW;
        canvas.height = widthW / aspectR;
    }
    else{
        canvas.height = heightW;
        canvas.width = heightW * aspectR;
    }
    document.getElementById('leftBar').style.width = (window.innerWidth - canvas.width)/2;
    document.getElementById('rightBar').style.width = (window.innerWidth - canvas.width)/2;
    document.getElementById('leftBar').style.height = canvas.height;
    document.getElementById('rightBar').style.height = canvas.height;
    document.getElementById('bottomBar').style.height = window.innerHeight - (canvas.height + document.getElementById('topBar').clientHeight);
}
function fitDivCanvas(){
    var divIn = document.getElementById("myDIV"); //replace myDiv with the div the canvas is within
    canvas.height = divIn.offsetHeight;
    canvas.height = divIn.offsetWidth;
}
//cursor pos
function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    mousePos.x = x/scaleX;
    mousePos.y = y/scaleY;
}
function pythagTheorem(a,b){
    return Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
}
socket.on("diffname", function(nname){
    setName(nname);
});
var scene = 1;
function start(){
    switchScene(scene);
}
var oDistX = 0;
var oDistY = 0;
start();
var prevTime = Date.now();
var delta;
function runGame(){
    delta = Date.now() - prevTime;
    if(input.two){
        delta/=10;
    }
    prevTime = Date.now();
    var parents = [];
    for(var i = 0; i < gameObjects.length; i++){
        var a = gameObjects[i];
        if(a.parent != null){
            if(!parents.includes(a.parent)){
                parents.push(a.parent);
            }
        }
    }
    for(var i = 0; i < nullObjects.length; i++){
        var a = nullObjects[i];
        if(a.parent != null){
            if(!parents.includes(a.parent)){
                parents.push(a.parent);
            }
        }
    }
    for(var i = 0; i < parents.length; i++){
        var a = parents[i];
        a.ogy = a.y;
        a.ogx = a.x;
    }
    for(var i = 0; i < buttons.length; i++){
        var button = buttons[i];
        if(mousePos.x <= (button.x + button.sizeX/2) && mousePos.x >= (button.x - button.sizeX/2) && mousePos.y >= (button.y - button.sizeY/2) && mousePos.y <= (button.y + button.sizeY/2)){
            button.hovered = true;
        }
        else{
            button.hovered = false;
        }
        if(button.hovered && clickInput.mouse1){
            button.clicked = true;
        }
        else{
            button.clicked = false;
        }
    }
    Object.keys(clickInput).forEach(function(key) {
        if(input[key] != clickInput[key]){
            nClick = clickInput[key];
        }   
    });
    nClick = false;
    switch(scene){
        case 1:
            scene1(null);
            break;
        case 2:
            scene2(null);
            break;
        case 3:
            scene3(null);
            break;
        case 4:
            scene4(null);
            break;
        case 5:
            scene5(null);
            break;
        case 6:
            scene6(null);
            break;
        case 7:
            scene7(null);
            break;
        case 8:
            scene8(null);
            break;
        case 9:
            scene9(null);
            break;
    }
    Object.keys(clickInput).forEach(function(key) {
        clickInput[key] = false;     
    });
    draw();
    for(var i = 0; i < parents.length; i++){
        var a = parents[i];
        a.changeX = a.x - a.ogx;
        a.changeY = a.y - a.ogy;
    }
    for(var i = 0; i < parents.length; i++){
        var a = parents[i];
        a.ogy = a.y;
        a.ogx = a.x;
    }
    for(var i = 0; i < gameObjects.length; i++){
        var a = gameObjects[i];
        if(a.parent != null){
            a.x += a.parent.changeX;
            a.y += a.parent.changeY;
        }
    }
    for(var i = 0; i < nullObjects.length; i++){
        var a = nullObjects[i];
        if(a.parent != null){
            a.x += a.parent.changeX;
            a.y += a.parent.changeY;
        }
    }
    for(var i = 0; i < parents.length; i++){
        var a = parents[i];
        a.changeX = a.x - a.ogx;
        a.changeY = a.y - a.ogy;
    }
    for(var i = 0; i < gameObjects.length; i++){
        var a = gameObjects[i];
        if(a.parent != null){
            a.x += a.parent.changeX;
            a.y += a.parent.changeY;
        }
    }
    for(var i = 0; i < nullObjects.length; i++){
        var a = nullObjects[i];
        if(a.parent != null){
            a.x += a.parent.changeX;
            a.y += a.parent.changeY;
        }
    }
    window.requestAnimationFrame(runGame);
}
window.requestAnimationFrame(runGame);
var objectType = null;
function draw(){
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.translate(oDistX * scaleX,oDistY * scaleY);
    for(var i = 0; i < nullObjects.length; i++){
        var tempObject = nullObjects[i];
        drawIt(tempObject);
    }
    for(var i = 0; i < gameObjects.length; i++){
        var tempObject = gameObjects[i];
        drawIt(tempObject);
    }
    for(var i = 0; i < buttons.length; i++){
        var tempObject = buttons[i];
        drawIt(tempObject);
    }
    for(var i = 0; i < ui.length; i++){
        var tempObject = ui[i];
        drawIt(tempObject);
    }
}
function drawIt(tempObject){
    if(tempObject.gravity != null){
        applyGravity(tempObject);
    }
    if(tempObject.rotation != null){
        ctx.translate(tempObject.x * scaleX,tempObject.y * scaleY);
        ctx.rotate(tempObject.rotation);
        ctx.translate(-tempObject.x * scaleX,-tempObject.y * scaleY);
    }
    if(tempObject.color != null){
        ctx.fillStyle = tempObject.color;
        ctx.fillRect((tempObject.x - tempObject.sizeX/2) * scaleX,(tempObject.y - tempObject.sizeY/2) * scaleY,tempObject.sizeX * scaleX,tempObject.sizeY * scaleY);
    }
    if(tempObject.image != null){
        ctx.drawImage(tempObject.image,(tempObject.x - tempObject.sizeX/2) * scaleX,(tempObject.y - tempObject.sizeY/2) * scaleY,tempObject.sizeX * scaleX,tempObject.sizeY * scaleY);
    }
    if(tempObject.rotation != null){
        ctx.translate(tempObject.x * scaleX,tempObject.y * scaleY);
        ctx.rotate(-tempObject.rotation);
        ctx.translate(-tempObject.x * scaleX,-tempObject.y * scaleY);
    }
    if(tempObject.text != null){
        ctx.textAlign = worldTextAlign;
        if(tempObject.id == "toMenu" || tempObject.id == "toRetry"){
            ctx.textAlign = "center";
        }
        ctx.fillStyle = tempObject.textColor;
        ctx.font = (tempObject.textSize * ((scaleX + scaleY)/2)) + "px " + font;
        ctx.fillText(tempObject.text,(tempObject.x + tempObject.textOffsetX) * scaleX,(tempObject.y + tempObject.textOffsetY) * scaleY);
    }
}
function applyGravity(a){
    if(rayscan(a.x,a.y + (a.sizeY / 2) + 1, 4.71, 2) == null){
        a.gravityTimer += delta/1000;
        a.y += a.gravity * a.gravityTimer * delta/10;
    }
    else{
        a.gravityTimer = 0;
    }
    if(a.yForce != 0){
        a.y -= a.yForce * delta/8;
        a.yForce -= delta/10;
        if(a.yForce < 0){
            a.yForce = 0;
        }
    }
}
function loadNew(a){
    var load = a;
    var eachObj = load.split(">");
    for(var i = 0; i < eachObj.length; i++){
        var eachElement = eachObj[i].split("^");
        var type;
        var id;
        var x;
        var y;
        var sX;
        var sY;
        var color = null;
        var image = null;
        var rotation = null;
        for(var j = 0; j < eachElement.length; j++){
            var element = eachElement[j].split("=");
            var elementN = element[0];
            var elementB = element[1];
            if(elementN == "type"){
                type = elementB;
            }
            else if(elementN == "id"){
                id = elementB;
            }
            else if(elementN == "x"){
                x = parseInt(elementB);
            }
            else if(elementN == "y"){
                y = parseInt(elementB);
            }
            else if(elementN == "sx"){
                sX = parseInt(elementB);
            }
            else if(elementN == "sy"){
                sY = parseInt(elementB);
            }
            else if(elementN == "color"){
                color = elementB;
            }
            else if(elementN == "image"){
                image = elementB;
            }
            else if(elementN == "rotation"){
                rotation = parseFloat(elementB);
            }
        }
        var gameO = new GameObject(id,x,y,sX,sY);
        gameO.color = color;
        if(image != null){
            gameO.image = new Image();
            gameO.image.src = image;
        }
        gameO.rotation = rotation
        if(type == "gameObject"){
            gameObjects.push(gameO);
        }
        else if(type == "nullObject"){
            nullObjects.push(gameO);
        }
        else if(type == "button"){
            buttons.push(gameO);
        }
        else{
            ui.push(gameO);
        }
    }
}
function switchScene(a){
    gameObjects = [];
    nullObjects = [];
    buttons = [];
    ui = [];
    scene = a;
    switch(a){
        case 1:
            scene1("start");
            break;
        case 2:
            scene2("start");
            break;
        case 3:
            scene3("start");
            break;
        case 4:
            scene4("start");
            break;
        case 5:
            scene5("start");
            break;
        case 6:
            scene6("start");
            break;
        case 7:
            scene7("start");
            break;
        case 8:
            scene8("start");
            break;
        case 9:
            scene9("start");
            break;
    }
}
var b1 = new Image();
b1.src = "static/images/buttondefault.png"; 
var b2 = new Image();
b2.src = "static/images/buttondefaultpressed.png";
var sp = new Image();
sp.src = "https://loading.io/spinners/dual-ring/lg.dual-ring-loader.gif";
var click = new Audio("https://vocaroo.com/media_command.php?media=s0ZwPJo9nk2d&command=download_mp3");
var tick1 = true;
var sendTime;
var goalScene = 3;
function scene1(a){
    if(a == "start"){
        //start function for scene1
        loadNew("id=back^type=nullObject^x=800^y=450^sx=1600^sy=900^image=static/images/background.png>id=buttonPlay^type=button^x=800^y=450^sx=420^sy=100^image=https://i.ibb.co/LgHbHPs/red-button01.png>id=title^type=ui^x=800^y=250^sx=200^sy=200");
        var titleImg = findObject("title");
        titleImg.image = new Image();
        titleImg.image.src = "static/images/reactfavi.png";
        var b = findObject("buttonPlay");
        b.text = "PLAY";
        b.textColor = "white";
        b.textSize = 60;
        /*
        buttons.push(new GameObject("userProf",1520,70,88,88));
        var up = findObject("userProf");
        up.image = new Image();
        up.image.src = document.getElementById("profPic").src;
        ui.push(new GameObject("userProfFrame",1520,70,100,100));
        var upf = findObject("userProfFrame");
        upf.image = new Image();
        upf.image.src = "static/images/profileframe.png";*/
    }
    else{
        //logic for scene 1
        var b = findObject("buttonPlay");
        if(tick1){
            tick1 = false;
        }
        if(b.hovered){
            b.image = b2;
            b.textOffsetY = 21;
        }
        else{
            b.image = b1;
            b.textOffsetY = 17.5;
        }
        if(b.clicked){
            click.play();
            goalScene = 3;
            switchScene(2);
        }
    }
}
function signInChange(){
    if(scene == 1 || scene == 4){
        findObject("userProf").image.src = document.getElementById("profPic").src;
    }
}
var view0 = new Image();
var view1 = new Image();
var view2 = new Image();
var view3 = new Image();
var view4 = new Image();
var view5 = new Image();
var view6 = new Image();
var view7 = new Image();
var rsBg = new Image();
var totalTime = 0;
var hitsound;
function scene2(a){
    if(a == "start"){
        loadNew("id=back^type=nullObject^x=800^y=450^sx=1600^sy=900^image=static/images/background.png>id=title^type=button^x=800^y=250^sx=600^sy=120");
        totalTime = 0;
        gameObjects.push(new GameObject("loadSprite",800,450,100,100));
        var s = findObject("loadSprite");
        s.image = new Image();
        s.image.src = "static/images/reactfavi.png";
        s.rotation = 0;
        var t = findObject("title");
        t.text = "Loading";
        t.textColor = "white";
        t.textSize = 60;
        if(goalScene == 5){
            view0.src = "static/images/aimgame/view0.png";
            view1.src = "static/images/aimgame/view1.png";
            view2.src = "static/images/aimgame/view2.png";
            view3.src = "static/images/aimgame/view3.png";
            view4.src = "static/images/aimgame/view4.png";
            view5.src = "static/images/aimgame/view5.png";
            view6.src = "static/images/aimgame/view6.png";
            view7.src = "static/images/aimgame/view7.png";
            rsBg.src = "static/images/background.png";
            hitsound = new Audio("static/images/aimgame/hitsound2.mp3");
        }
        else if(goalScene == 3){
            view1.src = "static/images/aimgame/view1.png";
        }
    }
    else{
        totalTime += delta;
        var s = findObject("loadSprite");
        s.rotation += delta/100;
        if(totalTime > 1500){
            switchScene(goalScene);
        }
    }
}
function scene3(a){
    if(a == "start"){
        //game select
        loadNew("id=back^type=nullObject^x=800^y=450^sx=1600^sy=900^image=static/images/background.png");
        ui.push(new GameObject("select",800,100,0,0));
        var select = findObject("select");
        select.text = "Game Select";
        select.textColor = "white";
        select.textSize = 64;
        buttons.push(new GameObject("backb",200,80,300,100));
        var backb = findObject("backb");
        backb.image = b1;
        backb.text = "Back";
        backb.textColor = "white";
        backb.textSize = 32;
        backb.textOffsetY = 8;
        buttons.push(new GameObject("g1b",400,300,530,300));
        var g1b = findObject("g1b");
        g1b.image = b1;
        g1b.text = "AIM";
        g1b.textSize = 48;
        g1b.textOffsetY = 105;
        ui.push(new GameObject("g1i",400,260,350,200));
        findObject("g1i").image = view1;
        //-
        buttons.push(new GameObject("userProf",1520,70,88,88));
        var up = findObject("userProf");
        up.image = new Image();
        up.image.src = document.getElementById("profPic").src;
        ui.push(new GameObject("userProfFrame",1520,70,100,100));
        var upf = findObject("userProfFrame");
        upf.image = new Image();
        upf.image.src = "static/images/profileframe.png";
    }
    else{
        var g1b = findObject("g1b");
        var g1i = findObject("g1i");
        var backb = findObject("backb");
        var up = findObject("userProf");
        var upf = findObject("userProfFrame");
        if(g1b.hovered){
            g1b.image = b2;
            g1b.textOffsetY = 115;
            g1i.y = 270;
        }
        else{
            g1b.image = b1;
            g1b.textOffsetY = 105;
            g1i.y = 260;
        }
        if(g1b.clicked){
            click.play();
            goalScene = 5;
            switchScene(2);
        }
        if(backb.hovered){
            backb.image = b2;
            backb.textOffsetY = 12;
        }
        else{
            backb.image = b1;
            backb.textOffsetY = 8;
        }
        if(backb.clicked){
            click.play();
            switchScene(1);
        }
        if(up.hovered){
            upf.image.src = "static/images/profileframehover.png";
        }
        else{
            upf.image.src = "static/images/profileframe.png";
        }
        if(up.clicked){
            click.play();
            switchScene(4);
        }
    }
}
socket.on("nametaken", function(){
    if(scene == 4){
        var nolog = findObject("nolog");
        nolog.text = "Username Taken";
    }
});
socket.on("namechangesuccess", function(neu){
    if(scene == 4){
        var nolog = findObject("nolog");
        nolog.text = "Username Changed";
        setName(neu);
    }
});
function scene4(a){
    if(a == "start"){
        //profile page
        loadNew("id=back^type=nullObject^x=800^y=450^sx=1600^sy=900^image=static/images/background.png");
        buttons.push(new GameObject("userProf",1520,70,88,88));
        var up = findObject("userProf");
        up.image = new Image();
        up.image.src = document.getElementById("profPic").src;
        ui.push(new GameObject("userProfFrame",1520,70,100,100));
        var upf = findObject("userProfFrame");
        upf.image = new Image();
        upf.image.src = "static/images/profileframe.png";
        //-
        nullObjects.push(new GameObject("unamespot",300,110,0,0));
        var un = findObject("unamespot");
        un.text = "Welcome " + getName();
        un.textSize = 64;
        if(getName().length > 12){
            un.textSize -= getName().length;
        }
        buttons.push(new GameObject("cun",300,250,300,100));
        var cun = findObject("cun");
        cun.image = b1;
        cun.text = "Change Username";
        cun.textColor = "white";
        cun.textSize = 32;
        cun.textOffsetY = 8;
        ui.push(new GameObject("nolog",800,250,0,0));
        var nolog = findObject("nolog");
        nolog.textColor = "white";
        nolog.textSize = 32;
        nolog.textOffsetY = 8;
    }
    else{
        var up = findObject("userProf");
        var upf = findObject("userProfFrame");
        var cun = findObject("cun");
        var un = findObject("unamespot");
        var nolog = findObject("nolog");
        un.text = "Welcome " + getName();
        un.textSize = 64;
        if(getName().length > 12){
            un.textSize -= getName().length;
        }
        if(up.hovered){
            upf.image.src = "static/images/profileframehover.png";
        }
        else{
            upf.image.src = "static/images/profileframe.png";
        }
        if(up.clicked){
            click.play();
            switchScene(3);
        }
        if(cun.hovered){
            cun.image = b2;
            cun.textOffsetY = 12;
        }
        else{
            cun.image = b1;
            cun.textOffsetY = 8;
        }
        if(cun.clicked){
            click.play();
            if(getName() != "Guest"){
                var newu = prompt("New Username:");
                if(newu != "Guest" && newu != getName() && newu != null && newu != ""){
                    socket.emit("namechange",getTrueName(),newu);
                }
            }
            else{
                nolog.text = "Login with Google to change your username";
            }
        }
    }
}
var worldNow = 1;
var countdown = false;
var countdownTimer = 3999;
var gameStarted = false; 
var drawResults = false; 
var gameTimer = 0;
var gameScore = 0; 
var timestring = "0.000";
var beststring = "X.XXX";
var topScoreArray = ["1. Loading - X.XXX","2. Loading - X.XXX","3. Loading - X.XXX","4. Loading - X.XXX","5. Loading - X.XXX","6. Loading - X.XXX","7. Loading - X.XXX","8. Loading - X.XXX","9. Loading - X.XXX","10. Loading - X.XXX"];
function scene5(a){
    //aim game menu
    if(a == "start"){
        loadNew("id=back^type=nullObject^x=800^y=450^sx=1600^sy=900^image=static/images/background.png");
        nullObjects.push(new GameObject("mbg",800,450,1600,900));
        findObject("mbg").image = view0;
        ui.push(new GameObject("howtoplay",800,300,0,0));
        var htp = findObject("howtoplay");
        htp.text = "Click 15 colored blocks as fast as you can!";
        htp.textSize = 64;
        htp.textColor = "white";
        buttons.push(new GameObject("backb",200,80,300,100));
        var backb = findObject("backb");
        backb.image = b1;
        backb.text = "Back";
        backb.textColor = "white";
        backb.textSize = 32;
        backb.textOffsetY = 8;
        buttons.push(new GameObject("start",800,450,300,100));
        var start = findObject("start");
        start.image = b1;
        start.text = "Start";
        start.textColor = "white";
        start.textSize = 32;
        start.textOffsetY = 8;
    }
    else{
        var backb = findObject("backb");
        var start = findObject("start");
        if(backb.hovered){
            backb.image = b2;
            backb.textOffsetY = 12;
        }
        else{
            backb.image = b1;
            backb.textOffsetY = 8;
        }
        if(backb.clicked){
            click.play();
            switchScene(3);
        }
        if(start.hovered){
            start.image = b2;
            start.textOffsetY = 12;
        }
        else{
            start.image = b1;
            start.textOffsetY = 8;
        }
        if(start.clicked){
            click.play();
            countdown = true;
            switchScene(6);
        }
    }
}
socket.on("aimScores", function(names,times){
    if(drawResults){
        findObject("allTime1").text = "1. " + names[0] + " - " + times[0];
        findObject("allTime2").text = "2. " + names[1] + " - " + times[1];
        findObject("allTime3").text = "3. " + names[2] + " - " + times[2];
        findObject("allTime4").text = "4. " + names[3] + " - " + times[3];
        findObject("allTime5").text = "5. " + names[4] + " - " + times[4];
        findObject("allTime6").text = "6. " + names[5] + " - " + times[5];
        findObject("allTime7").text = "7. " + names[6] + " - " + times[6];
        findObject("allTime8").text = "8. " + names[7] + " - " + times[7];
        findObject("allTime9").text = "9. " + names[8] + " - " + times[8];
        findObject("allTime10").text = "10. " + names[9] + " - " + times[9];
    }
});
socket.on("bestScore", function(score){
    beststring = score.toString();
});
function scene6(a){
    //aim game game
    if(a == "start"){
        worldNow = 1;
        countdownTimer = 3999;
        gameStarted = false;
        gameTimer = 0;
        gameScore = 0;
        drawResults = false;
        nullObjects.push(new GameObject("mbg",800,450,1600,900));
        findObject("mbg").image = view0;
        ui.push(new GameObject("countdown",800,450,0,0));
        var cntd = findObject("countdown");
        cntd.textSize = 128;
        cntd.textColor = "white";
        ui.push(new GameObject("score",1500,850,0,0));
        var sc = findObject("score");
        sc.text = gameScore + "/15";
        sc.textSize = 64;
        sc.textColor = "white";
        ui.push(new GameObject("time",100,850,0,0));
        var ti = findObject("time");
        ti.text = "0.000";
        ti.textSize = 64;
        ti.textColor = "white";
        ui.push(new GameObject("resScore",50,150,0,0));
        var rT = findObject("resScore");
        rT.textSize = 64;
        rT.textColor = "white";
        ui.push(new GameObject("bestScore",50,250,0,0));
        var bT = findObject("bestScore");
        bT.textSize = 64;
        bT.textColor = "white";
        ui.push(new GameObject("allTime",850,150,0,0));
        var aT = findObject("allTime");
        aT.textSize = 48;
        aT.textColor = "white";
        //-
        ui.push(new GameObject("allTime1",850,250,0,0));
        var aT1 = findObject("allTime1");
        aT1.textSize = 32;
        aT1.textColor = "white";
        ui.push(new GameObject("allTime2",850,300,0,0));
        var aT2 = findObject("allTime2");
        aT2.textSize = 32;
        aT2.textColor = "white";
        ui.push(new GameObject("allTime3",850,350,0,0));
        var aT3 = findObject("allTime3");
        aT3.textSize = 32;
        aT3.textColor = "white";
        ui.push(new GameObject("allTime4",850,400,0,0));
        var aT4 = findObject("allTime4");
        aT4.textSize = 32;
        aT4.textColor = "white";
        ui.push(new GameObject("allTime5",850,450,0,0));
        var aT5 = findObject("allTime5");
        aT5.textSize = 32;
        aT5.textColor = "white";
        ui.push(new GameObject("allTime6",850,500,0,0));
        var aT6 = findObject("allTime6");
        aT6.textSize = 32;
        aT6.textColor = "white";
        ui.push(new GameObject("allTime7",850,550,0,0));
        var aT7 = findObject("allTime7");
        aT7.textSize = 32;
        aT7.textColor = "white";
        ui.push(new GameObject("allTime8",850,600,0,0));
        var aT8 = findObject("allTime8");
        aT8.textSize = 32;
        aT8.textColor = "white";
        ui.push(new GameObject("allTime9",850,650,0,0));
        var aT9 = findObject("allTime9");
        aT9.textSize = 32;
        aT9.textColor = "white";
        ui.push(new GameObject("allTime10",850,700,0,0));
        var aT10 = findObject("allTime10");
        aT10.textSize = 32;
        aT10.textColor = "white";
        ui.push(new GameObject("rms",750,750,0,0));
        var rmsign = findObject("rms");
        rmsign.textSize = 32;
        rmsign.textColor = "white";
    }
    else{
        var cntd = findObject("countdown");
        var sc = findObject("score");
        var ti = findObject("time");
        var rT = findObject("resScore");
        var bT = findObject("bestScore");
        var aT = findObject("allTime");
        var aT1 = findObject("allTime1");
        var aT2 = findObject("allTime2");
        var aT3 = findObject("allTime3");
        var aT4 = findObject("allTime4");
        var aT5 = findObject("allTime5");
        var aT6 = findObject("allTime6");
        var aT7 = findObject("allTime7");
        var aT8 = findObject("allTime8");
        var aT9 = findObject("allTime9");
        var aT10 = findObject("allTime10");
        var rmsign = findObject("rms");
        if(countdown){
            countdownTimer -= delta;
            cntd.text = countdownTimer.toString().substring(0,1);
            if(countdownTimer < 1000){
                cntd.text = "";
                countdown = false;
                gameStarted = true;
                randomizeWorld();
            }
        }
        if(gameStarted){
            gameTimer += delta;
            timestring = (gameTimer/1000).toString().substring(0,5);
            while(true){
                if(timestring.length <= 4){
                    timestring += "0";
                }
                else{
                    break;
                }
            }
            ti.text = timestring;
            sc.text = gameScore + "/15";
            if(buttons[0].clicked){
                hitsound.play();
                gameScore++;
                randomizeWorld();
                if(gameScore == 15){
                    gameStarted = false;
                    drawResults = true;
                    aT1.text = topScoreArray[0];
                    aT2.text = topScoreArray[1];
                    aT3.text = topScoreArray[2];
                    aT4.text = topScoreArray[3];
                    aT5.text = topScoreArray[4];
                    aT6.text = topScoreArray[5];
                    aT7.text = topScoreArray[6];
                    aT8.text = topScoreArray[7];
                    aT9.text = topScoreArray[8];
                    aT10.text = topScoreArray[9];
                    socket.emit("aimScoreSubmit",getName(),timestring,getTrueName());
                    buttons.push(new GameObject("toMenu",200,800,300,100));
                    var tomenu = findObject("toMenu");
                    tomenu.textColor = "white";
                    tomenu.textSize = 42;
                    tomenu.textOffsetY = 8;
                    buttons.push(new GameObject("toRetry",1400,800,300,100));
                    var toretry = findObject("toRetry");
                    toretry.textColor = "white";
                    toretry.textSize = 42;
                    toretry.textOffsetY = 8;
                    findObject("mbg").image = rsBg;
                }
            }
        }
        if(drawResults){
            worldTextAlign = "left";
            sc.text = "";
            ti.text = "";
            rT.text = "Your Time: " + timestring;
            if(getName() != "Guest"){
                bT.text = "Your Best: " + beststring;
            }
            else{
                bT.textSize = 32;
                bT.text = "Login with Google to track your best time!";
            }
            aT.text = "All Time Best Scores:";
            var tomenu = findObject("toMenu");
            var toretry = findObject("toRetry");
            tomenu.text = "Main Menu";
            if(tomenu.hovered){
                tomenu.image = b2;
                tomenu.textOffsetY = 12;
            }
            else{
                tomenu.image = b1;
                tomenu.textOffsetY = 8;
            }
            if(tomenu.clicked){
                worldTextAlign = "center";
                goalScene = 1;
                click.play();
                switchScene(2);
            }
            toretry.text = "Retry";
            if(toretry.hovered){
                toretry.image = b2;
                toretry.textOffsetY = 12;
            }
            else{
                toretry.image = b1;
                toretry.textOffsetY = 8;
            }
            if(toretry.clicked){
                worldTextAlign = "center";
                countdown = true;
                click.play();
                switchScene(6);
            }
            if(getName() == "Guest"){
                rmsign.text = "Login with Google to sumbit scores!";
            }
            else{
                rmsign.text = "";
            }
        }
    }
}
function randomizeWorld(){
    var random;
    while(true){
        random = Math.floor(Math.random() * 7) + 1;
        if(random != worldNow){
            break;
        }
    }
    var mbg = findObject("mbg");
    buttons = [];
    switch(random){
        case 1:
            loadNew("id=button^type=button^x=1407^y=512^sx=89^sy=50");
            mbg.image = view1;
            break;
        case 2:
            loadNew("id=button^type=button^x=1098^y=480^sx=32^sy=25");
            mbg.image = view2;
            break;
        case 3:
            loadNew("id=button^type=button^x=911^y=478^sx=25^sy=24");
            mbg.image = view3;
            break;
        case 4:
            loadNew("id=button^type=button^x=187^y=501^sx=73^sy=41");
            mbg.image = view4;
            break;
        case 5:
            loadNew("id=button^type=button^x=281^y=532^sx=109^sy=68");
            mbg.image = view5;
            break;
        case 6:
            loadNew("id=button^type=button^x=887^y=565^sx=47^sy=48");
            mbg.image = view6;
            break;
        case 7:
            loadNew("id=button^type=button^x=623^y=488^sx=37^sy=31");
            mbg.image = view7;
            break;
    }
    worldNow = random;
}
function scene7(a){
    if(a == "start"){

    }
    else{
        
    }
}
function scene8(a){
    if(a == "start"){

    }
    else{
        
    }
}
function scene9(a){
    if(a == "start"){

    }
    else{
        
    }
}
//game functions go down here




