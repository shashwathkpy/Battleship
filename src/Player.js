import Gameboard from "./Gameboard";


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

        for (let i = attacks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [attacks[i], attacks[j]] = [attacks[j], attacks[i]];
        }
        return attacks;
    }

    attack(coord)
    {
        return this.enemyBoard.recieveAttack(coord);
    }

    randomAttack()
    {
        const coord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        this.attackedCoord = coord;
        return this.enemyBoard.recieveAttack(coord);
    }

    smartAttack(prevAttack)
    {
        // computer smart attacks
        // has to be able to track a single ship, new ship parameter needed, id or name
        // if hit, store ship name, hit adjacent tiles till that ship is sunk
        // when ship is sunk make a random move again till next ship hit

        let adjacentAttacks = this.enemyBoard.getAdjacent(parseInt(prevAttack[0]), parseInt(prevAttack[1]));
        console.log('coord: ' + prevAttack + ' adjacent attacks: ' + adjacentAttacks[0]);
        return adjacentAttacks;

    }


}

export default Player;