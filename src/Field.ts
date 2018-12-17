export interface IField {
  width: number;
  height: number,
  debug?: boolean,
  players?: [],
}

export default class Field implements IField {
  width: number;
  height: number;
  debug: boolean = false;
  players: [] = [];

  constructor(options: IField) {
    this.width = options.width;
    this.height = options.height;

    if (options.debug != null) {
      this.debug = options.debug;
    }
    if (options.players != null) {
      this.players = options.players
    }
  }
}
