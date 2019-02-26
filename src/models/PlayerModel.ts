import { Schema, Document, model } from 'mongoose';
import { IPlayer } from '../entity/Player';

export interface IPlayerModel extends IPlayer, Document {

}

const VectorSchema = {
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  z: {
    type: Number,
    default: 0
  }
};

const PlayerModel: Schema = new Schema({
  userID: {
    type: String,
    required: true
  },
  position: VectorSchema,
  rotation: VectorSchema,
  color: {
    type: String,
    default: '#ffffff'
  },
  stat: {
    hp: {
      type: Number,
      default: 100,
    },
    maxHp: {
      type: Number,
      default: 100
    }
  }
});

export default model<IPlayerModel>('Player', PlayerModel);
