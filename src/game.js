// Main Game Loop
import Gameboard from './Gameboard.js';
import Ship from './Ship.js';
import Player from './Player.js';

function battleship()
{
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

    setupBoard(playerBoard);
    setupBoard(computerBoard);
    const computer = new Player(playerBoard);
    const player = new Player(computerBoard);
    
    console.log(playerBoard.allSunk());
    while(!playerBoard.allSunk())
    {
        const playerTiles = document.querySelectorAll('.playerTile');
        let hasHit = computer.randomAttack();
        while(hasHit == 'alreadyHit')
        {
            hasHit = computer.randomAttack();
        }

        playerTiles.forEach(tile => {
            const idArray = tile.id.split(',');
            const coord = [idArray[0],idArray[1]];
            if(coord == computer.attackedCoord.toString())
            {
                if(hasHit)
                {
                    tile.style.backgroundColor = 'red';
                    hasHit = false;
                }
                else
                {
                    tile.style.backgroundColor = 'lightblue';
                }
            }
        });
    }
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
            tile.textContent = `${i},${j}`;
            if(gb.board[i][j] instanceof Ship)
            {
                tile.classList.add('ship');
            }
            if(boardDiv.id == '2')
            {
                tile.classList.add('computerTile');
                tile.onclick = function ()
                {
                    if(player.attack([i,j]))
                    {
                        this.style.backgroundColor = 'red';
                    }
                    else
                    {
                        this.style.backgroundColor = 'lightblue';
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


function attack(tileID)
{
    const idArray = tileID.split(',');
    const coord = [idArray[0],idArray[1]];
    const boardID = [idArray[2]];
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        if(tile.id == tileID && boardID == '2')
        {
            if(computerBoard.recieveAttack(coord))
            {
                tile.style.backgroundColor = 'red';
            }
            else
            {
                tile.style.backgroundColor = 'lightblue';
            }
            tile.onclick = null;
        }
    });
}