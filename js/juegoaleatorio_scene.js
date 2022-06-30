var coloresFichas = { "Amarillo" : "yellow", "Blanco" : "white", "Rojo" : "red", "Naranja" : "orange", "Azul" : "blue", "Verde" : "green", "Ninguno" : "black" };
var sentidosMovimiento = {"Ninguno" : 0, "Arriba" : 1, "Abajo" : 2, "Derecha" : 3, "Izquierda" : 4 };

function numeroAleatorio(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function contenedorFichas(x, y, ancho) {
  this.x = x;
  this.y = y;
  this.ancho = ancho;
  this.color = coloresFichas.Ninguno;
  this.updateGraphics = function(context) {
    dibujarRectangulo(context,this.color, this.x, this.y, this.ancho,this.ancho,false);
  }
}

function ficha(x, y, ancho, color) {
  this.x = x;
  this.y = y;
  this.ancho = ancho;
  this.color = color;
  this.mousesobre = false;
  this.agarrada = false;
  this.sentido = sentidosMovimiento.Ninguno;
  this.xVelMax = 0;
  this.yVelMax = 0;
  this.update = function(cx, cy) {
    if(cx >= this.x && cx <= this.x + this.ancho && cy >= this.y && cy <= this.y + this.ancho) {
      this.mousesobre = true;
    } else {
      this.mousesobre = false;
    }
  }
  this.calcularSentidoMovimiento = function(mx,my) {
    if(this.agarrada) {
      if(this.x - mx != 0 || this.y - my != 0) {
        this.xVelMax = Math.abs(this.x - mx);
        this.yVelMax = Math.abs(this.y - my);
        // se esta haciendo algún movimiento
        if(this.xVelMax >= this.yVelMax) {
          // movimiento horizontal
          if((this.x - mx) > 0) {
            this.sentido = sentidosMovimiento.Izquierda;
          } else {
            this.sentido = sentidosMovimiento.Derecha;
          }
          this.yVelMax = 0;
        } else {
          // movimiento vertical
          if((this.y - my) > 0) {
            this.sentido = sentidosMovimiento.Arriba;
          } else {
            this.sentido = sentidosMovimiento.Abajo;
          }
          this.xVelMax = 0;
        }
      } else {
        this.sentido = sentidosMovimiento.Ninguno;
        this.xVelMax = 0;
        this.yVelMax = 0;
      }
    } else {
      this.sentido = sentidosMovimiento.Ninguno;
      this.xVelMax = 0;
      this.yVelMax = 0;
    }
  }
  this.updateGraphics = function(context) {
    dibujarFicha(context,this.color, this.x, this.y, this.ancho,this.mousesobre);
  }
}


var juegoAleatorioScene = {
  mousex: 0,
  mousey: 0,
  clicIzqPulsadoAnterior: false,
  clicIzqPulsado: false,
  arrastrarIniciado: false,
  desplazamientoX: 0,
  desplazamientoY: 0,
  start: function(canvas) {
    this.canvas = canvas;
    this.objetivoTerminado = false;
    this.anchoFichas = 60;
    this.anchoFichasPatron = 20;
    this.grillaTablero = [[null,null,null,null,null],
                          [null,null,null,null,null],
                          [null,null,null,null,null],
                          [null,null,null,null,null],
                          [null,null,null,null,null]];

    this.grillaPatron = [[null,null,null],
                         [null,null,null],
                         [null,null,null]];

    this.contenedor = new contenedorFichas(30,250,(this.anchoFichas*5)+1);
    this.contenedorPatron = new contenedorFichas(270,130,(this.anchoFichasPatron*3)+1);
    this.desorganizarTablero();
    this.generarPatron();

    this.canvas.addEventListener("mousedown", function(evt){
      juegoAleatorioScene.clicIzqPulsado = (evt.buttons == 1);
      juegoAleatorioScene.mousex = evt.clientX;
      juegoAleatorioScene.mousey = evt.clientY;
    });
    this.canvas.addEventListener("touchstart", function(evt){
      juegoAleatorioScene.clicIzqPulsado = true;
      juegoAleatorioScene.mousex = evt.touches[0].clientX;
      juegoAleatorioScene.mousey = evt.touches[0].clientY;
    });
    this.canvas.addEventListener("mousemove", function(evt){
      juegoAleatorioScene.clicIzqPulsado = (evt.buttons == 1);
      juegoAleatorioScene.mousex = evt.clientX;
      juegoAleatorioScene.mousey = evt.clientY;
    });
    this.canvas.addEventListener("touchmove", function(evt){
      juegoAleatorioScene.clicIzqPulsado = true;
      juegoAleatorioScene.mousex = evt.touches[0].clientX;
      juegoAleatorioScene.mousey = evt.touches[0].clientY;
    });
    this.canvas.addEventListener("mouseup", function(evt){
      juegoAleatorioScene.mousex = evt.clientX;
      juegoAleatorioScene.mousey = evt.clientY;
      juegoAleatorioScene.clicIzqPulsado = (evt.buttons == 1);
    });
    this.canvas.addEventListener("touchend", function(evt){
      juegoAleatorioScene.mousex = evt.changedTouches[0].clientX;
      juegoAleatorioScene.mousey = evt.changedTouches[0].clientY;
      juegoAleatorioScene.clicIzqPulsado = false;
    });
  },
  generarPatron: function() {
    var colorDisponible = [ coloresFichas.Amarillo, coloresFichas.Blanco, coloresFichas.Rojo, coloresFichas.Naranja, coloresFichas.Azul, coloresFichas.Verde ];
    var cantidadColorDisponible = [ 4, 4, 4, 4, 4, 4 ];
    var conteo = 0;
    for (var fil = 0; fil < 3; fil++) {
      for(var col = 0; col < 3; col++) {
        var posColor = 0;
        do {
          posColor = numeroAleatorio(0,colorDisponible.length - 1);
        } while (cantidadColorDisponible[posColor] == 0);
        if(cantidadColorDisponible[posColor] > 0) {
          cantidadColorDisponible[posColor]--;
        }
        var nuevaFicha = new ficha( 1 + this.contenedorPatron.x + (col * this.anchoFichasPatron),
                                    1 + this.contenedorPatron.y + (fil * this.anchoFichasPatron),
                                    this.anchoFichasPatron,
                                    colorDisponible[posColor] );

        this.grillaPatron[fil][col] = nuevaFicha;
        conteo++;
      }
    }
  },
  desorganizarTablero: function() {
    var colorDisponible = [ coloresFichas.Amarillo, coloresFichas.Blanco, coloresFichas.Rojo, coloresFichas.Naranja, coloresFichas.Azul, coloresFichas.Verde ];
    var cantidadColorDisponible = [ 4, 4, 4, 4, 4, 4 ];
    var conteo = 0;
    for (var fil = 0; fil < 5; fil++) {
      for(var col = 0; col < 5; col++) {
        if(conteo != 0) {
          var posColor = 0;
          do {
            posColor = numeroAleatorio(0,colorDisponible.length - 1);
          } while (cantidadColorDisponible[posColor] == 0);
          if(cantidadColorDisponible[posColor] > 0) {
            cantidadColorDisponible[posColor]--;
          }
          var nuevaFicha = new ficha( 1 + this.contenedor.x + (col * this.anchoFichas),
                                      1 + this.contenedor.y + (fil * this.anchoFichas),
                                      this.anchoFichas,
                                      colorDisponible[posColor] );

          this.grillaTablero[fil][col] = nuevaFicha;
        }
        conteo++;
      }
    }
  },
  moverFichas: function() {
    var contx1 = this.contenedor.x;
    var conty1 = this.contenedor.y;
    var contx2 = contx1 + (this.anchoFichas*5) + 1;
    var conty2 = conty1 + (this.anchoFichas*5) + 1;
    var sentidoMover = sentidosMovimiento.Ninguno;
    var mifila = 0;
    var micolu = 0;

    for (var fil = 0; fil < 5; fil++) {
      for(var col = 0; col < 5; col++) {
        if(this.grillaTablero[fil][col] != null) {
          if(this.grillaTablero[fil][col].agarrada) {
            if(!this.arrastrarIniciado) {
              //calcular desplazamientos del mouse
              this.arrastrarIniciado = true;
              this.desplazamientoX = this.mousex - this.grillaTablero[fil][col].x;
              this.desplazamientoY = this.mousey - this.grillaTablero[fil][col].y;
            } else {
              this.grillaTablero[fil][col].calcularSentidoMovimiento(this.mousex - this.desplazamientoX, this.mousey - this.desplazamientoY);
              sentidoMover = this.grillaTablero[fil][col].sentido;
            }
            mifila = fil;
            micolu = col;
          }
        }
      }
    }
    // Ejecutar movimiento de fichas
    if(sentidoMover != sentidosMovimiento.Ninguno) {
      var xVelMax = this.grillaTablero[mifila][micolu].xVelMax;
      var yVelMax = this.grillaTablero[mifila][micolu].yVelMax;
      var xanterior = 0;
      var yanterior = 0;
      if(sentidoMover == sentidosMovimiento.Derecha) {
        xanterior = contx2;
        for(var col = 4; col >= micolu; col--) {
          if(this.grillaTablero[mifila][col] != null) {
            if((this.grillaTablero[mifila][col].x + xVelMax) < xanterior  - this.anchoFichas) {
              this.grillaTablero[mifila][col].x += xVelMax;
            } else {
              this.grillaTablero[mifila][col].x = xanterior - this.anchoFichas;
            }
            xanterior = this.grillaTablero[mifila][col].x;
          }
        }
      } else if (sentidoMover == sentidosMovimiento.Izquierda) {
        xanterior = contx1 - this.anchoFichas + 1;
        for (var col = 0; col <= micolu; col++) {
          if(this.grillaTablero[mifila][col] != null) {
            if((this.grillaTablero[mifila][col].x - xVelMax) > xanterior + this.anchoFichas) {
              this.grillaTablero[mifila][col].x -= xVelMax;
            } else {
              this.grillaTablero[mifila][col].x = xanterior + this.anchoFichas;
            }
            xanterior = this.grillaTablero[mifila][col].x;
          }
        }
      } else if (sentidoMover == sentidosMovimiento.Abajo) {
        yanterior = conty2;
        for(var fil = 4; fil >= mifila; fil--) {
          if(this.grillaTablero[fil][micolu] != null) {
            if((this.grillaTablero[fil][micolu].y + yVelMax) < yanterior  - this.anchoFichas) {
              this.grillaTablero[fil][micolu].y += yVelMax;
            } else {
              this.grillaTablero[fil][micolu].y = yanterior - this.anchoFichas;
            }
            yanterior = this.grillaTablero[fil][micolu].y;
          }
        }
      } else if (sentidoMover == sentidosMovimiento.Arriba) {
        yanterior = conty1 - this.anchoFichas + 1;
        for(var fil = 0; fil <= mifila; fil++) {
          if(this.grillaTablero[fil][micolu] != null) {
            if((this.grillaTablero[fil][micolu].y - yVelMax) > yanterior  + this.anchoFichas) {
              this.grillaTablero[fil][micolu].y -= yVelMax;
            } else {
              this.grillaTablero[fil][micolu].y = yanterior + this.anchoFichas;
            }
            yanterior = this.grillaTablero[fil][micolu].y;
          }
        }
      }
    }
  },
  ActualizarGrillaTablero: function() {
    var misFichas = new Array();
    for (var fil = 0; fil < 5; fil++) {
      for(var col = 0; col < 5; col++) {
        if(this.grillaTablero[fil][col] != null) {
          if(this.grillaTablero[fil][col].agarrada) {
            this.grillaTablero[fil][col].agarrada = false;
            this.grillaTablero[fil][col].sentido = sentidosMovimiento.Ninguno;
          }
          misFichas.push(this.grillaTablero[fil][col]);
          this.grillaTablero[fil][col] = null;
        }
      }
    }
    var contx1 = this.contenedor.x;
    var conty1 = this.contenedor.y;

    for (unaFicha of misFichas) {
      var nuevaCol = Math.round( (unaFicha.x - (contx1+1)) / this.anchoFichas );
      var nuevaFil = Math.round( (unaFicha.y - (conty1+1)) / this.anchoFichas );
      unaFicha.x = 1 + contx1 + (nuevaCol * this.anchoFichas);
      unaFicha.y = 1 + conty1 + (nuevaFil * this.anchoFichas);
      if(this.grillaTablero[nuevaFil][nuevaCol] != null)
        console.log("Error posición ocupada (" + nuevaFil + "," +  nuevaCol + "): " + this.grillaTablero[nuevaFil][nuevaCol]);
      this.grillaTablero[nuevaFil][nuevaCol] = unaFicha;
    }
  },
  verificarFinJuego: function() {
    var cantidadFichasCorrectas = 0;
    for (var fil = 0; fil < 3; fil++) {
      for(var col = 0; col < 3; col++) {
        if(this.grillaTablero[fil+1][col+1] != null) {
          if(this.grillaPatron[fil][col].color == this.grillaTablero[fil+1][col+1].color)
          {
            cantidadFichasCorrectas++;
          }
        }
      }
    }
    if(cantidadFichasCorrectas == 9) {
      this.objetivoTerminado = true;
    }
    else {
      this.objetivoTerminado = false;
    }
  },
  update: function() {

    if(!this.objetivoTerminado)
    {
      for (var fil = 0; fil < 5; fil++) {
        for(var col = 0; col < 5; col++) {
          if(this.grillaTablero[fil][col] != null) {
            this.grillaTablero[fil][col].update(this.mousex, this.mousey);
          }
        }
      }

      if(this.clicIzqPulsado) {
        if(!this.clicIzqPulsadoAnterior) {
          // clic iniciado
          for (var fil = 0; fil < 5; fil++) {
            for(var col = 0; col < 5; col++) {
              if(this.grillaTablero[fil][col] != null) {
                if(this.grillaTablero[fil][col].mousesobre) {
                  this.grillaTablero[fil][col].agarrada = true;
                }
              }
            }
          }
        } else {
          // clic arastrando
          this.moverFichas();
        }
      } else {
        if(this.clicIzqPulsadoAnterior) {
          // clic soltó
          this.ActualizarGrillaTablero();
          this.verificarFinJuego();
          this.arrastrarIniciado = false;
        } else {
          // nada
        }
      }
      this.clicIzqPulsadoAnterior = this.clicIzqPulsado;
    }
    return 1;
  },
  updateGameGraphics: function(context) {
    // fondo menu
    context.lineWidth = 1;
    dibujarRectangulo(context,"#0099cc",0,0,360,640,true);
    dibujarTexto(context, "white", 40, "Juego Aleatorio", 15, 100, true);
    // version del juego
    dibujarTexto(context, "white", 14, "Versión  1.0", 270, 630, false);
    // dibujar el contenedor
    this.contenedorPatron.updateGraphics(context);
    for (var fil = 0; fil < 3; fil++) {
      for(var col = 0; col < 3; col++) {
        this.grillaPatron[fil][col].updateGraphics(context);
      }
    }

    this.contenedor.updateGraphics(context);
    for (var fil = 0; fil < 5; fil++) {
      for(var col = 0; col < 5; col++) {
        if(this.grillaTablero[fil][col] != null) {
          this.grillaTablero[fil][col].updateGraphics(context);
        }
      }
    }

    context.fillStyle = "rgba(153,153,153,0.5)";
    context.fillRect(this.contenedor.x,this.contenedor.y,this.anchoFichas, this.contenedor.ancho );
    context.fillRect(this.contenedor.x + this.contenedor.ancho - this.anchoFichas,this.contenedor.y,this.anchoFichas, this.contenedor.ancho );
    context.fillRect(this.contenedor.x + this.anchoFichas, this.contenedor.y, this.anchoFichas * 3, this.anchoFichas );
    context.fillRect(this.contenedor.x + this.anchoFichas, this.contenedor.y + this.anchoFichas * 4, this.anchoFichas * 3, this.anchoFichas );
    context.lineWidth = 5;
    context.strokeRect(this.contenedor.x + this.anchoFichas,this.contenedor.y + this.anchoFichas,this.anchoFichas * 3,this.anchoFichas * 3);

    if(this.objetivoTerminado) {
      context.lineWidth = 1;
      dibujarTexto(context, "white", 50, "¡Terminaste!", 15, 410, true);
    }
  }
}
