import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Like on the backend
type GenericLike<P, U> = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: P;
  users: Array<U>;
};

export type Like = GenericLike<Types.ObjectId, Types.ObjectId>;
export type PopulatedLike = GenericLike<Freet, User>; 

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LikeSchema = new Schema<Like>({
  // the post for which likes are collected
  freet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The users who liked this post
  users: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
