import type {HydratedDocument} from 'mongoose';
import type {Like, PopulatedLike} from '../like/model';

type LikeResponse = {
  _id: string;
  freet: string;
  users: Array<string>
};

/**
 * Transform a raw Like object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A like object
 * @returns {LikeResponse} - The like object formatted for the frontend
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: Like = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const usersArr = [];
  for (const user of likeCopy.users){
    usersArr.push(user._id.toString());
  }
  return {
    ...likeCopy,
    _id: likeCopy._id.toString(),
    freet: likeCopy.freet._id.toString(),
    users: usersArr
  };
};

export {
  constructLikeResponse
};
