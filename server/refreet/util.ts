import type {HydratedDocument} from 'mongoose';
import type {Refreet, PopulatedRefreet} from '../refreet/model';

type RefreetResponse = {
  _id: string;
  freet: string;
  users: Array<string>
};

/**
 * Transform a raw Refreet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Refreet>} refreet - A Refreet object
 * @returns {RefreetResponse} - The Refreet object formatted for the frontend
 */
const constructRefreetResponse = (refreet: HydratedDocument<Refreet>): RefreetResponse => {
  const refreetCopy: Refreet = {
    ...refreet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const usersArr = [];
  for (const user of refreetCopy.users){
    usersArr.push(user._id.toString());
  }
  return {
    ...refreetCopy,
    _id: refreetCopy._id.toString(),
    freet: refreetCopy.freet._id.toString(),
    users: usersArr
  };
};

export {
  constructRefreetResponse
};
