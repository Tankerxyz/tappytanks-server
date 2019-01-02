import { Vector3 } from '../types';

interface IWall {
  position: Vector3;
  size?: number;
}

export default class Wall implements IWall {
  position: Vector3;
  size: number = 2;

  constructor(options: IWall) {
    this.position = options.position;

    if (options.size != null) {
      this.size = options.size;
    }
  }
};
