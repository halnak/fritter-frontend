import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Circle} from './model';

type CircleResponse = {
  _id: string;
  name: string;
  owner: string;
  members: Array<string>;
  freets: Array<string>;
};

/**
 * Transform a raw Circle object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Circle>} circle - A circle object
 * @returns {CircleResponse} - The circle object
 */
const constructCircleResponse = (circle: HydratedDocument<Circle>): CircleResponse => {
  const circleCopy: Circle = {
    ...circle.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const m: Array<string> = circleCopy.members.map(function(val){
    return val.toString();
  });
  const f: Array<string> = circleCopy.freets.map(function(val){
    return val.toString();
  });
  return {
    ...circleCopy,
    _id: circleCopy._id.toString(),
    name: circleCopy.name.toString(),
    owner: circleCopy.owner._id.toString(),
    members: m,
    freets: f
  };
};

export {
  constructCircleResponse
};
