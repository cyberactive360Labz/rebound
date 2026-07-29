import './style.css'
import { applyBounce } from './game'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Missing #app container')
}

app.innerHTML = `
  <main class="game-shell">
    <header class="hud">
      <h1>Rebound</h1>
      <p>Move with <kbd>←</kbd> <kbd>→</kbd> or mouse. Break all blocks.</p>
      <div class="stats">
        <span>Score: <strong id="score">0</strong></span>
        <span>Lives: <strong id="lives">3</strong></span>
      </div>
    </header>
    <canvas id="game" width="720" height="480" aria-label="Rebound game area"></canvas>
    <button id="start" type="button">Start game</button>
    <p id="status" aria-live="polite"></p>
  </main>
`

const canvas = document.querySelector<HTMLCanvasElement>('#game')
const scoreEl = document.querySelector<HTMLElement>('#score')
const livesEl = document.querySelector<HTMLElement>('#lives')
const startBtn = document.querySelector<HTMLButtonElement>('#start')
const statusEl = document.querySelector<HTMLElement>('#status')

if (!canvas || !scoreEl || !livesEl || !startBtn || !statusEl) {
  throw new Error('Failed to initialize game elements')
}

const context = canvas.getContext('2d')

if (!context) {
  throw new Error('Canvas 2D context is unavailable')
}

const width = canvas.width
const height = canvas.height
const paddleHeight = 12
const paddleWidth = 120
const paddleY = height - 30
const ballRadius = 9
const maxSpeed = 8

const brickRows = 5
const brickCols = 10
const brickPadding = 8
const brickHeight = 18
const brickOffsetTop = 48
const brickOffsetLeft = 16
const brickWidth =
  (width - brickOffsetLeft * 2 - brickPadding * (brickCols - 1)) / brickCols

type Brick = {
  x: number
  y: number
  alive: boolean
}

let bricks: Brick[] = []
let rightPressed = false
let leftPressed = false
let animationFrameId = 0
let running = false
let score = 0
let lives = 3
let paddleX = (width - paddleWidth) / 2
let ballX = width / 2
let ballY = height - 60
let ballVX = 4.2
let ballVY = -4.2

const resetBricks = () => {
  bricks = []
  for (let row = 0; row < brickRows; row += 1) {
    for (let col = 0; col < brickCols; col += 1) {
      const x = brickOffsetLeft + col * (brickWidth + brickPadding)
      const y = brickOffsetTop + row * (brickHeight + brickPadding)
      bricks.push({ x, y, alive: true })
    }
  }
}

const resetBall = () => {
  ballX = width / 2
  ballY = height - 60
  ballVX = (Math.random() > 0.5 ? 1 : -1) * 4.2
  ballVY = -4.2
}

const updateHud = () => {
  scoreEl.textContent = String(score)
  livesEl.textContent = String(lives)
}

const stopGame = (message: string) => {
  running = false
  cancelAnimationFrame(animationFrameId)
  statusEl.textContent = message
  startBtn.hidden = false
}

const startGame = () => {
  score = 0
  lives = 3
  paddleX = (width - paddleWidth) / 2
  resetBricks()
  resetBall()
  updateHud()
  statusEl.textContent = ''
  startBtn.hidden = true
  running = true
  tick()
}

const clampSpeed = (value: number) => {
  const abs = Math.min(Math.abs(value), maxSpeed)
  return value < 0 ? -abs : abs
}

const tick = () => {
  if (!running) {
    return
  }

  context.clearRect(0, 0, width, height)

  if (leftPressed) {
    paddleX = Math.max(0, paddleX - 7)
  }
  if (rightPressed) {
    paddleX = Math.min(width - paddleWidth, paddleX + 7)
  }

  ballX += ballVX
  ballY += ballVY

  if (ballX + ballRadius >= width || ballX - ballRadius <= 0) {
    ballVX = -ballVX
  }
  if (ballY - ballRadius <= 0) {
    ballVY = -ballVY
  }

  if (
    ballVY > 0 &&
    ballY + ballRadius >= paddleY &&
    ballY + ballRadius <= paddleY + paddleHeight &&
    ballX >= paddleX &&
    ballX <= paddleX + paddleWidth
  ) {
    const offset = (ballX - (paddleX + paddleWidth / 2)) / (paddleWidth / 2)
    ballVX = clampSpeed(ballVX + offset * 1.8)
    ballVY = -Math.abs(clampSpeed(applyBounce(ballVY, 1.04)))
  }

  if (ballY - ballRadius > height) {
    lives -= 1
    updateHud()
    if (lives <= 0) {
      stopGame('Game over. Press Start game to try again.')
      return
    }
    resetBall()
  }

  for (const brick of bricks) {
    if (!brick.alive) {
      continue
    }

    const withinX = ballX + ballRadius >= brick.x && ballX - ballRadius <= brick.x + brickWidth
    const withinY = ballY + ballRadius >= brick.y && ballY - ballRadius <= brick.y + brickHeight

    if (withinX && withinY) {
      brick.alive = false
      score += 10
      updateHud()
      ballVY = -ballVY
      break
    }
  }

  const remainingBricks = bricks.filter((brick) => brick.alive).length
  if (remainingBricks === 0) {
    stopGame('You win! Press Start game to play again.')
    return
  }

  context.fillStyle = '#7c3aed'
  context.beginPath()
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2)
  context.fill()
  context.closePath()

  context.fillStyle = '#22d3ee'
  context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight)

  for (const brick of bricks) {
    if (!brick.alive) {
      continue
    }
    context.fillStyle = '#f59e0b'
    context.fillRect(brick.x, brick.y, brickWidth, brickHeight)
  }

  animationFrameId = requestAnimationFrame(tick)
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    rightPressed = true
  } else if (event.key === 'ArrowLeft') {
    leftPressed = true
  }
})

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowRight') {
    rightPressed = false
  } else if (event.key === 'ArrowLeft') {
    leftPressed = false
  }
})

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  paddleX = Math.min(Math.max(x - paddleWidth / 2, 0), width - paddleWidth)
})

startBtn.addEventListener('click', startGame)
updateHud()
statusEl.textContent = 'Press Start game to begin.'
