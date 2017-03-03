window.onload = function(){
var cell = document.getElementsByClassName('cell');
var startBtn = document.getElementById('startBtn');
var resetBtn = document.getElementById('resetBtn');
var powerBtn = document.getElementById('powerBtn');
var strictBtn = document.getElementById('strictBtn');
var powerLed = document.getElementById('powerLed');
var strictLed = document.getElementById('strictLed'); 
var scoreScreen = document.getElementById('scoreScreen');
var cpuSeq = [Math.round(Math.random()*3)];
var playerSeq = [];
var index = 0;
var count = 0; 
var num;
var LAPS = 800;
var strictMode = false;
var check;
var powerOn = false;
var interval;
var winInterval;
var winState = false;
//////////////////////////////////
//CPU sequence animation functions
//////////////////////////////////
function animate(){
    var i = 0;
    interval = setInterval(function(){
        light(i);
        playSound(cpuSeq[i]);
        i++;
        if( i == cpuSeq.length) clearInterval(interval);
    },LAPS);
}
function light(i){
    var id = cpuSeq[i];
    cell[id].style.opacity="1";
    setTimeout(function(){
        cell[id].style.opacity="0.4";
    },Math.round(LAPS/2));
}
function cpuRound(){
    waitForCpu();
    animate();
}
function waitForCpu(){
    for(var i = 0; i < cell.length; i++){
        cell[i].classList.add('unclickable');
    }
    setTimeout(function(){
        for(var i = 0; i < cell.length; i++){
            cell[i].classList.remove('unclickable');
        }
    },LAPS*cpuSeq.length + 400);
}
///////////////////////////////////////
//Player sequence animations functions
///////////////////////////////////////
function playSound(id){
    var sound = document.getElementById("sound"+id);
    sound.currentTime = 0;
    sound.play();
}
function lightOn(){
    id = Number(this.id);
    cell[id].style.opacity="1";
    playSound(id);
}
function lightOff(){
    id = Number(this.id);
    cell[id].style.opacity="0.4";
}

////////////////////////////////////////
//Game functions 
///////////////////////////////////////
function resetGame(){
    clearInterval(interval);
    clearInterval(winInterval);
    cpuSeq = [];
    num = Math.round(Math.random()*3);
    cpuSeq.push(num);
    playerSeq = [];
    index = 0;
    count = 0;
    scoreScreen.innerHTML = count;
    strictMode = false;
    winState = false;
    startBtn.classList.remove('hide');
    resetBtn.classList.add('hide');
}
function winMessage(){
    scoreScreen.innerHTML = "EXELLENT";
    winInterval = setInterval(function(){
        scoreScreen.style.color = "white";
        setTimeout(function(){
            scoreScreen.style.color = "black";
        },200)
    },400)
}
function win(){
    if(count == 20){
        winState = true; 
        winMessage();
    }
}
function error(){
    scoreScreen.style.backgroundColor="red";
    setTimeout(function(){
        scoreScreen.style.backgroundColor="white";
    },200)
}
function strictPlay(){
    if(playerSeq[index] != cpuSeq[index] && !winState){
        cpuSeq = [];
        num = Math.round(Math.random()*3);
        cpuSeq.push(num);
        playerSeq = [];
        count = 0;
        scoreScreen.innerHTML = count;
        index = 0;
        error();
        playerSeq = [];
        cpuRound();
    }else{
        index ++;
        check = true;
    } 
    if(index == cpuSeq.length && check){
        count++;
        scoreScreen.innerHTML = count;
        win();
        if(!winState){
        playerSeq = [];
        index = 0;
        var id = Math.round(Math.random()*3);
        cpuSeq.push(id);
        cpuRound();
        waitForCpu();
        }
    }
}
function nonStrictPlay(){
    if(playerSeq[index] != cpuSeq[index] && !winState){
        index = 0;
        error();
        playerSeq = [];
        cpuRound();
    }else{
        index ++;
        check = true;
    } 
    if(index == cpuSeq.length && check){
        count++;
        scoreScreen.innerHTML = count;
        win();
        if(!winState){
        playerSeq = [];
        index = 0;
        var id = Math.round(Math.random()*3);
        cpuSeq.push(id);
        cpuRound();
        waitForCpu();
        }
    }
}
function play(){
    if(playerSeq[index] != undefined){
        check = false;
        if(!strictMode){
            nonStrictPlay();
        }
        if(strictMode){
            strictPlay();
        }
    }
}
function activateBoard(){
    for(var j = 0; j < cell.length; j++){
        cell[j].addEventListener('mousedown', lightOn);
        cell[j].addEventListener('mouseup', lightOff);
    }
}
function deactivateBoard(){
    for(var j = 0; j < cell.length; j++){
        cell[j].removeEventListener('mousedown', lightOn);
        cell[j].removeEventListener('mouseup', lightOff);
    }   
}
function startGame(){
    cpuRound();
    startBtn.classList.add('hide');
    resetBtn.classList.remove('hide');
}
function playerRound(){
    if(startBtn.classList.contains('hide')){
        playerSeq.push(Number(this.id));
    } 
    if(playerSeq[index] != undefined){
        play();
    }
}
function strictModeSwitch(){
    strictMode = !strictMode;
    if(strictMode){
        strictLed.classList.remove('led-red');
        strictLed.classList.add('led-green');
    }else{
        strictLed.classList.add('led-red');
        strictLed.classList.remove('led-green');
    }
}
////////////////////////////
//Execution
///////////////////////////
powerBtn.addEventListener('click', function(e){
    powerOn = !powerOn;
    if(startBtn.classList.contains('hide')){
        startBtn.classList.remove('hide');
        resetBtn.classList.add('hide');
    }
    if(powerOn){
        powerLed.classList.remove('led-red');
        powerLed.classList.add('led-green');
        activateBoard();
        startBtn.addEventListener('click',startGame);
        resetBtn.addEventListener('click', resetGame);
        strictBtn.addEventListener('click', strictModeSwitch);
        for(var i = 0; i< cell.length; i++){
            cell[i].addEventListener('click',playerRound);
        }
        scoreScreen.innerHTML = count;
    }else{
        powerLed.classList.add('led-red');
        powerLed.classList.remove('led-green');
        deactivateBoard();
        startBtn.removeEventListener('click',startGame);
        resetBtn.removeEventListener('click', resetGame);
        strictBtn.removeEventListener('click', strictModeSwitch);
        for(var i = 0; i< cell.length; i++){
            cell[i].removeEventListener('click',playerRound);
        }
        if(strictLed.classList.contains('led-green')){
            strictLed.classList.add('led-red');
            strictLed.classList.remove('led-green');
        }
        resetGame();
        scoreScreen.innerHTML = ""; 
    }
})
}
