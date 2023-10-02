import Gameboard from "./Gameboard";


class Player
{
    constructor(enemyBoard)
    {
        this.enemyBoard = enemyBoard;
        this.attackedCoord;
    }

    attack(coord)
    {
        return this.enemyBoard.recieveAttack(coord);
    }

    randomAttack()
    {
        const coord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        this.attackedCoord = coord;
        // const coord = [0,5];
        return this.enemyBoard.recieveAttack(coord);
    }


}

export default Player;