import { Vector3 } from '../types/index';
import { IPlayerModel } from '../models/PlayerModel';

export interface Statistic {
  hp: number;
  maxHp: number;
}

export interface IPlayer {
  userID: string;
  position: Vector3;
  rotation: Vector3;
  color: string;
  stat: Statistic;
}

export default class Player implements IPlayer {
  userID: string;
  position: Vector3;
  rotation: Vector3;
  color: string;
  stat: Statistic;
  playerModel: IPlayerModel;

  constructor(playerModel: IPlayerModel) {
    this.playerModel = playerModel;

    this.userID = playerModel.userID;
    this.position = playerModel.position;
    this.rotation = playerModel.rotation;
    this.color = playerModel.color;
    this.stat = playerModel.stat;
  }

  public async save(): Promise<IPlayerModel> {
    this.playerModel.userID = this.userID;
    this.playerModel.rotation = this.rotation;
    this.playerModel.position = this.position;
    this.playerModel.color = this.color;
    this.playerModel.stat = this.stat;

    return this.playerModel.save();
  }

  public getNormalized(): any {
    const player = {...this};
    delete player.playerModel;
    return player;
  }
}
