import { Vector3 } from '../types/index';

export interface Statistic {
  hp: number;
  maxHp: number;
}

export interface IPlayer {
  id: string;
  position: Vector3;
  rotation: Vector3;
  stat: Statistic;
}

export default class Player implements IPlayer {
  id: string;
  position: Vector3;
  rotation: Vector3;
  stat: Statistic;

  constructor(options: IPlayer) {
    this.id = options.id;
    this.position = options.position;
    this.rotation = options.rotation;
    this.stat = options.stat;
  }
}
