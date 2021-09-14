window.onload = () => {

  class Game {
    constructor(canvasWidth = 900, canvasheight = 600) {

      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasheight;
      this.blockSize = 30;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.widthInBlocks = this.canvasWidth/this.blockSize;
      this.heightInBlocks = this.canvasHeight/this.blockSize;
      this.centreX = this.canvasWidth / 2;
      this.centreY = this.canvasHeight / 2;
      this.delay;
      this.snakee;
      this.applee; 
      this.score;
      this.timeOut;
    }

    init () {
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;
      this.canvas.style.border = "8px solid #CAB8FF";
      this.canvas.style.borderRadius = "12px";
      this.canvas.style.margin = "25px auto";
      this.canvas.style.display = "block";
      this.canvas.style.backgroundColor = "#F8F6FA";
      document.body.appendChild(this.canvas);
      this.launch();
  }

    launch () {
      this.snakee = new Snake("right", [6,4],[5,4],[4,4],[3,4],[2,4]);
      this.applee = new Apple();
      this.score = 0;
      clearTimeout(this.timeOut);
      this.delay = 100;
      this.refreshCanvas();
    }

    refreshCanvas () {
        this.snakee.advance();
        if (this.snakee.checkCollision(this.widthInBlocks, this.heightInBlocks)){
            Drawing.gameOver(this.ctx, this.centreX, this.centreY);
        } else {
            if (this.snakee.isEatingApple(this.applee)){
                this.score++;
                this.snakee.ateApple = true;
                
                do {
                    this.applee.setNewPosition(this.widthInBlocks, this.heightInBlocks); 
                } while(this.applee.isOnSnake(this.snakee));
                
                if(this.score % 5 == 0){
                    this.speedUp();
                }
            }
            this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
            Drawing.drawScore(this.ctx, this.centreX, this.centreY, this.score);
            Drawing.drawSnake(this.ctx, this.blockSize, this.snakee);
            Drawing.drawApple(this.ctx, this.blockSize, this.applee);
            this.timeOut = setTimeout(this.refreshCanvas.bind(this),this.delay);
          }
    }

    speedUp () {
        this.delay /= 2;
    }

  }

  class Snake {
    constructor(direction, ...body) {
      this.body = body;
      this.direction = direction;
      this.ateApple = false;
    }

    advance () {
      const nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          throw ("invalid direction");
      }
      this.body.unshift(nextPosition);
      if (!this.ateApple)
        this.body.pop();

      else
        this.ateApple = false;
    };

    setDirection (newDirection) {
      let allowedDirections;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;
        case "down":
        case "up":
          allowedDirections = ["left", "right"];
          break;
        default:
          throw ("invalid direction");
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        this.direction = newDirection;
      }
    };

    checkCollision (widthInBlocks, heightInBlocks) {
      let wallCollision = false;
      let snakeCollision = false;
      const [head, ...rest] = this.body;
      const [snakeX, snakeY] = head;
      const minX = 0;
      const minY = 0;
      const maxX = widthInBlocks - 1;
      const maxY = heightInBlocks - 1;
      const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
        wallCollision = true;

      for (let block of rest) {
        if (snakeX === block[0] && snakeY === block[1])
          snakeCollision = true;
      }

      return wallCollision || snakeCollision;
    };

    isEatingApple (appleToEat) {
      const head = this.body[0];
      if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
        return true;

      else
        return false;
    };
  }

  class Apple {
    constructor(position = [10, 10]) {
      this.position = position;
    }

    setNewPosition (widthInBlocks, heightInBlocks) {
      const newX = Math.round(Math.random() * (widthInBlocks - 1));
      const newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };

    isOnSnake (snakeToCheck) {
      let isOnSnake = false;
      for (let block of snakeToCheck.body) {
        if (this.position[0] === block[0] && this.position[1] === block[1]) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    };
  }

  class Drawing {

    static gameOver (ctx, centreX, centreY) {
      ctx.save();
      ctx.font = "bold 100px sans-serif";
      ctx.fillStyle = "#261042";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Game Over", centreX, centreY - 180);
      ctx.font = "bold 30px sans-serif";
      ctx.fillText("Press spacebar to play again", centreX, centreY - 120);
      ctx.restore();
    }

    static drawScore (ctx, centreX, centreY, score) {
      ctx.save();
      ctx.font = "bold 200px sans-serif";
      ctx.fillStyle = "#2610424D";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(score.toString(), centreX, centreY);
      ctx.restore();
    }

    static drawSnake (ctx, blockSize, snake) {
      ctx.save();
      ctx.fillStyle = "#6F2DBD";
      for (let block of snake.body) {
        this.drawBlock(ctx, block, blockSize);
      }
      ctx.restore();
    };

    static drawApple (ctx, blockSize, apple) {
      const radius = blockSize / 2;
      const x = apple.position[0] * blockSize + radius;
      const y = apple.position[1] * blockSize + radius;
      ctx.save();
      ctx.fillStyle = "#00BFB2";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    };

    static drawBlock (ctx, position, blockSize) {
      const [x, y] = position;
      ctx.fillRect(x*blockSize,y*blockSize,blockSize,blockSize);
    }

  }

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