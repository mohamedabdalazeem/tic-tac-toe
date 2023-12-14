const GameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const boardUi = document.getElementById("board");

  const render = () => {
    boardUi.innerHTML = "";
    board.forEach((square, index) => {
      let squareEl = document.createElement("div");
      squareEl.id = `square${index}`;
      squareEl.classList.add("square");
      squareEl.innerText = square;
      boardUi.appendChild(squareEl);
    });
  };

  return { boardUi, render };
})();

const GameController = (board) => {
  let gameBoard = ["", "", "", "", "", "", "", "", ""];

  let firstPlayer = {
    name: "player One",
    marker: "X",
  };
  let secondPlayer = {
    name: "player Two",
    marker: "O",
  };
  let activePlayer = firstPlayer;
  let gameEnd = false;
  const display = displayController();

  const startGame = (playerOne, playerTwo) => {
    GameBoard.render();
    firstPlayer.name = playerOne ? playerOne : "player one";
    secondPlayer.name = playerTwo ? playerTwo : "player two";
    display.displayNames(firstPlayer.name, secondPlayer.name);
    display.setTurn(firstPlayer.name);
    board.addEventListener("click", mark);
    
  };

  const mark = (e) => {
    let position = Number(e.target.id.slice(-1));
    let square = e.target;
    console.log("position", position);

    if (gameEnd) {
      board.removeEventListener("click", mark);
      return;
    }
    if (square.innerText == "" && !isNaN(position)) {
      square.innerText = activePlayer.marker;
      square.classList.add(`${activePlayer.marker}-mark`);
      gameBoard[position] = activePlayer.marker;
      checkWinDraw(activePlayer);
      if (!gameEnd) {
        switchPlayer();
        console.log(activePlayer.name);
        display.setTurn(activePlayer.name);
      }
    }
  };

  const switchPlayer = () => {
    activePlayer = activePlayer == firstPlayer ? secondPlayer : firstPlayer;
  };

  const checkWinDraw = (player) => {
    if (
      (gameBoard[0] == gameBoard[1] &&
        gameBoard[0] == gameBoard[2] &&
        gameBoard[0] == player.marker) ||
      (gameBoard[3] == gameBoard[4] &&
        gameBoard[3] == gameBoard[5] &&
        gameBoard[3] == player.marker) ||
      (gameBoard[6] == gameBoard[7] &&
        gameBoard[6] == gameBoard[8] &&
        gameBoard[6] == player.marker) ||
      (gameBoard[0] == gameBoard[3] &&
        gameBoard[0] == gameBoard[6] &&
        gameBoard[0] == player.marker) ||
      (gameBoard[1] == gameBoard[4] &&
        gameBoard[1] == gameBoard[7] &&
        gameBoard[1] == player.marker) ||
      (gameBoard[2] == gameBoard[5] &&
        gameBoard[2] == gameBoard[8] &&
        gameBoard[2] == player.marker) ||
      (gameBoard[0] == gameBoard[4] &&
        gameBoard[0] == gameBoard[8] &&
        gameBoard[0] == player.marker) ||
      (gameBoard[2] == gameBoard[4] &&
        gameBoard[2] == gameBoard[6] &&
        gameBoard[2] == player.marker)
    ) {
      console.log(`${player.name} Win!!`);
      gameEnd = true;
      display.setWin(player.name);
      return;
    } else if (gameBoard.every((item) => item !== "")) {
      gameEnd = true;
      display.setDraw();
      return;
    }
  };

  const resetGame = () => {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    activePlayer = firstPlayer;
    GameBoard.render();
    display.setTurn(firstPlayer.name);
    gameEnd = false;
    display.reset();
    board.addEventListener("click", mark);
  };

  return { startGame, resetGame };
};

const displayController = () => {
  let name1 = "";
  let name2 = "";
  const firstLabelEl = document.createElement("p");
  const vsEl = document.createElement("p");
  const secondLabelEl = document.createElement("p");
  firstLabelEl.classList.add("name-text");
  secondLabelEl.classList.add("name-text");

  const displayNames = (firstN, secondN) => {
    name1 = firstN;
    name2 = secondN;

    firstLabelEl.innerText = name1;
    vsEl.innerText = "vs";
    secondLabelEl.innerText = name2;
    namesEl.appendChild(firstLabelEl);
    namesEl.appendChild(vsEl);
    namesEl.appendChild(secondLabelEl);
  };
  const setTurn = (player) => {
    console.log("called with value:", player);
    console.log("name 1=", name1);
    console.log("name 2=", name2);
    console.log("first el:", firstLabelEl);
    if (player == name1) {
      firstLabelEl.classList.add("active");
      secondLabelEl.classList.remove("active");
    } else if (player == name2) {
      firstLabelEl.classList.remove("active");
      secondLabelEl.classList.add("active");
    }
  };
  const setWin = (player) => {
    if (player == name1) {
      firstLabelEl.classList.add("win");
      secondLabelEl.classList.add("lose");
    } else {
      firstLabelEl.classList.add("lose");
      secondLabelEl.classList.add("win");
    }
    firstLabelEl.classList.remove("active");
    secondLabelEl.classList.remove("active");
  };
  const setDraw = () => {
    vsEl.innerText = "🤝🏼";
    firstLabelEl.classList.add("draw");
    secondLabelEl.classList.add("draw");
    firstLabelEl.classList.remove("active");
    secondLabelEl.classList.remove("active");
  };
  const reset = () => {
    firstLabelEl.classList.remove("active");
    firstLabelEl.classList.remove("win");
    firstLabelEl.classList.remove("lose");
    firstLabelEl.classList.remove("draw");
    secondLabelEl.classList.remove("active");
    secondLabelEl.classList.remove("win");
    secondLabelEl.classList.remove("lose");
    secondLabelEl.classList.remove("draw");
    vsEl.innerText = "vs";
  };

  return { displayNames, setTurn, setWin, setDraw, reset };
};

const start = () => {
  gameUi.style.display = "";
  restartBtn.style.display = "";
  controlsUi.style.display = "none";
  startBtn.style.display = "none";
  resetBtn.style.display = "";

  const firstNameEl = document.getElementById("player-one");
  const secondNameEl = document.getElementById("player-two");
  let name1 = firstNameEl.value;
  let name2 = secondNameEl.value;

  const gameBoard = GameBoard.boardUi;
  const game = GameController(gameBoard);
  game.startGame(name1, name2);
  resetBtn.addEventListener("click", game.resetGame);
};

const restartGame = () => {
  gameUi.style.display = "none";
  restartBtn.style.display = "none";
  resetBtn.style.display = "none";
  controlsUi.style.display = "";
  startBtn.style.display = "";
  while (namesEl.firstChild) {
    namesEl.removeChild(namesEl.firstChild);
  }
};

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const resetBtn = document.getElementById("reset-btn");

const gameUi = document.getElementById("game");
const controlsUi = document.querySelector(".controls");
const namesEl = document.querySelector(".game-labels");

startBtn.addEventListener("click", start);
gameUi.style.display = "none";
restartBtn.style.display = "none";
resetBtn.style.display = "none";
restartBtn.addEventListener("click", restartGame);
