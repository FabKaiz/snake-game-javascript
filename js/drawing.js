export default class Drawing {
  static gameOver(ctx, centreX, centreY) {
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

  static drawScore(ctx, centreX, centreY, score) {
    ctx.save();
    ctx.font = "bold 200px sans-serif";
    ctx.fillStyle = "#2610424D";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score.toString(), centreX, centreY);
    ctx.restore();
  }

  static drawSnake(ctx, blockSize, snake) {
    ctx.save();
    ctx.fillStyle = "#6F2DBD";
    for (let block of snake.body) {
      this.drawBlock(ctx, block, blockSize);
    }
    ctx.restore();
  }

  static drawApple(ctx, blockSize, apple) {
    const radius = blockSize / 2;
    const x = apple.position[0] * blockSize + radius;
    const y = apple.position[1] * blockSize + radius;
    ctx.save();
    ctx.fillStyle = "#00BFB2";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
  }

  static drawBlock(ctx, position, blockSize) {
    const [x, y] = position;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  }
}