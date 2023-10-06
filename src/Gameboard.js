import Ship from './Ship.js';

class Gameboard
{
    constructor()
    {
        this.board = this.buildGrid();
        this.attacks = [];
        this.misses = [];
    }

    buildGrid()
    {
        let grid = [];
        for(let i = 0; i < 10; i++)
        {
            grid.push([]);
            for(let j = 0; j < 10; j++)
            {
                grid[i].push(null);
            }
        }
        return grid;
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
                        return false;
                    }
                }
                if(!shipDetected)
                {
                    for(let i = 0; i < ship.length; i++)
                    {
                        this.getAdjacent(row+i, col);
                        this.board[row+i][col] = ship;
                    }
                    return true;
                }
            }
            else
            {
                return false;
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
                        return false;
                    }
                }
                if(!shipDetected)
                {
                    for(let i = 0; i < ship.length; i++)
                    {
                        this.getAdjacent(row, col+i);
                        this.board[row][col+i] = ship;
                    }
                    return true;
                }
            }
            else
            {
                return false;
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
        let n = 10;
        let m = 10;
        let smartAttacks = [];
        
        // left
        if(this.validPos(i, j - 1, n, m))
        {
            smartAttacks.push([i, j-1]);
            if(!(this.board[i][j - 1] instanceof Ship))
                this.board[i][j - 1] = 1;
        }

        // top left
        if(this.validPos(i - 1, j - 1, n, m))
            this.board[i - 1][j - 1] = 1;

        // top
        if(this.validPos(i - 1, j, n, m))
        {
            smartAttacks.push([i-1, j]);
            if(!(this.board[i - 1][j] instanceof Ship))
                this.board[i - 1][j] = 1;
        }

        // top right
        if(this.validPos(i - 1, j + 1, n, m))
            this.board[i - 1][j + 1] = 1;

        // right
        if(this.validPos(i, j + 1, n, m)) 
        {
            smartAttacks.push([i, j+1]);
            if(!(this.board[i][j + 1] instanceof Ship))
                this.board[i][j + 1] = 1;
        }

        // bottom right
        if(this.validPos(i + 1, j + 1, n, m))
            this.board[i + 1][j + 1] = 1;

        // bottom
        if(this.validPos(i + 1, j, n, m))
        {
            smartAttacks.push([i+1,j]);
            if(!(this.board[i + 1][j] instanceof Ship))
                this.board[i + 1][j] = 1;
        }

        // bottom left
        if(this.validPos(i + 1, j - 1, n, m))
            this.board[i + 1][j - 1] = 1;

        return smartAttacks;
    }

    recieveAttack(coord)
    {
        for(let i = 0; i < this.attacks.length; i++)
        {
            if(this.attacks[i][0] == coord[0] && this.attacks[i][1] == coord[1])
            {
                return 'alreadyHit';
            }
        }

        this.attacks.push(coord);
        if(this.board[coord[0]][coord[1]] instanceof Ship)
        {
            this.board[coord[0]][coord[1]].hit();
            return true;
        }
        else
        {
            this.misses.push(coord);
            return false;
        }
    }

    allSunk()
    {
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

export default Gameboard;