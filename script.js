
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
  const pipeImageHeight = 512; // original height of image (adjust if needed)

  const heightTop = Math.random() * (containerHeight - gap - 100); // min margin

  // Create wrapper divs
  const topWrapper = document.createElement('div');
  const bottomWrapper = document.createElement('div');

 // Create top pipe image
	const top = document.createElement('img');
	top.src = 'pipe.png';
	top.style.transform = 'scaleY(-1)';
	top.style.width = '100%';
	top.style.height = 'auto';
	top.style.position = 'absolute';
	top.style.bottom = '0'; // Align the bottom of the image to the bottom of the wrapper

	// Add image to wrapper
	topWrapper.appendChild(top);

	// Style the wrapper
	topWrapper.style.position = 'absolute';
	topWrapper.style.width = `${pipeWidth}px`;
	topWrapper.style.height = `${heightTop}px`; // only show this much height
	topWrapper.style.top = '0';
	topWrapper.style.left = `${containerWidth + 10}px`;
	topWrapper.style.overflow = 'hidden';


  // Bottom pipe
  const bottom = document.createElement('img');
  bottom.src = 'pipe.png';
  bottom.style.width = '100%';
  bottom.style.height = 'auto';

  bottomWrapper.appendChild(bottom);
  bottomWrapper.style.position = 'absolute';
  bottomWrapper.style.width = `${pipeWidth}px`;
  bottomWrapper.style.height = `${containerHeight - heightTop - gap}px`;
  bottomWrapper.style.bottom = '0';
  bottomWrapper.style.left = `${containerWidth + 10}px`;
  bottomWrapper.style.overflow = 'hidden';

  container.appendChild(topWrapper);
  container.appendChild(bottomWrapper);

  pipes.push({ top: topWrapper, bottom: bottomWrapper, passed: false });
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

 

