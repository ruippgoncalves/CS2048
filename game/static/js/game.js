// SetUp
let meta = 2048;

// Access all board cells
let board = [[], [], [], []];

document.addEventListener("DOMContentLoaded", () => {
    for (let i1 = 0; i1 <= 3; i1++) {
        for (let i2 = 0; i2 <= 3; i2++) {
            board[i1][i2] = document.getElementById(i1 * 4 + i2);
        }
    }

    // Run SetUp function
    setup();
});

// Prepare the board (place the number 2 in two board cells)
function setup() {
    let pos1 = Math.round(Math.random() * 15);
    let pos2 = Math.round(Math.random() * 15);

    // Ensure that pos1 and pos2 are differents
    while (pos1 === pos2) {
        pos2 = Math.round(Math.random() * 15);
    }

    board[Math.floor(pos1 / 4)][pos1 % 4].innerText = 2;
    board[Math.floor(pos2 / 4)][pos2 % 4].innerText = 2;
}

// -------------------------
// Input
// Touch
let touchMoves = [];
// Track First Touch
document.ontouchstart = touchMove => {
    touchMoves["x"] = touchMove.changedTouches[0].clientX;
    touchMoves["y"] = touchMove.changedTouches[0].clientY;
}

// Identify Move
document.ontouchend = touchMove => {
    let x = touchMove.changedTouches[0].clientX;
    let y = touchMove.changedTouches[0].clientY;
    let touchMove2key;

    // Prevent clicks
    if (touchMoves["x"] == x && touchMoves["y"] == y) { return }

    // Identify x or y move
    if (Math.abs(touchMoves["x"] - x) > Math.abs(touchMoves["y"] - y)) {
        // left / right
        if (x < touchMoves["x"]) {
            touchMove2key = "Left";
            mov = [-1, 0];
        } else {
            touchMove2key = "Right";
            mov = [1, 0];
        }
    } else {
        // up / down
        if (y < touchMoves["y"]) {
            touchMove2key = "Up";
            mov = [0, -1];
        } else {
            touchMove2key = "Down";
            mov = [0, 1];
        }
    }

    // Debug the pressed key
    console.debug("Key: " + touchMove2key);

    move(mov);
}

// Controls the arrows
document.onkeydown = key => {
    /*
        Key         Code
        left arrow	37
        up arrow	38
        right arrow	39
        down arrow	40
    */

    let keyPressed, mov;

    // Identify the key
    switch (key.keyCode) {
        case 37:
            keyPressed = "Left";
            mov = [-1, 0];
            break;
        case 38:
            keyPressed = "Up";
            mov = [0, -1];
            break;
        case 39:
            keyPressed = "Right";
            mov = [1, 0];
            break;
        case 40:
            keyPressed = "Down";
            mov = [0, 1];
            break;

        default:
            // Prevent moves if key is invalid
            return;
    }

    // Debug the pressed key
    console.debug("Key: " + keyPressed);

    move(mov);
}

