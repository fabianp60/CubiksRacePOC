function dibujarFicha(contexto2D, color, x, y, ancho, resaltar)
{
  contexto2D.fillStyle = color;
  contexto2D.fillRect(x,y,ancho-1,ancho-1);
  if(resaltar)
    contexto2D.strokeRect(x,y,ancho-1,ancho-1);
}

function dibujarRectangulo(contexto2D, color, x, y, ancho, alto, conborde)
{
  contexto2D.fillStyle = color;
  contexto2D.fillRect(x,y,ancho,alto);
  if(conborde)
    contexto2D.strokeRect(x,y,ancho,alto);
}

function dibujarTexto(contexto2D, color, tamanopx, texto, x, y, conborde)
{
  // fuentes {"Arial","Comic Sans MS"}
  contexto2D.fillStyle = color;
  contexto2D.font = tamanopx + "px Aero";
  contexto2D.fillText(texto,x,y);
  if(conborde)
    contexto2D.strokeText(texto,x,y);
}
