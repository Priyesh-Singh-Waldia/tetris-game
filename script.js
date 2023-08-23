document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  let speed = 600;
  const colors = ["orange", "red", "purple", "yellow", "cyan", "green", "blue"];

  //📦 Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [2, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [2, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const sTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const jTetromino = [
    [0, 1, width + 1, width * 2 + 1],
    [width, width + 1, width + 2, width * 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width + 2, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
    sTetromino,
    jTetromino,
  ];

  //👣 Postions
  let currentPosition = 4;
  let currentRotation = 0;

  //🔀 randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //🖌️ draw the Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random]; // add colors
    });
  }

  //🚮 undraw the Tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = ""; // remove colors
    });
  }

  //🕹️ Game Controls
  function control(e) {
    //⬅️ Left
    if (e.keyCode === 37 || e.keyCode === 65) {
      moveLeft();
    }
    //➡️ Right
    else if (e.keyCode === 39 || e.keyCode === 68) {
      moveRight();
    }
    // ⬇️ Down
    else if (e.keyCode === 40 || e.keyCode === 83) {
      moveDown();
    }
    //🔄️ Rotate ➡️ Right
    else if (e.keyCode === 190 || e.keyCode === 69 || e.keyCode === 38) {
      rotateRight();
    }
    //🔄️ Rotate ⬅️ Left
    else if (e.keyCode === 188 || e.keyCode === 81) {
      rotateLeft();
    }
  }
  document.addEventListener("keydown", control);

  //🔽 move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //🥶 freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );

      //📉 start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //🕺 Movement restrictions - ➡️ Left
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }

    draw();
  }

  //🕺 Movement restrictions - ⬅️ Right
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  // 🔄️ Rotation Function
  // Right
  function rotateRight() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      // if the current rotation gets to 3, then make it 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // Left
  function rotateLeft() {
    undraw();
    if (currentRotation > 0) {
      // if the current rotation is greater than 0, then --;
      currentRotation--;
    } else if (currentRotation === 0) {
      // if the current rotation is 0, then make it 3
      currentRotation = 3;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // 📊 For Mini-Grid
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  // The Tetrominoes without rotation

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //L
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //Z
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //T
    [0, 1, displayWidth, displayWidth + 1], //O
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //I
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //S
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], //J
  ];

  // Show Next Tetromino inside mini-grid
  function displayShape() {
    // remove any trace of a tetromino from the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = ""; // remove color
    });

    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom]; // add color
    });
  }

  // 🟢🔴 Start Button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, speed);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  // 💯 Add Score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = ""; // remove color
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  // ☠️ Game Over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "GAME OVER";
      clearInterval(setTimeout);
    }
  }
});
