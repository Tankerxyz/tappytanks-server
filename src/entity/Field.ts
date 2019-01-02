import Player from './Player';
import Wall from './Wall';

export interface IField {
  width: number;
  height: number,
  debug?: boolean,
  players?: Array<Player>,
  walls?: Array<Wall>,
}

export default class Field implements IField {
  width: number;
  height: number;
  debug: boolean = false;
  players: Array<Player> = [];
  walls: Array<Wall> = [];

  constructor(options: IField) {
    this.width = options.width;
    this.height = options.height;

    if (options.debug != null) {
      this.debug = options.debug;
    }
    if (options.players != null) {
      this.players = options.players
    }
    if (options.walls != null) {
      this.walls = options.walls;
    }
  }
}
