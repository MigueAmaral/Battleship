import "./styles.css";

// initial screen
let playerLeaderboard;
let computerLeaderboard;

function leaderboards() {
  const modal = document.querySelector(".modal");
  modal.style.display = "block";
  document.querySelector(".gameContainer").style.opacity = "0.2";
  document.querySelector(".close").addEventListener("click", () => {
    modal.style.display = "none";
    document.querySelector(".gameContainer").style.opacity = "1";
  });
  if (JSON.parse(localStorage.getItem("playerWinnings")) != null) {
    let pLeaderboard = Array.from(
      document.querySelectorAll(".playerLeaderboard li")
    );
    playerLeaderboard = JSON.parse(localStorage.getItem("playerWinnings"));
    for (let i = 0; i < pLeaderboard.length; i++) {
      pLeaderboard[i].innerText = playerLeaderboard[i] + " turns";
      if (playerLeaderboard[i] === undefined) {
        pLeaderboard[i].style.opacity = "0";
      }
    }
  } else {
    playerLeaderboard = [];
  }
  if (JSON.parse(localStorage.getItem("computerWins")) != null) {
    let cLeaderboard = Array.from(
      document.querySelectorAll(".computerLeaderboard li")
    );
    computerLeaderboard = JSON.parse(localStorage.getItem("computerWins"));
    cLeaderboard.forEach((i) => (i.innerText = computerLeaderboard[i]));
    for (let i = 0; i < cLeaderboard.length; i++) {
      cLeaderboard[i].innerText = computerLeaderboard[i] + " turns";
      if (computerLeaderboard[i] === undefined) {
        cLeaderboard[i].style.opacity = "0";
      }
    }
  } else {
    computerLeaderboard = [];
  }
}

leaderboards();

// set tray function
let horizontal = true;
let angle;
let flipB = document.querySelector(".flip");

flipB.addEventListener("click", () => {
  document.querySelector(".patrol").classList.toggle("patrolR");
  document.querySelector(".submarine").classList.toggle("submarineR");
  document.querySelector(".destroyer").classList.toggle("destroyerR");
  document.querySelector(".carrier").classList.toggle("carrierR");
  document.querySelector(".battleship").classList.toggle("battleshipR");
  document.querySelector(".trayShips").classList.toggle("trayRotated");
  if (horizontal == true) {
    horizontal = false;
  } else {
    horizontal = true;
  }
});

// set main boards

let playerB = document.querySelector(".playerBoard");
let computerB = document.querySelector(".compBoard");

function createGrid(user) {
  if (user === computerB) {
    for (let i = 0; i < 100; i++) {
      const square = document.createElement("div");
      square.classList.add(`squareComp`);
      square.style.height = "30px";
      square.style.width = "30px";
      square.id = i;
      user.appendChild(square);
    }
  } else {
    for (let i = 0; i < 100; i++) {
      const square = document.createElement("div");
      square.classList.add(`squarePlayer`);
      square.style.height = "60px";
      square.style.width = "60px";
      square.id = i;
      user.appendChild(square);
    }
  }
}

createGrid(playerB);
createGrid(computerB);

// create ship objects

class ship {
  constructor(name, size) {
    this.name = name;
    this.size = size;
    this.status;
  }
}

const carrier = new ship("carrier", 5);
const battleship = new ship("battleship", 4);
const destroyer = new ship("destroyer", 3);
const submarine = new ship("submarine", 3);
const patrol = new ship("patrol", 2);

const ships = [carrier, battleship, destroyer, submarine, patrol];

// add ships to computer board

let filledSquares = [];

