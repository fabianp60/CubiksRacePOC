function botonJuego(x, y, ancho, textoBoton) {
  this.x = x;
  this.y = y;
  this.ancho = ancho;
  this.alto = 50;
  this.over = false;
  this.tamanofuente = 30;
  this.x_texto = Math.floor( x + (this.ancho/2) - (((this.tamanofuente*textoBoton.length)/1.8)/2) + (this.tamanofuente*0.13) );
  this.y_texto = Math.floor( y + (this.alto/2) - (this.tamanofuente/2) + (this.tamanofuente*0.7) );
  this.update = function(cx, cy) {
    if(cx >= this.x && cx <= this.x + this.ancho && cy >= this.y && cy <= this.y + this.alto) {
      this.over = true;
    } else {
      this.over = false;
    }
  }
  this.updateGraphics = function(context) {
    if(this.over) {
      dibujarRectangulo(context,"#ff8080",x,y,this.ancho,this.alto,true);
      dibujarTexto(context, "white", this.tamanofuente, textoBoton, this.x_texto, this.y_texto, false);
    } else {
      dibujarRectangulo(context,"red",x,y,this.ancho,this.alto,true);
      dibujarTexto(context, "white", this.tamanofuente, textoBoton, this.x_texto, this.y_texto, false);
    }
  }
}

var menuScene = {
  mousex: 0,
  mousey: 0,
  clicIzqPulsado: false,
  start: function(canvas) {
    this.canvas = canvas;
    this.botonJuegoAleatorio = new botonJuego(30,200,300,"Juego aleatorio");
    this.botonVersusAmigo = new botonJuego(30,300,300,"Versus amigo");
    this.canvas.addEventListener("mousedown", function(evt){
      //iniciar
      menuScene.clicIzqPulsado = (evt.buttons == 1);
      menuScene.mousex = evt.clientX;
      menuScene.mousey = evt.clientY;
    });
    this.canvas.addEventListener("touchstart", function(evt){
      menuScene.clicIzqPulsado = true;
      menuScene.mousex = evt.touches[0].clientX;
      menuScene.mousey = evt.touches[0].clientY;
    });
    this.canvas.addEventListener("mousemove", function(evt){
      //dibujar
      menuScene.clicIzqPulsado = (evt.buttons == 1);
      menuScene.mousex = evt.clientX;
      menuScene.mousey = evt.clientY;
    });
    this.canvas.addEventListener("touchmove", function(evt){
      menuScene.clicIzqPulsado = true;
      menuScene.mousex = evt.touches[0].clientX;
      menuScene.mousey = evt.touches[0].clientY;
    });
    this.canvas.addEventListener("mouseup", function(evt){
      //terminar
      menuScene.mousex = evt.clientX;
      menuScene.mousey = evt.clientY;
      menuScene.clicIzqPulsado = (evt.buttons == 1);
    });
    this.canvas.addEventListener("touchend", function(evt){
      menuScene.mousex = evt.changedTouches[0].clientX;
      menuScene.mousey = evt.changedTouches[0].clientY;
      menuScene.clicIzqPulsado = false;
    });
  },
  update: function() {
    this.botonJuegoAleatorio.update(this.mousex, this.mousey);
    this.botonVersusAmigo.update(this.mousex, this.mousey);

    if(this.clicIzqPulsado) {
        if(this.botonJuegoAleatorio.over) return 1;
        if(this.botonVersusAmigo.over) return 2;
    }
    return 0;
  },
  updateGameGraphics: function(context) {
    // fondo menu
    dibujarRectangulo(context,"#0099cc",0,0,360,640,true);
    dibujarTexto(context, "white", 40, "Cubik's Race", 55, 100, true);
    // boton 1
    this.botonJuegoAleatorio.updateGraphics(context);
    // boton 2
    this.botonVersusAmigo.updateGraphics(context);
    // version del juego
    dibujarTexto(context, "white", 14, "Versión  1.0", 270, 630, false);
  }
}
