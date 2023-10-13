// Main Game Loop
import Gameboard from './Gameboard.js';
import Ship from './Ship.js';
import Player from './Player.js';

function battleShip()
{
    const playerBoard = new Gameboard();
    const computerBoard = new Gameboard();

    let cpuShips = [5,4,3,3,2];
    for(let i = 0; i < cpuShips.length; i++)
    {
        let placed = false;
        while(!placed)
        {
            const coord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
            let rotate = Math.random() < 0.5;
            placed = computerBoard.placeShip(coord, rotate, cpuShips[i]);
        }
    }

    const computer = new Player(playerBoard);
    const player = new Player(computerBoard);

    const playerBoardDiv = document.createElement('div');
    playerBoardDiv.classList.add('board');
    const body = document.querySelector('body');
    const boardArea = document.querySelector('#boardArea');
    boardArea.appendChild(playerBoardDiv);

    let shipSizes = [5,4,3,3,2,0];
    let shipLength = shipSizes.shift();
    const rotateBtn = document.createElement('button');
    rotateBtn.textContent = 'ROTATE';
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
                    shipLength = shipSizes.shift();
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

                if(shipSizes.length == 0)
                {
                    const tiles = document.querySelectorAll('.tile');
                    tiles.forEach(tile => {
                        tile.onclick = null;
                        tile.onmouseenter = null;
                        tile.onmouseleave = null;
                    });
                    boardArea.removeChild(playerBoardDiv);
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
        boardArea.appendChild(boardDiv);
        let previousHit = null;
        let shipArray = [];

        for(let i = 0; i < gb.board.length; i++)
        {
            for(let j = 0; j < gb.board[i].length; j++)
            {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.id = `${i},${j},${boardDiv.id}`;
                // tile.textContent = gb.board[i][j];
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

                    tile.onmouseenter = function ()
                    {
                        this.classList.add('shootHover');
                    }
                    tile.onmouseleave = function ()
                    {
                        this.classList.remove('shootHover');
                    }

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
                            this.classList.add('hit');
                            instruction.textContent = 'You hit an enemy ship, shoot again!';
                        }
                        else
                        {   
                            instruction.textContent = 'Shoot an enemy tile.'
                            this.classList.add('miss');
                            const playerTiles = document.querySelectorAll('.playerTile');
                            let lastShot = true;
                            let smartHit = false;
                            while(lastShot)
                            {
                                let shot = computer.possibleAttacks.pop();
                                let computerHit = computer.attack(shot);
                                while(computerHit == 'alreadyHit')
                                {
                                    computerHit = computer.attack(computer.possibleAttacks.pop());
                                }
                                playerTiles.forEach(tile => {
                                    const idArray = tile.id.split(',');
                                    const coord = [parseInt(idArray[0]), parseInt(idArray[1])];
                                    if(coord == computer.attackedCoord.toString())
                                    {
                                        if(computerHit)
                                        {
                                            console.log(coord);
                                            tile.classList.add('hit');
                                            let currentShip = playerBoard.board[idArray[0]][idArray[1]];
                                            console.log(currentShip);
                                            shipArray.push([coord[0], coord[1]]);
                                            let direction = null;

                                            if(currentShip.hitCount > 1 && !currentShip.sunk)
                                            {
                                                console.log(coord + ', ' + previousHit);

                                                if(previousHit[0] != coord[0])
                                                {
                                                    direction = 'vertical';
                                                    let toBePopped = computer.possibleAttacks.pop();
                                                    if(toBePopped[1] == coord[1])
                                                    {
                                                        computer.possibleAttacks.push(toBePopped);
                                                    }
                                                }

                                                if(previousHit[1] != coord[1])
                                                {
                                                    direction = 'horizontal';
                                                    let toBePopped = computer.possibleAttacks.pop();
                                                    if(toBePopped[0] == coord[0])
                                                    {
                                                        computer.possibleAttacks.push(toBePopped);
                                                    }
                                                }
                                            }

                                            previousHit = coord;
                                            smartHit = true;
                                            let addedAttacks = computer.smartAttack(previousHit, direction);
                                            if(currentShip.sunk)
                                            {
                                                for(let i = 0; i < addedAttacks; i++)
                                                {
                                                    computer.possibleAttacks.pop();
                                                }
                                                for(let i = 0; i < shipArray.length; i++)
                                                {
                                                    console.log("Ship Array:" + shipArray[i][0]);
                                                    playerBoard.justSunk = true;
                                                    playerBoard.getAdjacent(shipArray[i][0], shipArray[i][1]);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            tile.classList.add('miss');
                                            lastShot = false;
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
                                tile.onmouseenter = null;
                            });
                            const restartBtn = document.createElement('button');
                            restartBtn.textContent = 'RESTART';
                            body.appendChild(restartBtn);
                            restartBtn.onclick = function ()
                            {
                                restart();
                                body.removeChild(restartBtn);
                            }
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

function restart()
{
    const boardArea = document.querySelector('#boardArea');
    while(boardArea.childNodes.length > 0)
        boardArea.removeChild(boardArea.lastChild);
    battleShip();
}


// computer attack new strat
// create a stack in random order of all possible attacks
// pop from stack to use an attack
// if hit add adjacent attacks to stack

// attack adjacent till one hits
// when an adjacent hits, follow the pattern of direction till ship sinks or miss

// if next hit and ship not sunk then store direction, and push three in line(unless its the border), pop those till ship sinks or misses
// remove wrong-direction adjacents
// if miss go to the initial hit and go the opposite direction till ship sinks

// pop already used attacks without using them again
// hit the next random attack
// repeat this till either player or computer wins