function addBoardShips() {
  ships.forEach((ship) => {
    if (ship.status !== "taken") {
      Math.random() > 0.5 ? (angle = true) : (angle = false);
      let shipSquares = [];
      let shipContainer = [];
      let startingIndex;
      startingIndex = Math.floor(Math.random() * 100);
      let validIndex = startValidation(Number(startingIndex), ship, angle);
      fillSquares(shipSquares, validIndex, ship, angle);
      if (filledSquares.some((i) => shipSquares.includes(i))) {
        addBoardShips();
      } else
        shipSquares.forEach((i) =>
          shipContainer.push(computerB.querySelector(`[id='${i}']`))
        );
      ship.status = "taken";
      filledSquares = [...filledSquares, ...shipSquares];
      shipSquares.length = 0;
      shipContainer.forEach((square) => {
        square.classList.add(`${ship.name}C`);
      });
    }
  });
  hideComp();
}

function hideComp() {
  let allSquares = document.querySelectorAll(".squareComp");
  allSquares.forEach((i) => i.classList.add("squareHide"));
}

// validation of starting number

function startValidation(num, obj, direction) {
  if (direction == true) {
    const number = Array.from(num.toString());
    let digit = parseInt(number[number.length - 1]);
    if (digit + (obj.size - 1) <= 9) {
      return num;
    } else {
      return (digit = digit - (digit + (obj.size - 1) - 9));
    }
  } else if (direction == false) {
    if (num + (obj.size - 1) * 10 <= 99) {
      return num;
    } else {
      return (num = num - (num + (obj.size - 1) * 10 - 99));
    }
  }
}

function fillSquares(arr, num, obj, direction) {
  if (direction == true) {
    for (let i = arr.length; i < obj.size; i++) {
      arr[i] = num + i;
    }
  } else if (direction == false) {
    for (let i = arr.length; i < obj.size; i++) {
      arr[i] = num + i * 10;
    }
  }
  return arr;
}

document.querySelector(".reset").addEventListener("click", resetGame);

function resetGame() {
  let filledSpots = document.querySelectorAll("[class^='square']");
  filledSpots.forEach((i) => {
    i.classList.remove("patrolC");
    i.classList.remove("submarineC");
    i.classList.remove("destroyerC");
    i.classList.remove("carrierC");
    i.classList.remove("battleshipC");
  });
  document.querySelector(".alertcarrier").classList.remove("carrierC");
  document.querySelector(".alertsubmarine").classList.remove("submarineC");
  document.querySelector(".alertdestroyer").classList.remove("destroyerC");
  document.querySelector(".alertpatrol").classList.remove("patrolC");
  document.querySelector(".alertbattleship").classList.remove("battleshipC");
  let shipsDisplay = document.querySelectorAll(".shipDisplay p");
  shipsDisplay.forEach((i) => i.classList.remove("chosen"));
  let removedShips = document.querySelectorAll(".shipRemoved");
  removedShips.forEach((i) => i.classList.remove("shipRemoved"));
  squaresPlayed.length = 0;
  filledSquares.length = 0;
  ships.forEach((ship) => (ship.status = ""));
  addBoardShips();
}

// add ships to player board

let squaresPlayed = [];

let pieces = document.querySelectorAll(".trayShip");
let boardSquares = document.querySelectorAll(".squarePlayer");
let tray = document.querySelector(".trayShips");

pieces.forEach((x) =>
  x.addEventListener("dragstart", (e) => {
    e.target.classList.toggle("dragging");
    e.dataTransfer.setData("text", e.target.id);
  })
);

pieces.forEach((x) =>
  x.addEventListener("dragend", (e) => {
    e.preventDefault();
    e.target.classList.toggle("dragging");
  })
);

boardSquares.forEach((x) =>
  x.addEventListener("drop", (e) => {
    e.preventDefault();
    let ship = e.dataTransfer.getData("text");
    addPlayerShips(e.target, ship);
  })
);

boardSquares.forEach((x) =>
  x.addEventListener("dragover", (e) => {
    e.preventDefault();
  })
);

boardSquares.forEach((x) =>
  x.addEventListener("dragenter", (e) => {
    e.preventDefault();
  })
);

