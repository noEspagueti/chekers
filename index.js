let piece; // this variable capture the last piece (red or black) that was selected

const board = document.querySelector('.chekers');

// create cells at the board
for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
        const cells = document.createElement('div');
        j % 2 === 0 && i % 2 === 0 || j % 2 !== 0 && i % 2 !== 0 ?
            cells.classList.add('whiteCells') :
            cells.classList.add('blackCells');
        board.appendChild(cells);
    }
}

//select the white cells
let whiteCell = document.querySelectorAll('.whiteCells');

//convert nodeList to Array
whiteCell = Array.from([...whiteCell]);

//convert array 1d to 2d (nxm)
let tableBoard = new Array(8);
for (let i = 0; i < tableBoard.length; i++) {
    tableBoard[i] = new Array(4);
    for (let j = 0; j < tableBoard[i].length; j++) {
        tableBoard[i][j] = whiteCell.shift();
        if (i <= 2) {
            let redParts = document.createElement('div');
            redParts.classList.add('redParts', `${i}${j}`);
            tableBoard[i][j].appendChild(redParts);
        }
        else if (i >= 5) {
            let blackParts = document.createElement('div');
            blackParts.classList.add('blackParts', `${i}${j}`);
            tableBoard[i][j].appendChild(blackParts);
        }
        else {
            const child = document.createElement("div");
            child.classList.add('moves', `${i}${j}`);
            tableBoard[i][j].appendChild(child);
        }
    }
}

//Events delegation
board.addEventListener("click", (event) => {
    let classCells = event.target.classList[0];
    switch (classCells) {
        case "redParts": case "blackParts":
            piece = event.target;
            document.querySelectorAll(".enemyMoves").forEach(item => item.classList.remove("enemyMoves"));
            let [row, col] = event.target.classList[1].split("");
            showPositions(classCells, parseInt(row), parseInt(col), piece);
            break;
        case "moves":
            movePiece(event.target, piece);
            document.querySelectorAll('.moves').forEach(item => item.style.display = "none");
            captureEnemy();
            break;
    }
});

//this function return the positions to the function showPositions
function getPoints(colorPiece, row, col) {
    switch (colorPiece) {
        case "redParts":
            return [[row + 1, row % 2 != 0 ? col + 1 : col - 1], [row + 1, col]];
            break;
        case "blackParts":
            return [[row - 1, col], [row - 1, row % 2 === 0 ? col - 1 : col + 1]]
            break;
        case "captureEnemyRed":
            return [[row + 2, row % 2 != 0 ? col + 1 : col - 1], [row + 2, col + 1]];
            break;
        case "captureEnemyBlack":
            return [[row - 2, col + 1], [row - 2, row % 2 === 0 ? col - 1 : col - 1]]
            break;
    }
}

//This function displays every time a cell that has a piece is clicked
function showPositions(colorPiece, row, col, currentPiece) {
    document.querySelectorAll('.moves').forEach(item => item.style.display = "none");
    let moves = getPoints(colorPiece, row, col);
    moves.map((item) => {
        showPointers(item);
        let currentEnemy = document.getElementsByClassName(`${item.join("")}`);
        if (currentEnemy.length) {
            if (currentEnemy[0].classList[0] !== "moves" && currentEnemy[0].classList[0] !== colorPiece) {
                let setColor = colorPiece === "redParts" ? "captureEnemyRed" : "captureEnemyBlack";
                getEnemyPice(setColor, row, col, true, currentEnemy[0], currentPiece);
            }
        }
    });
}

//this function capture enemy pieces
function getEnemyPice(currentColorPiece, row, col, isCaptureEnemy, enemy, currentPiece) {
    let move = getPoints(currentColorPiece, row, col);
    let indexCurrentPiece = parseInt(currentPiece.classList[1]);
    let indexEnemy = parseInt(enemy.classList[1]);
    let referenceDirection = Math.abs(indexCurrentPiece - indexEnemy);
    move.forEach(item => {
        let currentPointEnemy = document.getElementsByClassName(`${item.join("")}`);
        let pointerEnemy = parseInt(item.join(""));
        let trueDirection = (currentPiece.classList[0] === "redParts" ? indexEnemy + referenceDirection - 1 : indexEnemy - referenceDirection + 1);
        if (currentPointEnemy.length) {
            if ((currentPointEnemy[0].classList[0] === "moves") && (pointerEnemy === trueDirection)) {
                showPointers(item, isCaptureEnemy, enemy);
            }
        }
    });
}

//this function show posinter for each element that was selected
function showPointers(item, isCaptureEnemy, enemy) {
    document.querySelectorAll('.moves').forEach((list) => {
        if (list.classList[1] === item.join("")) {
            list.style.display = "block";
            if (isCaptureEnemy) {
                enemy.classList.add("enemyMoves");
            }
        }
    });
}

//this function delete the enemy selected
function captureEnemy() {
    let enemyPiece = document.getElementsByClassName("enemyMoves");
    if (!!enemyPiece[0]) {
        enemyPiece[0].classList.replace(enemyPiece[0].classList[0], "moves");
        enemyPiece[0].classList.remove("enemyMoves");
    }
}

//this function move the peices
function movePiece(element, lastPiece) {
    let indexElement = element.classList[1];
    let indexPiece = lastPiece.classList[1];
    let parentPiece = lastPiece.parentNode;
    let parentMoves = element.parentNode;
    parentMoves.replaceChild(lastPiece, element);
    parentPiece.appendChild(element);
    lastPiece.classList.replace(indexPiece, indexElement);
    element.classList.replace(indexElement, indexPiece);
}



//by NoEspagueti
//https://github.com/noEspagueti