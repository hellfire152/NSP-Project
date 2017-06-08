//clears the game area (by settin innerHTML for now)
function clearGameArea() {
  document.getElementById('game').innerHTML = "";
}

function clearBody(){
  let body = document.getElementsByTagName('body')[0];
  body.innerHTML = "";
  //add game div back in
  let gameDiv = document.createElement('div');
  gameDiv.id = 'game';
  body.appendChild(gameDiv);
}
