import Player from '../entity/Player';
import Field from '../entity/Field';
import { generateRandomNumberRange, getRandomIndex } from '../utils';
import { Vector3 } from '../types';
import { colorArray } from '../utils';
import { IPlayerModel } from '../models/PlayerModel';

export interface IPlayersCtrl {
  field: Field;
  players?: Array<Player>;
}

export default class PlayersCtrl implements IPlayersCtrl {
  players: Array<Player> = [];
  field: Field;

  constructor(options: IPlayersCtrl) {
    this.field = options.field;

    if (options.players != null) {
      this.players = options.players;
    }
  }

  // todo refactor and fix infinite-while-loop
  public generatePosition() {
    let x: number;
    for (let i = 0; i < 10; ++i) {
      x = generateRandomNumberRange(this.field.width);
      if (Math.abs(x) % 2 === 0
        && !this.getPlayerByAxisValue('x', x).length
        && !this.field.getWallByAxisValue('x', x).length
      ) {
        break;
      }
    }

    let z: number;
    for (let i = 0; i < 10; ++i) {
      z = generateRandomNumberRange(this.field.height);

      if (Math.abs(z) % 2 === 0
        && !this.getPlayerByAxisValue('z', z).length
        && !this.field.getWallByAxisValue('z', z).length
      ) {
        break;
      }
    }

    return { x, z, y: 1 };
  }

  public generateRotation(): Vector3 {
    const arrayOfZRotations = [Math.PI / 2, Math.PI, -Math.PI / 2, -Math.PI];
    const randomIndex = getRandomIndex(arrayOfZRotations.length);
    const y = arrayOfZRotations[randomIndex];

    return { x: 0, y, z: 0 };
  }

  public generateColor(): string {
    let color: string;
    for (let i = 0; i < 100; ++i) {
      color = colorArray[getRandomIndex(colorArray.length)];

      if (!this.players.some(p => p.color == color)) {
        break;
      }
    }

    return color;
  };

  public getPlayerByAxisValue(axisName: string, axisValue: number): Player[] {
    // @ts-ignore todo add compareTo to Vector3 for easy checking
    return this.players.filter(({ position }) => position[axisName] === axisValue);
  }

  public addNewPlayer(playerModel: IPlayerModel) {
    const player = new Player(playerModel);
    this.players.push(player);

    return player;
  }

  public removePlayer(player: Player) {
    this.players.splice(this.players.indexOf(player), 1);
  }
}
