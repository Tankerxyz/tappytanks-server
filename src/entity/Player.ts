import { Vector3 } from '../types/index';

export interface IPlayer {
  id: string;
  position: Vector3;
  rotation: Vector3;
}

export default class Player implements IPlayer {
  id: string;
  position: Vector3;
  rotation: Vector3;

  constructor(options: IPlayer) {
    this.id = options.id;
    this.position = options.position;
    this.rotation = options.rotation;
  }
}