// -------------------------
// Core/Output
function move(mov) {
    // Calculate the new Board
    let movs = 0;
    let biggest = 0;
    for (let i = 0; i <= 2; i++) {

        // Left/Right
        // Check if can make a move
        function movLeftRight(i) {
            if (mov[0] === 0) { return false }

            return i <= 3 && i >= 0;
        }

        // Calculate the new Board Display
        for (let i1 = 0; i1 <= 3; i1++) {
            for (let i2 = mov[0] === -1 ? 3 : 0; movLeftRight(i2); i2 += mov[0]) {
                if (board[i1][i2].innerText) {
                    temp = mov[0];

                    if (i2 + temp < 0 || i2 + temp > 3) { continue }
                    while (!board[i1][i2 + temp].innerText) {
                        if (i2 + temp - mov[0] === 4) { break }
                        board[i1][i2 + temp].innerText = board[i1][i2 + temp - mov[0]].innerText;
                        board[i1][i2 + temp - mov[0]].innerText = "";
                        temp++;
                        movs = 1;

                        if (i2 + temp < 0 || i2 + temp > 3) { break }
                    }
                }
            }
        }

        // Up/Down
        // Check if can make a move
        function movUpDown(i) {
            if (mov[1] === 0) { return false }

            return i >= 0 && i <= 3;
        }

        // Calculate the moves
        for (let i1 = mov[1] === -1 ? 3 : 0; movUpDown(i1); i1 += mov[1]) {
            for (let i2 = 0; i2 <= 3; i2++) {
                if (board[i1][i2].innerText) {
                    temp = mov[1];

                    if (i1 + temp < 0 || i1 + temp > 3) { continue }
                    while (!board[i1 + temp][i2].innerText) {
                        if (i1 + temp - mov[1] === 4) { break }
                        board[i1 + temp][i2].innerText = board[i1 + temp - mov[1]][i2].innerText;
                        board[i1 + temp - mov[1]][i2].innerText = "";
                        temp++;
                        movs = 1;

                        if (i1 + temp < 0 || i1 + temp > 3) { break }
                    }
                }
            }
        }
    }

    // Calculate Joins
    {
        let pos = [];

        for (let i = 0; i <= 1; i++) {
            // Left/Right
            // Check if can make a move
            function movLeftRight(i) {
                if (mov[0] === 0) { return false }

                if (mov[0] === -1) {
                    return i < 3;
                } else {
                    return i > 0;
                }
            }

            // Calculate the new Board Display
            for (let i1 = 0; i1 <= 3; i1++) {
                for (let i2 = mov[0] === -1 ? 0 : 3; movLeftRight(i2); i2 -= mov[0]) {
                    if (board[i1][i2].innerText) {
                        // Join Numbers
                        if (board[i1][i2].innerText === board[i1][i2 - mov[0]].innerText && pos[i1] != i2 && pos[i1] != i2 - mov[0]) {
                            board[i1][i2].innerText = board[i1][i2 - mov[0]].innerText * 2;
                            board[i1][i2 - mov[0]].innerText = "";
                            pos[i1] = i2;
                            movs = 1;

                            // Biggest number
                            let value = parseInt(board[i1][i2].innerText);
                            if (value > biggest) { biggest = value }

                            for (let i3 = i2 - mov[0]; i3 >= 1 && i3 <= 2; i3 -= mov[0]) {
                                board[i1][i3].innerText = board[i1][i3 - mov[0]].innerText;
                                board[i1][i3 - mov[0]].innerText = "";
                            }

                            break;
                        }
                    }
                }
            }

            // Up/Down
            // Check if can make a move
            function movUpDown(i) {
                if (mov[1] === 0) { return false }

                if (mov[1] === -1) {
                    return i < 3;
                } else {
                    return i > 0;
                }
            }

            // Calculate the moves
            for (let i2 = 0; i2 <= 3; i2++) {
                for (let i1 = mov[1] === -1 ? 0 : 3; movUpDown(i1); i1 -= mov[1]) {
                    if (board[i1][i2].innerText) {
                        // Join Numbers
                        if (board[i1][i2].innerText === board[i1 - mov[1]][i2].innerText && pos[i2] != i1 && pos[i2] != i1 - mov[1]) {
                            board[i1][i2].innerText = board[i1 - mov[1]][i2].innerText * 2;
                            board[i1 - mov[1]][i2].innerText = "";
                            pos[i2] = i1;
                            movs = 1;

                            // Biggest number
                            let value = parseInt(board[i1][i2].innerText);
                            if (value > biggest) { biggest = value }

                            for (let i3 = i1 - mov[1]; i3 >= 1 && i3 <= 2; i3 -= mov[1]) {
                                board[i3][i2].innerText = board[i3 - mov[1]][i2].innerText;
                                board[i3 - mov[1]][i2].innerText = "";
                            }

                            break;
                        }
                    }
                }
            }
        }
    }

    // GameOver Test
    function gameoverTest() {
        for (let i1 = 0; i1 <= 3; i1++) {
            for (let i2 = 0; i2 <= 2; i2++) {
                if (!(board[i1][i2].innerText && board[i1][i2 + 1].innerText)) { return false }
                if (board[i1][i2].innerText == board[i1][i2 + 1].innerText) { return false }

                if (i1 === 3) { continue }

                if (board[i1][i2].innerText == board[i1 + 1][i2].innerText) { return false }
            }
        }

        return true;
    }

    // Create another Piece
    // Game Over/No Moves
    if (movs === 0) {
        if (gameoverTest()) { window.alert("Game Over") }
        return;
    }

    // Win
    if (biggest === meta) {
        window.alert("You won!");
        if (biggest === 65536) { window.alert("Your travel has been finished, you've arrived the biggest possible number!!!") }

        meta *= 2;
        cronoSend(biggest);
    }

    let gen = false;
    let pos;

    while (!gen) {
        pos = Math.round(Math.random() * 15);

        if (!board[Math.floor(pos / 4)][pos % 4].innerText) { gen = true }
    }

    board[Math.floor(pos / 4)][pos % 4].innerText = 2;
}
