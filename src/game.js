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

    const instruction = document.querySelector('#instruction');
    instruction.textContent = 'Place your ships';
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
                    body.removeChild(rotateBtn);
                    setupBoard(playerBoard);
                    setupBoard(computerBoard);
                    instruction.textContent = 'Shoot an enemy tile.'
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
                tile.textContent = `${i},${j}`;
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
                        console.log(computer.possibleAttacks);
                        const playerAttack = player.attack([i,j]);
                        tile.style.cursor = 'default';
                        if(playerAttack == 'alreadyHit')
                        {
                            return;
                        }
                        if(playerAttack)
                        {
                            this.style.backgroundColor = 'red';
                            instruction.textContent = 'You hit an enemy ship, shoot again!';
                        }
                        else
                        {   
                            instruction.textContent = 'Shoot an enemy tile.'
                            this.style.backgroundColor = 'lightblue';
                            const playerTiles = document.querySelectorAll('.playerTile');
                            let previousHit = true;
                            let smartHit = false;
                            while(previousHit)
                            {
                                let computerHit = computer.randomAttack();
                                if(smartHit)
                                    computerHit = computer.smartAttack(previousHit);
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
                                            previousHit = coord;
                                            smartHit = true;
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
                            if(computerBoard.allSunk())
                                instruction.textContent = 'Congratulations, you sank all the enemy ships!';
                            else
                                instruction.textContent = 'All your ships have sank, we need a better strategy.';
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


// computer attack new strat
// create a stack in random order of all possible attacks
// pop from stack to use an attack
// if hit add adjacent attacks to stack
// attack adjacent till one hits
// when an adjacent hits, follow the pattern of direction till ship sinks or miss
// remove wrong-direction adjacents
// if miss go to the initial hit and go the opposite direction till ship sinks
// pop already used attacks without using them again
// hit the next random attack
// repeat this till either player or computer wins