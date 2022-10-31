import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Refreet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Refreet on the backend
type GenericRefreet<P, U> = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: P;
  users: Array<U>;
};

export type Refreet = GenericRefreet<Types.ObjectId, Types.ObjectId>;
export type PopulatedRefreet = GenericRefreet<Freet, User>; 

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const RefreetSchema = new Schema<Refreet>({
  // the post for which Refreets are collected
  freet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The users who Refreetd this post
  users: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
});

const RefreetModel = model<Refreet>('Refreet', RefreetSchema);
export default RefreetModel;
