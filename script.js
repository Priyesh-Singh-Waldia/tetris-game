document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;

  //📦 Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
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

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //🔀 randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //🖌️ draw the Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
    });
  }

  //🚮 undraw the Tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
    });
  }

  //🏎️ speed
  speed = 500;

  //⌛ make the tetromino move down every second
  timerId = setInterval(moveDown, speed);

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
    // else if (e.keyCode === 188 || e.keyCode === 81) {
    //   rotateLeft();
    // }
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
      random = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
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
      // if the current rotation gets to 4, then make it 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // Left
  // function rotateLeft() {
  //   undraw();
  //   currentRotation--;
  //   if (currentRotation === 0) {
  //     // if the current rotation gets to 0, then make it 4
  //     currentRotation = 4;
  //   }
  //   current = theTetrominoes[random][currentRotation];
  //   draw();
  // }
});