function addPlayerShips(square, piece) {
  let shipSquares = [];
  let shipContainer = [];
  let startingIndex = square.id;
  let targetShip = ships.map((e) => e.name).indexOf(piece);
  let validIndex;
  if (horizontal == true) {
    const number = Array.from(Number(startingIndex).toString());
    let digit = parseInt(number[number.length - 1]);
    if (digit + (ships[targetShip].size - 1) > 9) {
      return;
    } else validIndex = Number(startingIndex);
  } else if (horizontal == false) {
    if (Number(startingIndex) + (ships[targetShip].size - 1) * 10 > 99) {
      return;
    } else validIndex = Number(startingIndex);
  }
  fillSquares(shipSquares, validIndex, ships[targetShip], horizontal);
  if (squaresPlayed.some((i) => shipSquares.includes(i))) {
    return;
  } else
    shipSquares.forEach((i) =>
      shipContainer.push(playerB.querySelector(`[id='${i}']`))
    );
  squaresPlayed = [...squaresPlayed, ...shipSquares];
  shipSquares.length = 0;
  shipContainer.forEach((square) => {
    square.classList.add(`${ships[targetShip].name}C`);
  });
  let shipAlert = document.querySelector(`.alert${ships[targetShip].name}`);
  shipAlert.classList.add(`${ships[targetShip].name}C`);
  shipAlert.classList.add("chosen");
  let shipRemoved = tray.querySelector(`.${ships[targetShip].name}`);
  shipRemoved.classList.add("shipRemoved");
}

// game start
let turnIndicator;
let turnNumber;

function turnSelector(mode) {
  if (mode !== undefined) {
    let turn = Math.random() > 0.5 ? "player" : "computer";
    turnIndicator = turn;
  }
  document.querySelector(".turnIndicator").innerHTML =
    turnIndicator + " choosing target...";
  return turnIndicator;
}

let startB = document.querySelector(".start");
startB.addEventListener("click", startGame);

async function startGame() {
  let alertDisplay = document.querySelector(".alerts");
  let shipDisplay = document.querySelector(".shipDisplay");
  resetGame();
  alertDisplay.innerHTML = "---- Deploy your ships ----";
  shipDisplay.style.opacity = "1";
  document.querySelector(".deploy").addEventListener("click", (e) => {
    if (!checkShips()) {
      alertDisplay.innerHTML = "";
      e.target.innerHTML = "DEPLOYED";
      e.target.style.opacity = "0.7";
      document.querySelector(".turnIndicator").innerHTML =
        "deciding who attacks first...";
      setTimeout(() => {
        turnSelector("random");
        if (turnIndicator === "computer") {
          computerMove();
        }
      }, Math.random() * 3000);
      turnNumber = 0;
    } else {
      alertDisplay.innerHTML = "---- Ships awaiting orders ----";
    }
  });
}

function checkShips() {
  let shipsDisplay = Array.from(document.querySelectorAll(".shipDisplay p"));
  let allShips = shipsDisplay.some((i) => !i.classList.contains("chosen"));
  return allShips;
}

// computer attacks
let computerAttacks = [];
let playerShipsAttacked = [];
let possiblePlays = [];
let lastShot = [];
let move;

