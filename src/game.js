// Main Game Loop
import Gameboard from './Gameboard.js';
import Ship from './Ship.js';
import Player from './Player.js';

function battleShip()
{
    const playerBoard = new Gameboard();
    const computerBoard = new Gameboard();

    for(let i = 5; i > 0; i--)
    {
        let placed = false;
        while(!placed)
        {
            const coord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
            let rotate = Math.random() < 0.5;
            placed = computerBoard.placeShip(coord, rotate, i);
        }
    }

    const computer = new Player(playerBoard);
    const player = new Player(computerBoard);

    const playerBoardDiv = document.createElement('div');
    playerBoardDiv.classList.add('board');
    const body = document.querySelector('body');
    body.appendChild(playerBoardDiv);

    let shipLength = 5;
    const rotateBtn = document.createElement('button');
    rotateBtn.textContent = 'Rotate';
    rotateBtn.id = 'rotateBtn';
    body.appendChild(rotateBtn);

    let vertical = false;
    rotateBtn.onclick = function ()
    {
        vertical = vertical === false ? true : false;
        console.log(vertical);
    }

    for(let i = 0; i < 10; i++)
    {
        for(let j = 0; j < 10; j++)
        {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.id = `${i},${j}`;

            tile.onclick = function ()
            {
                const idArray = this.id.split(',');
                if(playerBoard.placeShip([parseInt(idArray[0]), parseInt(idArray[1])], vertical, shipLength))
                {
                    shipLength -= 1;
                    //update board
                    for(let i = 0; i < 10; i++)
                    {
                        for(let j = 0; j < 10; j++)
                        {
                            if(playerBoard.board[i][j] instanceof Ship)
                            {
                                const tile = document.getElementById(`${i},${j}`);
                                tile.classList.add('playerShip');
                                tile.classList.add('ship');
                            }
                        }
                    }
                }

                if(shipLength == 0)
                {
                    const tiles = document.querySelectorAll('.tile');
                    tiles.forEach(tile => {
                        tile.onclick = null;
                        tile.onmouseenter = null;
                        tile.onmouseleave = null;
                    });
                    body.removeChild(playerBoardDiv);
                    setupBoard(playerBoard);
                    setupBoard(computerBoard);
                }
            }

            tile.onmouseenter = function ()
            {
                const tiles = document.querySelectorAll('.tile');
                for(let i = 0; i < tiles.length; i++)
                {
                    if(vertical)
                    {
                        if(tiles[i].id == this.id && parseInt(this.id[0]) + shipLength <= 10)
                        {
                            for(let j = i; j < shipLength*10 + i; j+=10)
                            {
                                tiles[j].classList.add('placementTile');
                            }
                        }
                    }
                    else
                    {
                        if(tiles[i].id == this.id && parseInt(this.id[2]) + shipLength <= 10)
                        {
                            for(let j = i; j < shipLength + i; j++)
                            {
                                tiles[j].classList.add('placementTile');
                            }
                        }
                    }
                }
            }

            tile.onmouseleave = function ()
            {
                const tiles = document.querySelectorAll('.placementTile');
                tiles.forEach(tile => {
                    tile.classList.remove('placementTile');
                });
            }
            playerBoardDiv.appendChild(tile);
        }
    }

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
                    if(boardDiv.id == '1')
                    {
                        tile.classList.add('playerShip');
                    }
                }
                if(boardDiv.id == '2')
                {
                    tile.classList.add('computerTile');

                    tile.onclick = function ()
                    {
                        const playerAttack = player.attack([i,j]);
                        tile.style.cursor = 'default';
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
                            const playerTiles = document.querySelectorAll('.playerTile');
                            let previousHit = true;
                            while(previousHit)
                            {
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
                                        }
                                        else
                                        {
                                            tile.style.backgroundColor = 'lightblue';
                                            previousHit = false;
                                        }
                                    }
                                });
                            }
                        }
                        
                        
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
}
battleShip();


// computer smart attacks
// has to be able to track a single ship, new ship parameter needed, id or name
// if hit, store ship name, hit adjacent tiles till that ship is sunk
// when ship is sunk make a random move again till next ship hit