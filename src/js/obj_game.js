// variables globales
var lienzo,w_lienzo,p_ctx = {w:0,h:0},ctx;
var rec;
var dino;
var START_GAME;

var o_captus = []; // array para los captus
var o_ptero = []; // array para los pterodactilos
var sound = new Audio("res/sound/naruto_mejorado.mp3"); // OBTENCION DE AUDIO

var puntaje_total = 0; // puntaje obtenido
var global_time = 0; //tiempo global por cada impresion de imagenes
var collision_enable = true; // enciende las coliciones [false/true]
var sound_enable = true; //enciende el sonido [false/true]
var FPS = 1000/50;

// keys
var KEYS = {UP: 87, RIGHT: 68, DOWN: 83, LEFT: 65}; // ID de las teclas
var A_KEYS = {UP: false, RIGHT: false, DOWN: false, LEFT: false}; // Encendido de las teclas [false/true]


// declaracion de clases
var game_objet = class game_objet {
  constructor(ctx,settings){
    this.size = {w: 0, h: 0}
    this.position = {x: 0, y: 0}
    this.color = "black";
    this.ctx = ctx;
    this.col = false;
    if (typeof settings !== "undefined") {
      this.ctx_update(settings);
    }

  }

  ctx_update(settings){
    if(typeof settings.w !== "undefined") this.size.w = settings.w;
    if(typeof settings.h !== "undefined") this.size.h = settings.h;
    if(typeof settings.x !== "undefined") this.position.x = settings.x;
    if(typeof settings.y !== "undefined") this.position.y = settings.y;
    if(typeof settings.color !== "undefined") this.color = settings.color;
    return this;
  }

  colision(another){
    this.col = ((another.position.y >= this.position.y && another.position.y <= this.position.y + this.size.h)                             && (another.position.x >= this.position.x && another.position.x <= this.position.x + this.size.w)) ||
      ((another.position.y >= this.position.y && another.position.y <= this.position.y + this.size.h)                             && (another.position.x + another.size.w >= this.position.x && another.position.x + another.size.w <= this.position.x + this.size.w)) ||
      ((another.position.y + another.size.h >= this.position.y && another.position.y + another.size.h <= this.position.y + this.size.h) && (another.position.x + another.size.w >= this.position.x && another.position.x + another.size.w <= this.position.x + this.size.w)) ||
      ((another.position.y + another.size.h >= this.position.y && another.position.y + another.size.h <= this.position.y + this.size.h) && (another.position.x >= this.position.x && another.position.x <= this.position.x + this.size.w))
    ;
    return this.col;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.position.x,this.position.y,this.size.w,this.size.h);
    return this;
  }
}
class c_dino extends game_objet{

  constructor(ctx){
    super(ctx,{color: "yellow"});
    var l_texture_walk = ['res/img/DINO/DINO_01.png','res/img/DINO/DINO_01.1.png','res/img/DINO/DINO_02.png','res/img/DINO/DINO_02.1.png','res/img/DINO/DINO_03.png','res/img/DINO/DINO_03.1.png','res/img/DINO/DINO_04.png'];
    var l_texture_jump = ['res/img/DINO/DINO_JUMP_01.png'];
    this.texture_walk = [];
    this.texture_jump = [];

    this.ips = 2; //IMAGENES POR SEGUNDO
    this.jump = false; // SALTO DEL DINOSAURIO
    this.default_fly = 22; //VELOCIDAD DE ELEVACION ESTATICA
    this.fly_d = this.default_fly; // VELOCIDAD DE ELEVACION DINAMICA
    this.speed_fall = 0.8; // VELOCIDAD DE SUBIDA Y CAIDA

    for (var i = 0; i < l_texture_walk.length; i++) {
      var image = new Image();
      image.src = l_texture_walk[i];
      this.texture_walk.push(image);
    }

    for (var i = 0; i < l_texture_jump.length; i++) {
      var image = new Image();
      image.src = l_texture_jump[i];
      this.texture_jump.push(image);
    }

    this.size.h = 80;
    this.size.w = 85;
  }

  jump_dino(){
    if (this.jump === false) {
      if (A_KEYS.UP) this.jump = true;
    }
    else {
      dino.position.y -= this.fly_d;
      this.fly_d -= this.speed_fall; // disminucion del vuelo del dinosaurio

      // calculo de la posicion maxima de bajada del dinosaurio
      if (dino.position.y >= p_ctx.h - rec.size.h - dino.size.h ) {
        this.jump = false;
        dino.position.y = p_ctx.h - rec.size.h - dino.size.h
        this.fly_d = this.default_fly;
      }
    }
  }

  draw() {
    var texture = this.jump ? this.texture_jump : this.texture_walk;
    var text3 = (global_time%(texture.length*this.ips));
    text3 = parseInt(text3/this.ips);
    this.ctx.drawImage(texture[text3],this.position.x,this.position.y,this.size.w,this.size.h);
    return this;
  }
}
class c_captus{
  constructor(ctx,settings) {
    this.size = [60,70,90,40];
    this.captus = [];
    this.x = settings.x;
    var total_captus = parseInt(Math.random() * 3) + 1;
    for (var i = 0; i < total_captus; i++) {
      var h_captus = this.size[parseInt(Math.random() * 4)];

      this.captus.push(new game_objet(ctx,{color: 'green', x: settings.x + ((i+1) * 20), y: settings.floor - h_captus, w: 20, h: h_captus}));
    }
  }
  colision(another){
    for (var i = 0; i < this.captus.length; i++) {
      //console.log(another.colision(this.captus[i]));
      if (this.captus[i].colision(another) || another.colision(this.captus[i])) return true;
    }
    return false;
  }
  draw(){
    for (var i = 0; i < this.captus.length; i++) {this.captus[i].draw();}
    return this;
  }

  add_x(add){
    for (var i = 0; i < this.captus.length; i++) this.captus[i].position.x += add;
    this.x += add;
  }

}
class c_pterodactil {
  constructor(ctx,settings) {
    this.pterodactils = null;
    this.x = settings.x;
    var random_h = parseInt(Math.random() * 4);
    this.pterodactil = new game_objet(ctx,{color: 'blue', x: settings.x, y: settings.floor - (random_h % 2 == 0 ? 60 : 120), w: 80, h: 20});
  }
  colision(another){
    return (this.pterodactil.colision(another) || another.colision(this.pterodactil));
  }
  draw(){
    this.pterodactil.draw();
    return this;
  }

  add_x(add){
    this.pterodactil.position.x += add;
    this.x += add;
  }
}
