var miAreaDeJuego = {
    canvas : document.getElementById("canvasJuego"),
    start : function() {
      this.loadAssets();
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;;
      this.context = this.canvas.getContext("2d");
      this.actualScene = 0;
      this.scenes = [menuScene, juegoAleatorioScene, versusAmigoScene];
      this.setScene(this.actualScene);
      this.interval = setInterval(this.updateGameGraphics, 20);
    },
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    loadAssets : function() {
      // cargar imagenes sonidos etc
    },
    setScene: function(sceneId) {
      this.actualScene = sceneId;
      this.scenes[miAreaDeJuego.actualScene].start(this.canvas);
    },
    update: function() {
      //actualizar la logica del juego
      var nuevaEscena = miAreaDeJuego.scenes[miAreaDeJuego.actualScene].update();
      if(nuevaEscena != this.actualScene) {
        this.setScene(nuevaEscena);
      }
    },
    updateGameGraphics: function() {
      miAreaDeJuego.clear();
      miAreaDeJuego.update();
      miAreaDeJuego.scenes[miAreaDeJuego.actualScene].updateGameGraphics(miAreaDeJuego.context,miAreaDeJuego.canvas);
    }
}

function startGame() {
    miAreaDeJuego.start();
}


startGame();
