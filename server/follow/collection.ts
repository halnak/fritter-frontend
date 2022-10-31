import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';
import UserModel from '../user/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Follow> is the output of the FollowModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Add a follow to the collection
   *
   * @param {string} userId - The id of the user performing the follow
   * @return {Promise<HydratedDocument<Follow>>} - The newly created follow
   */
  static async addOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const user = await UserModel.findById(userId);
    const follow = new FollowModel({
      user: user._id,
      followers: [],
      following: [],
    });
    await follow.save(); // Saves freet to MongoDB
    return follow;
  }

  /**
   * Find a follow by userId
   *
   * @param {string} userId - The id of the user's follow to find
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The follow for the given user, if any
   */
  static async findOne(userId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const user = (await UserCollection.findOneByUserId(userId));
        return FollowModel.findOne({user: user._id})
                          .populate('user')
                          .populate('followers')
                          .populate('following');
  }

  /**
   * Get all the follows in the database
   *
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follows
   */
  static async findAll(): Promise<Array<HydratedDocument<Follow>>> {
    // Retrieves follows (in no particular order)
    return FollowModel.find({})
    .populate('user')
    .populate('followers')
    .populate('following');
}

  /**
   * Check if the user is already following a given user. 
   *
   * @param {string} userId - The id of the user performing the follow
   * @param {string} followId - The id of the user to check if userId is following
   * @return {boolean} - Whether the user is following the given user
   */
     static async isFollowing(userId: Types.ObjectId | string, followId: Types.ObjectId | string): Promise<boolean> {
      const user= await UserModel.findOne({_id: userId});
      const userToFollow = await UserModel.findOne({_id: followId})

      const follow = await FollowModel.findOne({user: userId}).exec();
      const follow_arr: Array<Types.ObjectId> = follow.following;
      return follow_arr.includes(userToFollow._id);
    }

  /**
   * Add a follow relationship between two users
   *
   * @param {string} userId - The id of the user performing the follow
   * @param {string} followId - The id of the user to check if userId is following
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async addFollowing(userId: Types.ObjectId | string, followId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const user = await UserModel.findOne({_id: userId});
    const userToFollow = await UserModel.findOne({_id: followId})

    await FollowModel.updateOne({user: user._id}, {$addToSet: {following: userToFollow._id}});
    await FollowModel.updateOne({user: userToFollow._id}, {$addToSet: {followers: user._id}});
    
    const follow = await FollowModel.findOne({user: userToFollow._id}).exec();
    follow.save();
    userToFollow.save();
    return (await follow.populate('followers')).populate('following');
  }

  /**
   * Remove a follow relationship between two users
   *
   * @param {string} userId - The id of the user performing the unfollow
   * @param {string} followId - The id of the user to check if userId is unfollowing
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
   static async removeFollowing(userId: Types.ObjectId | string, followId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const user = await UserModel.findOne({_id: userId});
    const userToFollow = await UserModel.findOne({_id: followId})

    const userFollow = await FollowModel.findOne({user: user._id}).exec();
    const follow = await FollowModel.findOne({user: userToFollow._id}).exec();

    await FollowModel.updateOne({user: user._id}, {$addToSet: {following: userToFollow._id}});
    await FollowModel.updateOne({user: userToFollow._id}, {$addToSet: {followers: user._id}});

    follow.save();
    userToFollow.save();
    return follow;
  }

  /**
   * Remove all follow relationships for a given user. 
   *
   * @param {string} userId - The userId for the relationships to delete. 
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.findOne({_id: userId});
    const follow = await FollowModel.findOne({user: userId}).exec();
    for (const following of follow.following){
      this.removeFollowing(user._id, following._id);
    }
    for (const follower of follow.followers){
      this.removeFollowing(follower._id, user._id);
    }
    follow.delete();

    return follow !== null;
  }
}

export default FollowCollection;
