const Ship = require('./ship.js');

let grid = [];
for(let i = 0; i < 10; i++)
{
    grid.push([]);
    for(let j = 0; j < 10; j++)
    {
        // grid[i].push(j+(i*10));
        grid[i].push(null);
    }
}

class gameboard
{
    constructor()
    {
        this.board = grid;
        this.attacks = [];
        this.misses = [];
    }

    placeShip(startCoord, vertical, length)
    {
        const ship = new Ship(length);
        let shipDetected = false;
        const row = startCoord[0];
        const col = startCoord[1];

        if(vertical)
        {
            if(row + ship.length <= this.board.length)
            {
                for(let i = 0; i < ship.length; i++)
                {
                    if(this.board[row+i][col])
                    {
                        shipDetected = true;
                        console.log('SHIP DETECTED!');
                    }
                }
                if(!shipDetected)
                {
                    for(let i = 0; i < ship.length; i++)
                    {
                        this.getAdjacent(row+i, col);
                        this.board[row+i][col] = ship;
                    }
                }
            }
            else
            {
                console.log('ship out of bounds');
            }
        }
        else
        {
            if(col + ship.length <= this.board.length)
            {
                for(let i = 0; i < ship.length; i++)
                {
                    if(this.board[row][col+i])
                    {
                        shipDetected = true;
                        console.log('SHIP DETECTED!');
                    }
                }
                if(!shipDetected)
                {
                    for(let i = 0; i < ship.length; i++)
                    {
                        this.getAdjacent(row, col+i);
                        this.board[row][col+i] = ship;
                    }
                }
            }
            else
            {
                console.log('ship out of bounds');
            }
        }
    }

    validPos(i, j, n, m) 
    {
        if(i < 0 || j < 0 || i > n - 1 || j > m - 1)
            return 0;
        return 1;
    }
    
    getAdjacent(i, j) 
    {
        let n = this.board.length;
        let m = this.board[0].length;
    
        if(this.validPos(i - 1, j - 1, n, m))
            this.board[i - 1][j - 1] = 1;
        if(this.validPos(i - 1, j, n, m) && !(this.board[i - 1][j] instanceof Ship))
            this.board[i - 1][j] = 1;
        if(this.validPos(i - 1, j + 1, n, m))
            this.board[i - 1][j + 1] = 1;
        if(this.validPos(i, j - 1, n, m) && !(this.board[i][j - 1] instanceof Ship))
            this.board[i][j - 1] = 1;
        if(this.validPos(i, j + 1, n, m) && !(this.board[i][j + 1] instanceof Ship))
            this.board[i][j + 1] = 1;
        if(this.validPos(i + 1, j - 1, n, m))
            this.board[i + 1][j - 1] = 1;
        if(this.validPos(i + 1, j, n, m) && !(this.board[i + 1][j] instanceof Ship))
            this.board[i + 1][j] = 1;
        if(this.validPos(i + 1, j + 1, n, m))
            this.board[i + 1][j + 1] = 1;
    }

    recieveAttack(coord)
    {
        for(let i = 0; i < this.attacks.length; i++)
        {
            if(this.attacks[i][0] == coord[0] && this.attacks[i][1] == coord[1])
            {
                return;
            }
        }

        this.attacks.push(coord);
        if(this.board[coord[0]][coord[1]] instanceof Ship)
        {
            this.board[coord[0]][coord[1]].hit();
        }
        else
        {
            this.misses.push(coord);
            console.log('you missed!');
        }
        // if miss
    }

    allSunk()
    {
        // if all ships sunk return true, else false
        for(let i = 0; i < this.board.length; i++)
        {
            for(let j = 0; j < this.board.length; j++)
            {
                if(this.board[i][j] instanceof Ship && !this.board[i][j].isSunk())
                {
                    return false;
                }
            }
        }
        return true;
    }
}

const gb = new gameboard();
// gb.placeShip([6,5], true, 3);
// gb.placeShip([1,1], false, 5);
gb.placeShip([0,0], false, 3);
gb.recieveAttack([0,0]);
gb.recieveAttack([0,0]);
gb.recieveAttack([0,1]);
gb.recieveAttack([0,2]);
console.log(gb.board);
console.log(gb.allSunk());
