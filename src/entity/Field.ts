import Player from './Player';
import Wall from './Wall';
import { IFieldModel } from '../models/FieldModel';

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
  fieldModel: IFieldModel;

  constructor(fieldModel: IFieldModel) {
    this.width = fieldModel.width;
    this.height = fieldModel.height;
    this.fieldModel = fieldModel;

    if (fieldModel.debug != null) {
      this.debug = fieldModel.debug;
    }
    if (fieldModel.players != null) {
      this.players = fieldModel.players
    }
    if (fieldModel.walls != null) {
      this.walls = fieldModel.walls;
    }
  }

  public getWallByAxisValue(axisName: string, axisValue: number): Wall[] {
    // @ts-ignore todo
    return this.walls.filter(({ position }) => position[axisName] === axisValue)
  }

  public async save(): Promise<IFieldModel> {
    this.fieldModel.height = this.height;
    this.fieldModel.width = this.width;
    this.fieldModel.debug = this.debug;
    this.fieldModel.players = this.players;
    this.fieldModel.walls = this.walls;

    return this.fieldModel.save();
  };

  public getNormalized() {
    const field = {...this};
    delete field.fieldModel;
    return field;
  }
}
