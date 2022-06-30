var versusAmigoScene = {
  mousex: 0,
  mousey: 0,
  clicIzqPulsado: false,
  start: function(canvas) {
    this.canvas = canvas;
  },
  update: function() {
    if(this.clicIzqPulsado) {
      console.log("pulsado");
    }
    return 2;
  },
  updateGameGraphics: function(context) {
    // fondo menu
    dibujarRectangulo(context,"#0099cc",0,0,360,640,true);
    dibujarTexto(context, "white", 40, "Versus Amigo", 35, 100, true);
    // version del juego
    dibujarTexto(context, "white", 14, "Versión  1.0", 270, 630, false);
  }
}
