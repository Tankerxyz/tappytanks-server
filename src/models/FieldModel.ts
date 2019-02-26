import { Schema, Document, model } from 'mongoose';
import { IField } from '../entity/Field';

export interface IFieldModel extends IField, Document {
  creation_date: Date
}

const FieldModel: Schema = new Schema({
  width: {
    type: Number,
    default: 18,
    min: 1,
    max: 100,
  },
  height: {
    type: Number,
    default: 18,
    min: 1,
    max: 100,
  },
  debug: {
    type: Boolean,
    default: false
  },
  players: {
    type: Array,
    default: []
  },
  walls: {
    type: Array,
    default: []
  },
  creation_date: {
    type: Date,
    default: new Date
  }
});

FieldModel.methods.getFieldModel = () => {

};

export default model<IFieldModel>('Field', FieldModel);
