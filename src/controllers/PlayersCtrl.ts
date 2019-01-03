import Player from '../entity/Player';
import Field from '../entity/Field';
import { generateRandomNumberRange } from '../utils';
import { Vector3 } from '../types';

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

  // todo refactor
  private generatePosition() {
    let x: number;
    while (true) {
      x = generateRandomNumberRange(this.field.width);
      if (Math.abs(x) % 2 === 0
        && !this.getPlayerByAxisValue('x', x).length
        && !this.field.getWallByAxisValue('x', x).length
      ) {
        break;
      }
    }

    let z: number;
    while (true) {
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

  private generateRotation(): Vector3 {
    const arrayOfZRotations = [Math.PI / 2, Math.PI, -Math.PI / 2, -Math.PI];
    const randomIndex = ~~(Math.random() * 4);
    const z = arrayOfZRotations[randomIndex];

    return { x: -Math.PI / 2, y: 0, z };
  }

  public getPlayerByAxisValue(axisName: string, axisValue: number): Player[] {
    // @ts-ignore todo add compareTo to Vector3 for easy checking
    return this.players.filter(({ position }) => position[axisName] === axisValue);
  }

  public addNewPlayer(socket: any) {
    const player = new Player({
      id: socket.id,
      position: this.generatePosition(),
      rotation: this.generateRotation(),
      stat: { hp: 100, maxHp: 100}
    });
    this.players.push(player);

    return player;
  }

  public removePlayer(player: Player) {
    this.players.splice(this.players.indexOf(player), 1);
  }
}
