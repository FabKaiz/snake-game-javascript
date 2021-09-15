import Snake from "./snake.js";
import Apple from "./apple.js";
import Drawing from "./drawing.js";


export default class Game {
  constructor(canvasWidth = 900, canvasheight = 600) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasheight;
    this.blockSize = 30;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.widthInBlocks = this.canvasWidth / this.blockSize;
    this.heightInBlocks = this.canvasHeight / this.blockSize;
    this.centreX = this.canvasWidth / 2;
    this.centreY = this.canvasHeight / 2;
    this.delay;
    this.snakee;
    this.applee;
    this.score;
    this.timeOut;
  }

  init() {
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

  launch() {
    this.snakee = new Snake("right", [6, 4], [5, 4], [4, 4], [3, 4], [2, 4]);
    this.applee = new Apple();
    this.score = 0;
    clearTimeout(this.timeOut);
    this.delay = 100;
    this.refreshCanvas();
  }

  refreshCanvas() {
    this.snakee.advance();
    if (this.snakee.checkCollision(this.widthInBlocks, this.heightInBlocks)) {
      Drawing.gameOver(this.ctx, this.centreX, this.centreY);
    } else {
      if (this.snakee.isEatingApple(this.applee)) {
        this.score++;
        this.snakee.ateApple = true;

        do {
          this.applee.setNewPosition(this.widthInBlocks, this.heightInBlocks);
        } while (this.applee.isOnSnake(this.snakee));

        if (this.score % 5 == 0) {
          this.speedUp();
        }
      }
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      Drawing.drawScore(this.ctx, this.centreX, this.centreY, this.score);
      Drawing.drawSnake(this.ctx, this.blockSize, this.snakee);
      Drawing.drawApple(this.ctx, this.blockSize, this.applee);
      this.timeOut = setTimeout(this.refreshCanvas.bind(this), this.delay);
    }
  }

  speedUp() {
    this.delay /= 1.3;
  }
}