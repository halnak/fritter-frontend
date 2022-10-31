import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from '../follow/model';

type FollowResponse = {
  _id: string;
  user: string;
  following: Array<string>,
  followers: Array<string>
};

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} follow - A follow object
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: PopulatedFollow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const followingArr = [];
  for (const user of followCopy.following){
    followingArr.push(user._id.toString());
  }
  const followerArr = [];
  for (const user of followCopy.followers){
    followerArr.push(user._id.toString());
  }
  return {
    ...followCopy,
    _id: followCopy._id.toString(),
    user: followCopy.user._id.toString(),
    following: followingArr,
    followers: followerArr
  };
};

export {
  constructFollowResponse
};
