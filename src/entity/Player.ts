import { Vector3 } from '../types/index';

export interface Statistic {
  hp: number;
  maxHp: number;
}

export interface IPlayer {
  id: string;
  position: Vector3;
  rotation: Vector3;
  color: string;
  stat: Statistic;
}

export default class Player implements IPlayer {
  id: string;
  position: Vector3;
  rotation: Vector3;
  color: string;
  stat: Statistic;

  constructor(options: IPlayer) {
    this.id = options.id;
    this.position = options.position;
    this.rotation = options.rotation;
    this.color = options.color;
    this.stat = options.stat;
  }
}