function computerMove() {
  document.querySelector(".turnIndicator").innerHTML =
    turnIndicator + " choosing target...";
  setTimeout(() => {
    if (playerShipsAttacked.length === 0) {
      possiblePlays.length = 0;
    }
    if (lastShot.length != 0 && playerShipsAttacked.length != 0) {
      if (lastShot[lastShot.length - 1] != 99) {
        possiblePlays.push(lastShot[lastShot.length - 1] + 1);
      }
      if (lastShot[lastShot.length - 1] > 0) {
        possiblePlays.push(lastShot[lastShot.length - 1] - 1);
      }
      if (lastShot[lastShot.length - 1] > 9) {
        possiblePlays.push(lastShot[lastShot.length - 1] - 10);
      }
      if (lastShot[lastShot.length - 1] < 90) {
        possiblePlays.push(lastShot[lastShot.length - 1] + 10);
      }
      do {
        move = possiblePlays[Math.floor(Math.random() * possiblePlays.length)];
      } while (computerAttacks.includes(move));
      computerAttacks.push(move);
    } else {
      do {
        move = Math.floor(Math.random() * 99);
      } while (computerAttacks.includes(move));
      computerAttacks.push(move);
    }
    let playerPosition = Array.from(playerB.querySelectorAll("[class$='C']"));
    if (playerPosition.some((i) => i.id === `${move}`)) {
      lastShot.push(move);
      let positionHit = playerB.querySelector(`[id='${move}']`);
      let ship = positionHit.classList;
      playerShipsAttacked.push(ship[1]);
      let cross = document.createElement("span");
      cross.innerText = "close";
      cross.classList.add("material-symbols-outlined");
      positionHit.appendChild(cross);
      computerSinks();
    } else {
      let positionHit = playerB.querySelector(`[id='${move}']`);
      let missed = document.createElement("span");
      missed.innerText = "close";
      missed.classList.add("material-symbols-outlined");
      missed.classList.add("transparent");
      positionHit.appendChild(missed);
    }
    if (victory === true) {
      let alertDisplay = document.querySelector(".alerts");
      alertDisplay.innerHTML = `ENEMY WON in ${Math.floor(turnNumber)} turns!`;
      computerLeaderboard.push(Math.floor(turnNumber));
      localStorage.setItem("computerWins", JSON.stringify(computerLeaderboard));
      let search = "defeat";
      getPics(search);
      setTimeout(() => {leaderboards()},2000)
      return;
    }
    turnIndicator = "player";
    turnNumber += 0.5;
    document.querySelector(".turnIndicator").innerHTML =
      turnIndicator + " choosing target...";
  }, Math.random() * 3000);
}

// player attacks
let playerAttacks = [];
let computerShipsAttacked = [];

let position = Array.from(playerB.querySelectorAll(".squarePlayer"));
position.forEach((i) =>
  i.addEventListener("click", (e) => playerMove(e.target))
);

position.forEach((i) =>
  i.addEventListener("mouseenter", (e) => {
    e.target.classList.add("hover");
    computerB
      .querySelector(`[id='${e.target.id}']`)
      .classList.add("enemyHover");
  })
);

position.forEach((i) =>
  i.addEventListener("mouseleave", (e) => {
    e.target.classList.remove("hover");
    computerB
      .querySelector(`[id='${e.target.id}']`)
      .classList.remove("enemyHover");
  })
);

function playerMove(target) {
  let alertDisplay = document.querySelector(".alerts");
  if (turnIndicator === "player") {
    if (playerAttacks.includes(target.id)) {
      let alertDisplay = document.querySelector(".alerts");
      alertDisplay.innerHTML = "--- Position already targeted!";
    } else {
      alertDisplay.innerHTML = "";
      playerAttacks.push(target.id);
      let computerPosition = Array.from(
        computerB.querySelectorAll(".carrierC")
      );
      computerPosition = [
        ...computerPosition,
        ...Array.from(computerB.querySelectorAll(".destroyerC")),
      ];
      computerPosition = [
        ...computerPosition,
        ...Array.from(computerB.querySelectorAll(".battleshipC")),
      ];
      computerPosition = [
        ...computerPosition,
        ...Array.from(computerB.querySelectorAll(".patrolC")),
      ];
      computerPosition = [
        ...computerPosition,
        ...Array.from(computerB.querySelectorAll(".submarineC")),
      ];
      if (computerPosition.some((i) => i.id === target.id)) {
        let positionHit = computerB.querySelector(`[id='${target.id}']`);
        let ship = positionHit.classList;
        computerShipsAttacked.push(ship[1]);
        let bullseye = document.createElement("span");
        bullseye.innerText = "radio_button_checked";
        bullseye.classList.add("material-symbols-outlined");
        bullseye.classList.add("small");
        positionHit.appendChild(bullseye);
        let search = "hit";
        getPics(search);
        playerSinks();
      } else {
        let positionHit = computerB.querySelector(`[id='${target.id}']`);
        let missed = document.createElement("span");
        missed.innerText = "radio_button_unchecked";
        missed.classList.add("material-symbols-outlined");
        missed.classList.add("small");
        missed.classList.add("transparent");
        positionHit.appendChild(missed);
        let search = "missed";
        getPics(search);
      }
      if (victory === true) {
        alertDisplay.innerHTML = `ENEMY HAS BEEN CONQUERED in ${Math.floor(
          turnNumber
        )} turns!`;
        playerLeaderboard.push(Math.floor(turnNumber));
        localStorage.setItem(
          "playerWinnings",
          JSON.stringify(playerLeaderboard)
        );
        let search = "victory";
        getPics(search);
        setTimeout(() => {leaderboards()},2000)
        return;
      } else {
        turnNumber += 0.5;
        turnIndicator = "computer";
        computerMove();
      }
    }
  }
}

