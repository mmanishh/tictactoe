'use strict'
var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
var humanPlayer = "X";
var aiPlayer = "O";
var iter = 0;
var round = 0;
var delayMessage = 1500; // delay to show msg

$(document).ready(function () {
    // adding <div class="item" id=${index}></div>
    $.each(board, function (index, value) {
        var item = $(`<div class="item" id=${index}></div>`)
        $(".container-game").append(item);
    });

    $(".item").click(function () {
        move(this, humanPlayer);
    })
});



function move(element, player) {
    if (board[element.id] != humanPlayer && board[element.id] != aiPlayer) {
        round++;
        writeText(element, humanPlayer);
        board[element.id] = player;

        if (winning(board, player)) {
            setTimeout(function () {
                alert("You won , wow!");
                reset();
            }, delayMessage);
            return;
        } else if (round > 8) {
            setTimeout(function () {
                alert("TIE. You cant beat me!");
                reset();
            }, delayMessage);
            return;
        } else {
            round++;
            var index = minimax(board, aiPlayer).index;
            var selector = "#" + index;
            setTimeout(function () {
                writeText(selector, aiPlayer);
            }, 500);

            board[index] = aiPlayer;

            if (winning(board, aiPlayer)) {
                setTimeout(function () {
                    alert("You lost!");
                    reset();
                }, delayMessage);
                return;
            } else if (round === 0) {
                setTimeout(function () {
                    alert("TIE. You cant beat me!");
                    reset();
                }, delayMessage);
                return;
            }
        }
    }
}

function reset() {
    round = 0;
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    $(".item").empty();
}

function writeText(element, text) {
    //$(element).css("background-color", "#efdfgh");
    $(element).append(`<p>${text}</p>`)
}


// the main minimax function
function minimax(newBoard, player) {

    //keep track of function calls;
    iter++;
    //available spots
    var availSpots = emptyIndexies(newBoard);

    // checks for the terminal states such as win, lose, and tie and returning a value accordingly
    if (winning(newBoard, humanPlayer)) {
        return { score: -10 };
    }
    else if (winning(newBoard, aiPlayer)) {
        return { score: 10 };
    }
    else if (availSpots.length === 0) {
        return { score: 0 };
    }

    // an array to collect all the objects
    var moves = [];

    // loop through available spots
    for (var i = 0; i < availSpots.length; i++) {
        //create an object for each and store the index of that spot that was stored as a number in the object's index key
        var move = {};
        move.index = newBoard[availSpots[i]];

        // set the empty spot to the current player
        newBoard[availSpots[i]] = player;

        //if collect the score resulted from calling minimax on the opponent of the current player
        if (player == aiPlayer) {
            var result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        }
        else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        //reset the spot to empty
        newBoard[availSpots[i]] = move.index;

        // push the object to the array
        moves.push(move);
    }

    // if it is the computer's turn loop over the moves and choose the move with the highest score
    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        // else loop over the moves and choose the move with the lowest score
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    // return the chosen move (object) from the array to the higher depth
    return moves[bestMove];
}

// returns the available spots on the board
function emptyIndexies(board) {
    return board.filter(s => s != "O" && s != "X");
}

// winning combinations using the board indexies for instace the first win could be 3 xes in a row
function winning(board, player) {
    if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
    ) {
        return true;
    } else {
        return false;
    }
}
