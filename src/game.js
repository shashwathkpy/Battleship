// Main Game Loop
import Gameboard from './Gameboard.js';
import Ship from './Ship.js';
import Player from './Player.js';


const playerBoard = new Gameboard();
playerBoard.placeShip([1,1], false, 5);
playerBoard.placeShip([3,4], false, 4);
playerBoard.placeShip([6,5], true, 3);
playerBoard.placeShip([5,1], false, 3);
playerBoard.placeShip([8,1], true, 2);

const computerBoard = new Gameboard();
computerBoard.placeShip([0,0], true, 5);
computerBoard.placeShip([3,4], false, 4);
computerBoard.placeShip([6,8], true, 3);
computerBoard.placeShip([6,2], false, 3);
computerBoard.placeShip([0,5], true, 2);

const computer = new Player(playerBoard);
const player = new Player(computerBoard);

function battleship()
{
    setupBoard(playerBoard);
    setupBoard(computerBoard);

    console.log(playerBoard.allSunk());
    // while(!playerBoard.allSunk())
    // {
    // 
    // }
}

battleship();

function setupBoard(gb)
{
    const boardDiv = document.createElement('div');
    if(document.getElementsByClassName('board').length == 0)
        boardDiv.id = '1';
    else
        boardDiv.id = '2';
    boardDiv.classList.add('board');
    const body = document.querySelector('body');
    body.appendChild(boardDiv);

    for(let i = 0; i < gb.board.length; i++)
    {
        for(let j = 0; j < gb.board[i].length; j++)
        {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = `${i},${j},${boardDiv.id}`;
            // tile.textContent = playerBoard.board[i][j];
            // tile.textContent = `${i},${j}`;
            if(gb.board[i][j] instanceof Ship)
            {
                tile.classList.add('ship');
            }
            if(boardDiv.id == '2')
            {
                tile.classList.add('computerTile');

                tile.onclick = function ()
                {
                    const playerAttack = player.attack([i,j]);
                    if(playerAttack == 'alreadyHit')
                    {
                        return;
                    }
                    if(playerAttack)
                    {
                        this.style.backgroundColor = 'red';
                    }
                    else
                    {
                        this.style.backgroundColor = 'lightblue';
                    }
                    tile.style.cursor = 'default';
                    const playerTiles = document.querySelectorAll('.playerTile');
                    let computerHit = computer.randomAttack();
                    while(computerHit == 'alreadyHit')
                    {
                        computerHit = computer.randomAttack();
                    }
                    playerTiles.forEach(tile => {
                        const idArray = tile.id.split(',');
                        const coord = [idArray[0],idArray[1]];
                        if(coord == computer.attackedCoord.toString())
                        {
                            if(computerHit)
                            {
                                tile.style.backgroundColor = 'red';
                                computerHit = false;
                            }
                            else
                            {
                                tile.style.backgroundColor = 'lightblue';
                            }
                        }
                    });
                    if(playerBoard.allSunk() || computerBoard.allSunk())
                    {
                        console.log('Game Over');
                        const computerTiles = document.querySelectorAll('.computerTile');
                        computerTiles.forEach(tile => {
                            tile.onclick = null;
                            tile.classList.remove('computerTile');
                        });
                    }
                };
            }
            else
            {
                tile.classList.add('playerTile');
            }
            boardDiv.appendChild(tile);
        }
    }
}


// function playGame()
// {
//     const playerBoard = new Gameboard();
//     playerBoard.placeShip([1,1], false, 5);
//     playerBoard.placeShip([3,4], false, 4);
//     playerBoard.placeShip([6,5], true, 3);
//     playerBoard.placeShip([5,1], false, 3);
//     playerBoard.placeShip([8,1], true, 2);

//     const computerBoard = new Gameboard();
//     computerBoard.placeShip([0,0], true, 5);
//     computerBoard.placeShip([3,4], false, 4);
//     computerBoard.placeShip([6,8], true, 3);
//     computerBoard.placeShip([6,2], false, 3);
//     computerBoard.placeShip([0,5], true, 2);

//     const playerBoardDiv = document.createElement('div');
//     playerBoardDiv.id = '1';
//     playerBoardDiv.classList.add('board');
//     const body = document.querySelector('body');
//     body.appendChild(playerBoardDiv);

//     const computerBoardDiv = document.createElement('div');
//     computerBoardDiv.id = '2';
//     computerBoardDiv.classList.add('board');
//     body.appendChild(computerBoardDiv);

//     for(let i = 0; i < playerBoard.board.length; i++)
//     {
//         for(let j = 0; j < playerBoard.board[i].length; j++)
//         {
//             const tile = document.createElement('div');
//             tile.classList.add('tile');
//             tile.classList.add('playerTile');
//             tile.id = `${i},${j},${playerBoardDiv.id}`;
//             tile.textContent = `${i},${j}`;
//             if(playerBoard.board[i][j] instanceof Ship)
//             {
//                 tile.classList.add('ship');
//             }
//             playerBoardDiv.appendChild(tile);
//         }
//     }

//     for(let i = 0; i < computerBoard.board.length; i++)
//     {
//         for(let j = 0; j < computerBoard.board[i].length; j++)
//         {
//             const tile = document.createElement('div');
//             tile.classList.add('tile');
//             tile.classList.add('computerTile');
//             tile.id = `${i},${j},${computerBoardDiv.id}`;
//             tile.textContent = `${i},${j}`;
//             if(computerBoard.board[i][j] instanceof Ship)
//             {
//                 tile.classList.add('ship');
//             }
//             tile.onclick = function ()
//                 {
//                     if(player.attack([i,j]))
//                     {
//                         this.style.backgroundColor = 'red';
//                     }
//                     else
//                     {
//                         this.style.backgroundColor = 'lightblue';
//                     }
//                     const playerTiles = document.querySelectorAll('.playerTile');
//                     let hasHit = computer.randomAttack();
//                     while(hasHit == 'alreadyHit')
//                     {
//                         hasHit = computer.randomAttack();
//                     }
            
//                     playerTiles.forEach(tiles => {
//                         const idArray = tiles.id.split(',');
//                         const coord = [idArray[0],idArray[1]];
//                         if(coord == computer.attackedCoord.toString())
//                         {
//                             if(hasHit)
//                             {
//                                 tiles.style.backgroundColor = 'red';
//                                 hasHit = false;
//                             }
//                             else
//                             {
//                                 tiles.style.backgroundColor = 'lightblue';
//                             }
//                         }
//                     });
//                 };
//             computerBoardDiv.appendChild(tile);
//         }
//     }

// }

// playGame();