import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Circle
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Circle on the backend
export type GenericCircle<P> = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string; 
  owner: string; 
  members: Array<string>;
  freets: Array<P>;
};

export type Circle = GenericCircle<Types.ObjectId>;
export type PopulatedCircle = GenericCircle<Freet>; 

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CircleSchema = new Schema({
  // The name of the circle
  name: { 
    type: String,
    required: true
  },
  // User ID of the owner
  owner: {
    type: String,
    required: true,
  },
  // Members of the circle
  members: {
    type: Array<String>,
    required: true,
  },
  // Freets posted to this circle
  freets: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Freet' }],
    required: true,
    ref: 'Freet'
  }
});

const CircleModel = model<Circle>('Circle', CircleSchema);
export default CircleModel;
