function Player(name, mark){

    const getToken = () => mark;
    const getName = () => name;

    return{
        getToken,
        getName,
    }
}

function Cell(){
    let value = "";

    const addToken = (player) => value = player.getToken();

    const getValue = () => value;

    return {
        addToken,
        getValue,
    }
}

function Gameboard() {
    
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i< rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(Cell());
        }

    }

    const getBoard = () => board;

    const markCell = (row,column,player) => {

        let cell = board.at(row).at(column);
        if (cell.getValue().trim().length !== 0){
            return false;
        }
        cell.addToken(player);
        return true;
        
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        //uncomment for play game in console
        //console.log(boardWithCellValues);
    }
    
    return {
        getBoard,
        markCell,
        printBoard,
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    let roundNumber = 0;
    let winner;

    const board = Gameboard();

    const players = [
        Player(playerOneName, "X"),
        Player(playerTwoName, "O")
    ];

    let activePlayer = players.at(0);

    const switchPlayer = () => activePlayer = activePlayer === players.at(0) ? players.at(1) : players.at(0);

    const getActivePlayer = () => activePlayer;

    const printNewRound = () =>{
        board.printBoard();
        console.log(`${getActivePlayer().getName()}'s turn`);
    };
    const rowWinner  = () =>{
        let row;
        board.getBoard().forEach((element) => {
            const val = element.at(0).getValue();
            if ( val!== ""){
                const val1 = element.at(1).getValue();
                const val2 = element.at(2).getValue();
                if (val === val1 && val === val2){
                    row = element;
                }
            }
        });
        return row;
    };

    const colWinner  = () =>{
        
        let element;
        for (i = 0; i <= 2; i++){
            const val = board.getBoard().at(0).at(i).getValue();
            if ( val!== ""){
                const val1 = board.getBoard().at(1).at(i).getValue();
                const val2 = board.getBoard().at(2).at(i).getValue();
                if (val === val1 && val === val2){
                    element = board.getBoard().at(0);
                }
            }
        }
        return element;
    };

    const diagWinner  = () =>{
        
        let element;
        const valLeft = board.getBoard().at(0).at(0).getValue();
        const valRight = board.getBoard().at(0).at(2).getValue();
        let val1;
        let val2;
        if (valLeft !== ""){
            val1 = board.getBoard().at(1).at(1).getValue();
            val2 = board.getBoard().at(2).at(2).getValue();
            if (valLeft === val1 && valLeft === val2){
                element = board.getBoard().at(0);
            return element;
            }
        }
        if(valRight !== ""){
            val1 = board.getBoard().at(1).at(1).getValue();
            val2 = board.getBoard().at(2).at(0).getValue();
            if(valRight === val1 && valRight === val2){
                element = board.getBoard().at(0);
            return element;
            }
        }
    };

    const playRound = (row,column) => {
        let won = false;
        ++roundNumber;
        //uncomment for play game in console
        //console.log(`Putting ${getActivePlayer().getToken()} into ${row},${column}.`);
        let full = board.markCell(row,column,getActivePlayer());
        if (!full){
            //uncomment for play game in console
            //printNewRound();
            return false;
        }

        if (roundNumber >= 5){
            winner = rowWinner();
            if (winner !== undefined){
                won = true;
            }else{
                winner = colWinner();
            }
            if (winner !== undefined){
                won = true;
            }else{
                winner = diagWinner()
            }
            if (winner !== undefined){
                won = true;
            }
            if (won){
                //uncomment for play game in console
                //console.log(`${getActivePlayer().getName()} won`);
                //board.printBoard();
                return 1;
            }
            
        }
        if (roundNumber === 9 && !won){
            console.log(`Tied`);
            //board.printBoard();
            return 0;
        }
        switchPlayer();
        //printNewRound();
        return -1;
      
        
        
    };
    //printNewRound();
    


    return {
        getActivePlayer,
        playRound,
        getBoard: board.getBoard,
    }
}

function ScreenController() {
    let gameController;
    const gameContainer = document.querySelector(".game-container");
    const newGameDiv = document.querySelector(".new-game-form");
    const playerTurnDiv = document.querySelector(".turn-container");
    const turn = playerTurnDiv.querySelector("h1");
    const boardDiv = document.querySelector(".board-container");
    const gameFinishedDiv = document.querySelector(".game-finished-container");
    const winner = gameFinishedDiv.querySelector("h1");

    let isWinner = false;

    const startGame = (firstPlayer, secondPlayer) => {
        gameController = GameController(firstPlayer, secondPlayer);
    }

    const updateBoard = () => {
        boardDiv.textContent = "";
        const activePlayer = gameController.getActivePlayer();
        turn.textContent = `${activePlayer.getName()}'s turn...`;
        const currentBoard = gameController.getBoard();

        for (let i = 0; i <= 2; i++){
            for(let j = 0; j <= 2; j++){
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                let val = currentBoard.at(i).at(j).getValue();
                cellButton.textContent = currentBoard.at(i).at(j).getValue();
                boardDiv.appendChild(cellButton);
            }
        }
        
        
    };

    const updateScreen = (action = "") => {

        switch (action) {
            case "new-game":
                gameContainer.innerHTML = "";
                gameContainer.appendChild(newGameDiv);
            break;
            case "create-new-game":
                gameContainer.innerHTML = "";
                isWinner = false;
                gameContainer.appendChild(playerTurnDiv);
                gameContainer.appendChild(boardDiv);
                updateBoard();
            break;
            case "game-finished":
                gameContainer.innerHTML = "";
                gameContainer.appendChild(gameFinishedDiv);
                gameContainer.appendChild(boardDiv);
                updateBoard();
            break;
            default:
                gameContainer.innerHTML = "";
                const form = newGameDiv.querySelector("form");
                form.elements[1].value = "";
                form.elements[2].value = "";
            break;
        }
    };

    function clickHandlerBoard(e){
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if (!selectedRow || !selectedColumn || isWinner === 0 || isWinner === 1){
            return;
        }
        isWinner = gameController.playRound(selectedRow,selectedColumn);
        if (isWinner === 1){
            const activePlayer = gameController.getActivePlayer();
            winner.innerHTML = `${activePlayer.getName()} won!`;
            updateScreen(gameFinishedDiv.id);
            return;
        }
        if (isWinner === 0){
            winner.innerHTML = `Tied!`;
            updateScreen(gameFinishedDiv.id);
        }
        
        updateBoard();  
    };

    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();

    return {
        updateScreen,
        startGame,
    }
}

const a = ScreenController();

const showNewGameForm = ((e) => a.updateScreen(e.target.id));

const cancelGame = (() => a.updateScreen());

const newGame = ((e) => {

    e.preventDefault();
    let firstPlayer = e.target.elements[1].value;
    let secondPlayer = e.target.elements[2].value;
    const newGame = e.target.elements[4].id;
    if (firstPlayer === ""){
        firstPlayer = undefined;
    }
    if (secondPlayer === ""){
        secondPlayer = undefined;
    }
    a.startGame(firstPlayer, secondPlayer);
    a.updateScreen(newGame);
});


/*
 let a = GameController();
 let won = false;
 out:
 for (let indexI = 0; indexI<= 2; indexI++){
    for (indexJ = 0; indexJ<= 2; indexJ++){
        won = a.playRound(indexI,indexJ);
        if (won){
            break out;
        }
    }
 }
  console.log(won);

  let b = ScreenController();
  b.updateBoard();
   */
 

