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
        && !this.players.some((p: any) => p.position.x === x)
        && !this.field.walls.some(w => w.position.x === x)
      ) {
        break;
      }
    }

    let z: number;
    while (true) {
      z = generateRandomNumberRange(this.field.height);

      if (Math.abs(z) % 2 === 0
        && !this.players.some((p: any) => p.position.z === z)
        && !this.field.walls.some(w => w.position.z === z)
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