// check winning conditions

let playerSinked = [];
let computerSinked = [];
let victory;

function playerSinks() {
  let patrol = computerShipsAttacked.filter((i) => i === "patrolC");
  let destroyer = computerShipsAttacked.filter((i) => i === "destroyerC");
  let submarine = computerShipsAttacked.filter((i) => i === "submarineC");
  let battleship = computerShipsAttacked.filter((i) => i === "battleshipC");
  let carrier = computerShipsAttacked.filter((i) => i === "carrierC");
  if (patrol.length === 2) {
    let alertDisplay = document.querySelector(".alerts");
    alertDisplay.innerHTML = "ENEMY PATROL SHIP SINKED!";
    let patrolShip = Array.from(computerB.querySelectorAll(".patrolC"));
    patrolShip.forEach((i) => i.classList.remove("squareHide"));
    computerSinked.push("patrol");
    computerShipsAttacked = computerShipsAttacked.filter(
      (i) => !patrol.includes(i)
    );
    let search = "sinked";
    getPics(search);
    victory = wonGame();
  } else if (destroyer.length === 3) {
    let alertDisplay = document.querySelector(".alerts");
    alertDisplay.innerHTML = "ENEMY DESTROYER SINKED!";
    let destroyerShip = Array.from(computerB.querySelectorAll(".destroyerC"));
    destroyerShip.forEach((i) => i.classList.remove("squareHide"));
    computerSinked.push("destroyer");
    computerShipsAttacked = computerShipsAttacked.filter(
      (i) => !destroyer.includes(i)
    );
    let search = "sinked";
    getPics(search);
    victory = wonGame();
  } else if (submarine.length === 3) {
    let alertDisplay = document.querySelector(".alerts");
    alertDisplay.innerHTML = "ENEMY SUBMARINE SINKED!";
    let submarineShip = Array.from(computerB.querySelectorAll(".submarineC"));
    submarineShip.forEach((i) => i.classList.remove("squareHide"));
    computerSinked.push("submarine");
    computerShipsAttacked = computerShipsAttacked.filter(
      (i) => !submarine.includes(i)
    );
    let search = "sinked";
    getPics(search);
    victory = wonGame();
  } else if (battleship.length === 4) {
    let alertDisplay = document.querySelector(".alerts");
    alertDisplay.innerHTML = "ENEMY BATTLESHIP SINKED!";
    let battleshipShip = Array.from(computerB.querySelectorAll(".battleshipC"));
    battleshipShip.forEach((i) => i.classList.remove("squareHide"));
    computerSinked.push("battleship");
    computerShipsAttacked = computerShipsAttacked.filter(
      (i) => !battleship.includes(i)
    );
    let search = "sinked";
    getPics(search);
    victory = wonGame();
  } else if (carrier.length === 5) {
    let alertDisplay = document.querySelector(".alerts");
    alertDisplay.innerHTML = "ENEMY CARRIER SINKED!";
    let carrierShip = Array.from(computerB.querySelectorAll(".carrierC"));
    carrierShip.forEach((i) => i.classList.remove("squareHide"));
    computerSinked.push("carrier");
    computerShipsAttacked = computerShipsAttacked.filter(
      (i) => !carrier.includes(i)
    );
    let search = "sinked";
    getPics(search);
    victory = wonGame();
  }
  return victory;
}

