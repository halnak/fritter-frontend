import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';
import UserModel from '../user/model';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Like> is the output of the LikeModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} freetId - The post to add to the collection
   * @return {Promise<HydratedDocument<Like>>} - The newly created like object
   */
  static async addOne(freetId: Types.ObjectId): Promise<HydratedDocument<Like>> {
    const freet = await FreetCollection.findOne(freetId);
    const like = new LikeModel({
      freet: freet._id,
      users: []
    });
    await like.save(); // Saves like to MongoDB
    return like;
  }

  /**
   * Find a like by post ID
   *
   * @param {string} freetId - The freet ID of the like object to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The like for the given id, if any
   */
  static async findOne(freetId: Types.ObjectId): Promise<HydratedDocument<Like>> {
    // const freet = await FreetCollection.findOne(freetId);
    return LikeModel.findOne({freet: freetId})
      .populate('users');
  }

  /**
   * Get all the likes in the database
   *
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
  static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    // Retrieves all likes in the db
    return LikeModel.find({}).sort({users: 1})
      .populate('users');
}

  /**
   * Get all the likes in the database for a particular user
   *
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
   static async findAllByUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    var user;
    if ((user = await UserCollection.findOneByUserId(userId)) === undefined){
      user = await UserCollection.findOneByUsername(userId as string);
    }
    
    return LikeModel.find({users: {$in: [user._id]}})
      .populate('users');
}

  /**
   * Check if a user has already liked a particular freet
   *
   * @param {string} userId - The id of the user liking the freet
   * @param {string} freetId - The id of the freet being liked
   * @return {boolean} - Whether the user has liked the given freet
   */
     static async hasLiked(userId: Types.ObjectId | string, freetId: Types.ObjectId): Promise<boolean> {
      const user = await UserModel.findOne({_id: userId});
      const like = await this.findOne(freetId);

      const users_arr: Array<Types.ObjectId> = like.users;
      return users_arr.includes(user._id);
    }

  /**
   * Add a user to the collection of users who liked a given freet
   *
   * @param {string} userId - The id of the user liking the freet
   * @param {string} freetId - The id of the freet to be liked
   * @return {Promise<HydratedDocument<Like>>} - The newly updated like object
   */
  static async addLike(userId: Types.ObjectId | string, freetId: Types.ObjectId): Promise<HydratedDocument<Like>> {
    const user = await UserModel.findOne({_id: userId});

    await LikeModel.updateOne({freet: freetId}, {$addToSet: {users: user._id}});
    
    const like = await LikeModel.findOne({freet: freetId}).exec();
    like.save();
    return (await like.populate('users'));
  }

  /**
   * Remove a user from the set of users who liked a freet
   *
   * @param {string} userId - The id of the user performing the like
   * @param {string} freetId - The id of the freet to be liked
   * @return {Promise<HydratedDocument<Like>>} - The newly updated like object
   */
   static async removeLike(userId: Types.ObjectId | string, freetId: Types.ObjectId): Promise<HydratedDocument<Like>> {
    const user = await UserModel.findOne({_id: userId});

    await LikeModel.updateOne({freet: freetId}, {$pull: {users: user._id}});
    
    const like = await LikeModel.findOne({freet: freetId}).exec();
    like.save();
    return (await like.populate('users'));
  }

  /**
   * Remove all like relations for a given freet
   *
   * @param {string} freetId - The freetId for the like to remove
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.deleteOne({freet: freetId});
    // like.delete();
    return like !== null;
  }
}

export default LikeCollection;
