import Game from './js/game.js'

window.onload = () => {

  let myGame = new Game();
  myGame.init();

  document.onkeydown = (e) => {
      const key = e.key;
      let newDirection;
      switch(key){
          case 'ArrowLeft':
              newDirection = "left";
              break;
          case 'ArrowUp':
              newDirection = "up";
              break;
          case 'ArrowRight':
              newDirection = "right";
              break;
          case 'ArrowDown':
              newDirection = "down";
              break;
          case ' ':
              myGame.launch();
              return;
          default:
              return;
      }
      myGame.snakee.setDirection(newDirection);
  };

}