function computerSinks() {
  let patrol = playerShipsAttacked.filter((i) => i === "patrolC");
  let destroyer = playerShipsAttacked.filter((i) => i === "destroyerC");
  let submarine = playerShipsAttacked.filter((i) => i === "submarineC");
  let battleship = playerShipsAttacked.filter((i) => i === "battleshipC");
  let carrier = playerShipsAttacked.filter((i) => i === "carrierC");
  if (patrol.length === 2) {
    let alertDisplay = document.querySelector(".alerts");
    alertDisplay.innerHTML = "ENEMY SINKED PATROL SHIP!";
    let patrolShip = Array.from(playerB.querySelectorAll(".patrolC"));
    patrolShip.forEach((i) => i.classList.add("sinked"));
    document.querySelector(".alertpatrol").classList.remove("patrolC")
    playerSinked.push("patrol");
    playerShipsAttacked = playerShipsAttacked.filter(
      (i) => !patrol.includes(i)
    );
    let search = "sinked";
    getPics(search);
    victory = wonGame();
  } else if (destroyer.length === 3) {
    let alertDisplay = document.querySelector(".alerts");
    alertDisplay.innerHTML = "ENEMY SINKED DESTROYER!";
    let destroyerShip = Array.from(playerB.querySelectorAll(".destroyerC"));
    destroyerShip.forEach((i) => i.classList.add("sinked"));
    document.querySelector(".alertdestroyer").classList.remove("destroyerC")
    playerSinked.push("destroyer");
    playerShipsAttacked = playerShipsAttacked.filter(
      (i) => !destroyer.includes(i)
    );
    let search = "sinked";
    getPics(search);
    victory = wonGame();
  } else if (submarine.length === 3) {
    let alertDisplay = document.querySelector(".alerts");
    alertDisplay.innerHTML = "ENEMY SINKED SUBMARINE!";
    let submarineShip = Array.from(playerB.querySelectorAll(".submarineC"));
    submarineShip.forEach((i) => i.classList.add("sinked"));
    document.querySelector(".alertsubmarine").classList.remove("submarineC")
    playerSinked.push("submarine");
    playerShipsAttacked = playerShipsAttacked.filter(
      (i) => !submarine.includes(i)
    );
    let search = "sinked";
    getPics(search);
    victory = wonGame();
  } else if (battleship.length === 4) {
    let alertDisplay = document.querySelector(".alerts");
    alertDisplay.innerHTML = "ENEMY SINKED BATTLESHIP!";
    let battleshipShip = Array.from(playerB.querySelectorAll(".battleshipC"));
    battleshipShip.forEach((i) => i.classList.add("sinked"));
    document.querySelector(".alertbattleship").classList.remove("battleshipC")
    playerSinked.push("battleship");
    playerShipsAttacked = playerShipsAttacked.filter(
      (i) => !battleship.includes(i)
    );
    let search = "sinked";
    getPics(search);
    victory = wonGame();
  } else if (carrier.length === 5) {
    let alertDisplay = document.querySelector(".alerts");
    alertDisplay.innerHTML = "ENEMY SINKED CARRIER!";
    let carrierShip = Array.from(playerB.querySelectorAll(".carrierC"));
    carrierShip.forEach((i) => i.classList.add("sinked"));
    document.querySelector(".alertcarrier").classList.remove("carrierC")
    playerSinked.push("carrier");
    playerShipsAttacked = playerShipsAttacked.filter(
      (i) => !carrier.includes(i)
    );
    let search = "sinked";
    getPics(search);
    victory = wonGame();
  }
  return victory;
}

function wonGame() {
  if (computerSinked.length === 5 || playerSinked.length === 5) {
    return true;
  } else return false;
}

// get giphy

async function getPics(string) {
  let img = document.querySelector(".gif");
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=sye9Ocqb85plxI3fmIkDZF1TvH4wNDhs&s=${string}`,
    { mode: "cors" }
  );
  const picData = await response.json();
  img.src = picData.data.images.original.url;
}
