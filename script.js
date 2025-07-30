
const container = document.getElementById('game-container');
const bird = document.getElementById('bird');
const scoreDiv = document.getElementById('score');

let birdY = 280, velocity = 0;
const gravity = 0.5, jumpPower = -8;
let pipes = [], score = 0, gameOver = false;

function createPipe() {
  const gap = 150;
  const containerHeight = container.offsetHeight;
  const containerWidth = container.offsetWidth;
  const pipeWidth = 60;
  const heightTop = Math.random() * (containerHeight - gap - 100); // margin

  // Top pipe
  const top = document.createElement('img');
  //top.src = 'pipe.png';
  top.classList.add('pipe');
  top.style.position = 'absolute';
  top.style.width = `${pipeWidth}px`;     // fixed width
  top.style.height = `${heightTop}px`;    // variable height
  top.style.top = '0';
  top.style.left = `${containerWidth + 10}px`;
  top.style.transform = 'scaleY(-1)';     // flip image upside-down for top pipe
  top.style.objectFit = 'fill';

  // Bottom pipe
  const bottom = document.createElement('img');
  //bottom.src = 'pipe.png';
  bottom.classList.add('pipe');
  bottom.style.position = 'absolute';
  bottom.style.width = `${pipeWidth}px`;
  bottom.style.height = `${containerHeight - heightTop - gap}px`;
  bottom.style.bottom = '0';
  bottom.style.left = `${containerWidth + 10}px`;
  bottom.style.objectFit = 'fill';

  container.appendChild(top);
  container.appendChild(bottom);

  pipes.push({ top, bottom, passed: false });
}

function jump() {
  if (!gameOver) velocity = jumpPower;
}

document.addEventListener('keydown', e => { if (e.code === 'Space') jump(); });
document.addEventListener('click', jump);

function update() {
  if (gameOver) return;
  velocity += gravity;
  birdY += velocity;
  bird.style.top = birdY + 'px';

  pipes.forEach(p => {
    const x = parseInt(p.top.style.left);
    p.top.style.left = (x - 2) + 'px';
    p.bottom.style.left = (x - 2) + 'px';

    const bx = bird.getBoundingClientRect();
    const tx = p.top.getBoundingClientRect();
    const bxMid = bx.left + bx.width / 2;
    if (!p.passed && bxMid > tx.left + tx.width) {
      score++;
      scoreDiv.textContent = score;
      p.passed = true;
    }

    if (
      bx.right > tx.left && bx.left < tx.right &&
      (bx.top < tx.bottom || bx.bottom > p.bottom.getBoundingClientRect().top)
    ) {
      endGame();
    }

    if (x < -60) {
      p.top.remove();
      p.bottom.remove();
    }
  });

  pipes = pipes.filter(p => parseInt(p.top.style.left) > -60);

  if (birdY > 570 || birdY < -30) endGame();
  requestAnimationFrame(update);
}

function spawnLoop() {
  if (!gameOver) {
    createPipe();
    setTimeout(spawnLoop, 2000);
  }
}

function endGame() {
  gameOver = true;
  // restart game
  const popup = document.getElementById('game-over-popup');
  const scoreSpan = document.getElementById('final-score');
  scoreSpan.textContent = score; // set the score
  popup.style.display = 'flex';
  document.getElementById('restart-btn').addEventListener('click', () => {
  location.reload();
});

}


spawnLoop();
update();

 

