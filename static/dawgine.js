//image refrences
//---------------
var gameObjects = []; //gameobjects are seen by rayscans
var nullObjects = []; //null objects are not seen by rayscans
var ui = [];
var buttons = []; //clickable buttons
//gameObject
//syntax:
//new var newGO = GameObject(id,x,y,posX,posY,sizeX,sizeY);
//font:
var font = "Iceberg";
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
        this.textColor = "black";
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
setInterval(function(){
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
},1000/10); //refreshes canvas size a set times per second - the "10" is changeable to whatever tickrate works the best
//canvas fit functions
function fullScreenCanvas(){
    canvas.width = window.innerWidth;
    canvas.height =  window.innerHeight;
}
function aspectRatioFullScreenCanvas(){
    var heightW = window.innerHeight;
    var widthW = window.innerWidth;
    var aspectR = virtualWidth / virtualHeight;
    if(aspectR > widthW/heightW){
        canvas.width = widthW;
        canvas.height = widthW / aspectR;
    }
    else{
        canvas.height = heightW;
        canvas.width = heightW * aspectR;
    }
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
var scene = 1;
function start(){
    scene = 1;
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
function draw(){
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.translate(oDistX * scaleX,oDistY * scaleY);
    for(var i = 0; i < nullObjects.length; i++){
        var tempObject = nullObjects[i];
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
            ctx.textAlign = "center";
            ctx.fillStyle = tempObject.textColor;
            ctx.font = (tempObject.textSize * ((scaleX + scaleY)/2)) + "px " + font;
            ctx.fillText(tempObject.text,(tempObject.x + tempObject.textOffsetX) * scaleX,(tempObject.y + tempObject.textOffsetY) * scaleY);
        }
    }
    for(var i = 0; i < gameObjects.length; i++){
        var tempObject = gameObjects[i];
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
            ctx.textAlign = "center";
            ctx.fillStyle = tempObject.textColor;
            ctx.font = (tempObject.textSize * ((scaleX + scaleY)/2)) + "px " + font;
            ctx.fillText(tempObject.text,(tempObject.x + tempObject.textOffsetX) * scaleX,(tempObject.y + tempObject.textOffsetY) * scaleY);
        }
    }
    for(var i = 0; i < buttons.length; i++){
        var tempObject = buttons[i];
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
            ctx.textAlign = "center";
            ctx.fillStyle = tempObject.textColor;
            ctx.font = (tempObject.textSize * ((scaleX + scaleY)/2)) + "px " + font;
            ctx.fillText(tempObject.text,(tempObject.x + tempObject.textOffsetX) * scaleX,(tempObject.y + tempObject.textOffsetY) * scaleY);
        }
    }
    for(var i = 0; i < ui.length; i++){
        var tempObject = ui[i];
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
            ctx.textAlign = "center";
            ctx.fillStyle = tempObject.textColor;
            ctx.font = (tempObject.textSize * ((scaleX + scaleY)/2)) + "px " + font;
            ctx.fillText(tempObject.text,(tempObject.x + tempObject.textOffsetX) * scaleX,(tempObject.y + tempObject.textOffsetY) * scaleY);
        }
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
b1.src = "https://i.ibb.co/LgHbHPs/red-button01.png"; 
var b2 = new Image();
b2.src = "https://i.ibb.co/rkFB0RQ/red-button02.png";
var sp = new Image();
sp.src = "https://loading.io/spinners/dual-ring/lg.dual-ring-loader.gif";
var click = new Audio("https://vocaroo.com/media_command.php?media=s0ZwPJo9nk2d&command=download_mp3");
var bgM = new Audio("https://vocaroo.com/media_command.php?media=s0u1JqfBdkbA&command=download_mp3");
//bgM.autoplay = true;
var tick1 = true;
function scene1(a){
    if(a == "start"){
        //start function for scene1
        loadNew("id=back^type=nullObject^x=800^y=450^sx=1600^sy=900^image=https://i.ibb.co/q7phQLH/backgnew.png>id=buttonPlay^type=button^x=800^y=450^sx=420^sy=100^image=https://i.ibb.co/LgHbHPs/red-button01.png>id=buttonPlayCopy0^type=button^x=800^y=650^sx=340^sy=100^image=https://i.ibb.co/LgHbHPs/red-button01.png>id=user^type=button^x=1520^y=70^sx=100^sy=100^image=https://i.ibb.co/2cn0dyf/red-panel.png>id=title^type=button^x=800^y=250^sx=600^sy=120");
        var b = findObject("buttonPlay");
        b.text = "PLAY";
        b.textColor = "black";
        b.textSize = 60;
        b.textOffsetY = 14;
    }
    else{
        //logic for scene 1
        var b = findObject("buttonPlay");
        if(tick1){
            bgM.play();
            tick1 = false;
        }
        if(b.hovered){
            b.image = b2;
        }
        else{
            b.image = b1;
        }
        if(b.clicked){
            switchScene(2);
            click.play();
        }
    }
}
var totalTime = 0;
function scene2(a){
    if(a == "start"){
        loadNew("id=back^type=nullObject^x=800^y=450^sx=1600^sy=900^image=https://i.ibb.co/q7phQLH/backgnew.png>id=title^type=button^x=800^y=250^sx=600^sy=120");
        gameObjects.push(new GameObject("loadSprite",800,450,200,200));
        var s = findObject("loadSprite");
        s.image = sp;
        s.rotation = 0;
        var t = findObject("title");
        t.text = "Loading";
        t.textColor = "black";
        t.textSize = 60;
    }
    else{
        totalTime += delta;
        var s = findObject("loadSprite");
        s.rotation += delta/100;
        if(totalTime > 2000){
            switchScene(3);
        }
    }
}
function scene3(a){
    if(a == "start"){
        loadNew("id=back^type=nullObject^x=800^y=450^sx=1600^sy=900^image=https://i.ibb.co/q7phQLH/backgnew.png");
    }
    else{
        
    }
}
function scene4(a){
    if(a == "start"){

    }
    else{
        
    }
}
function scene5(a){
    if(a == "start"){

    }
    else{
        
    }
}
function scene6(a){
    if(a == "start"){

    }
    else{
        
    }
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




