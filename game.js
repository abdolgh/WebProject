// JAVASCRIPT CODE //
const cvs = document.getElementById('canvas'); //selecting the canvas
const ctx = cvs.getContext("2d");

// here we create the game frame
let frame = 0;
const degree = Math.PI/180;
//here we downlaod our sprite image
const sprite = new Image();
sprite.src = "img/sprite.png";

//adding the sound effects
const scores = new Audio();
scores.src = "audio/sfx_point.wav";

const flaps = new Audio();
flaps.src = "audio/sfx_flap.wav";

const hit = new Audio();
hit.src = "audio/sfx_hit.wav";

const swoosh = new Audio();
swoosh.src = "audio/sfx_swooshing.wav";

const die = new Audio();
die.src = "audio/sfx_die.wav";

//here is the game state, which enables us to move from get ready to play the
//game then game over
const state = {
  current : 0,
  gr : 0,
  game : 1,
  over : 2
}
//here we control the game using the click addEventListener + the switch
cvs.addEventListener("click", function(evt){
  switch(state.current){
    case state.gr : state.current = state.game;
    swoosh.play();
    break;
    case state.game : bird.flap();
    flaps.play();
    break;
    case state.over :
    // so we can click on the start button anywhere in the page
    let rect = cvs.getBoundingClientRect();
    let clickX = evt.clientX - rect.left;
    let clickY = evt.clientY - rect.top;
    if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >=
    startBtn.y && clickY <= startBtn.y + startBtn.h){
      // we reset the game when we press the start button
      pipes.reset();
      bird.speedReset();
      score.reset();
      state.current = state.gr;

    }

    break;
  }
});

//this is where we create our background
const bg ={
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,

  draw : function () { //to specify the location of our sprite from source to destination
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  }
}
// here we add the ground of the game
const fg ={
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,
  dx : 2,
  draw : function () { //to specify the location of our sprite from source to destination
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  },
  update : function () {
    if(state.current == state.game){
      this.x = (this.x - this.dx) % (this.w/2);
    }
  }
}

// and here is our bird
const bird ={
  animation : [
    {sX:276 , sY:112 },
    {sX:276 , sY:139 },
    {sX:276 , sY:164 },
    {sX:276 , sY:139 }
  ],

  x: 50,
  y: 150,
  w: 34,
  h: 26,
  frame : 0,
  fall : 0.24,
  jump : 4.6,
  speed: 0,
  rotation : 0,
  radius : 12,

  draw : function () {
    let bird = this.animation[this.frame];

    ctx.save(); // save the state of the canvas
    ctx.translate( this.x ,this.y );
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h,- this.w/2,
       - this.h/2, this.w, this.h);

       ctx.restore();
  },
  flap : function(){
    this.speed = - this.jump;
  },
  update : function () {
    //creating the period to make the bird flap slowly if its 10
  this.period = state.current == state.gr ? 10 : 5;
  //then increment the frame each period by 1
  this.frame += frame % this.period == 0 ? 1 : 0;
  // the frame goes from 0 to 4 cause the animation of the bird
  this.frame = this.frame % this.animation.length;

  if(state.current == state.gr){
    this.y = 150; // here we reset the position of the bird
    this.rotation = 0 * degree;
  }else{
    this.speed += this.fall;
    this.y += this.speed;
//to make the bird lose when hitting the ground !
    if(this.y + this.h/2 >= cvs.height - fg.h){
      this.y = cvs.height - fg.h - this.h/2;
      if(state.current == state.game){
        state.current = state.over;
        die.play();
      }
    }
    //if the speed > jump then the bird is falling down
    if(this.speed >= this.jump){
      this.rotation = 90 * degree;
      this.frame = 1;
    }else{
      this.rotation = -25 * degree;
    }
  }
},
  speedReset : function () {
    this.speed = 0;
  }
}
// here is the Get Ready to start the game
const gr = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: cvs.width/2 - 173/2,
  y: 80,

  draw : function () { //to specify the location of our sprite from source to destination
    if(state.current == state.gr){
     ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
   }
  }
}
//the game over message
const go = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: cvs.width/2 - 225/2,
  y: 90,

  draw : function () { //to specify the location of our sprite from source to destination
    if(state.current == state.over){
     ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
   }
 }
}
// here we create the pipes
const pipes = {
  position :[],

  top :{
    sX: 553,
    sY:0
  },
  bottom :{
    sX: 502,
    sY: 0
  },
  w : 53,
  h : 400,
  gap : 88,
  maxYpos: -150,
  dx : 2,

  draw : function () {
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];
      let topYpos = p.y;
      let bottomYpos = p.y + this.h + this.gap;
// this is the top pipe
         ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x,
           topYpos, this.w, this.h);
           // this is the bottom pipe
                    ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x,
                      bottomYpos, this.w, this.h);
    }
  },
  //we keep updating the pipes every 110 frames
  update : function () {
    if (state.current !== state.game) return;
    if (frame % 110 ==0){
      this.position.push({
        x : cvs.width,
        y : this.maxYpos * (Math.random() + 1)
      });
    }
    for(let i = 0; i < this.position.length; i++){
      let p = this.position[i];

      let bottomYpos = p.y + this.h + this.gap;
      // here we make the collide with the pipes
      if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
      bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
        state.current = state.over;
        hit.play();
      }

      if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
      bird.y + bird.radius > bottomYpos && bird.y - bird.radius < bottomYpos + this.h){
        state.current = state.over;
          hit.play();
      }
// moving the pipes to the left
      p.x -= this.dx;
      //when the pipe goes beyond the canvas
      if(p.x + this.w <= 0){
        this.position.shift();
        // to increase the score
        score.value += 1;
        scores.play();
        score.best = Math.max(score.value,score.best);
        localStorage.setItem("best",score.best);
      }
    }
  },
  reset : function () {
    this.position =[];
  }
}

//here we create the score
const score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,

  draw: function () {
    ctx.fillStyle ="#FFF";
    ctx.strokeStyle ="#000";
    if(state.current == state.game){
      ctx.font = "35px Teko";
      ctx.lineWidth = 2;
      ctx.fillText(this.value, cvs.width/2, 50);
      ctx.strokeText(this.value, cvs.width/2, 50);

    }else if(state.current == state.over){
      ctx.font = "25px Teko";
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);
      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  },
  reset: function () {
    this.value = 0;
  }
}
// the start button function
const startBtn = {
  x: 120,
  y: 263,
  w: 83,
  h: 29
}
//the draw function
function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0,0,cvs.width,cvs.height);

  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  gr.draw();
  go.draw();
  score.draw();

}

//the update function, to keep updating the game
function update() {
  bird.update();
  fg.update();
  pipes.update();
}

//and the loop function, where we call the draw and the update function
function loop() {
  draw();
  update();
  frame++;
  requestAnimationFrame(loop);
}
loop();
