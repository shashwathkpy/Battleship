
class Player
{
    constructor(enemyBoard)
    {
        this.enemyBoard = enemyBoard;
        this.attackedCoord;
        this.possibleAttacks = this.attackList();
    }

    attackList()
    {
        let attacks = [];
        for(let i = 0; i < 10; i++)
        {
            for(let j = 0; j < 10; j++)
            {
                attacks.push([i,j]);
            }
        }

        attacks = this.scramble(attacks);
        return attacks;
    }

    attack(coord)
    {
        this.attackedCoord = coord;
        return this.enemyBoard.recieveAttack(coord);
    }

    smartAttack(prevAttack, direction)
    {
        // computer smart attacks
        // has to be able to track a single ship, new ship parameter needed, id or name
        // if hit, store ship name, hit adjacent tiles till that ship is sunk
        // when ship is sunk make a random move again till next ship hit

        let adjacentAttacks = this.enemyBoard.getAdjacent(prevAttack[0], prevAttack[1]);
        adjacentAttacks = this.scramble(adjacentAttacks);

        let smartAttacks = [];
        if(direction == 'horizontal')
        {
            for(let i = 0; i < adjacentAttacks.length; i++)
            {
                if(adjacentAttacks[i][0] == prevAttack[0])
                {
                    smartAttacks.push(adjacentAttacks[i]);
                }
            }
            for(let i = 0; i < smartAttacks.length; i++)
            {
                this.possibleAttacks.push(smartAttacks[i]);
            }
            return smartAttacks.length;
        }
        if(direction == 'vertical')
        {
            for(let i = 0; i < adjacentAttacks.length; i++)
            {
                if(adjacentAttacks[i][1] == prevAttack[1])
                {
                    smartAttacks.push(adjacentAttacks[i]);
                }
            }
            for(let i = 0; i < smartAttacks.length; i++)
            {
                this.possibleAttacks.push(smartAttacks[i]);
            }
            return smartAttacks.length;
        }
        else
        {
            for(let i = 0; i < adjacentAttacks.length; i++)
            {
                this.possibleAttacks.push(adjacentAttacks[i]);
            }
            return adjacentAttacks.length;
        }
    }

    scramble(array)
    {
        for (let i = array.length - 1; i > 0; i--) 
        {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

export default Player;