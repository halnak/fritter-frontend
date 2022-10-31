import type {HydratedDocument, Types} from 'mongoose';
import type {Refreet} from './model';
import RefreetModel from './model';
import UserCollection from '../user/collection';
import UserModel from '../user/model';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Refreet> is the output of the RefreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class RefreetCollection {
  /**
   * Add a Refreet to the collection
   *
   * @param {string} freetId - The post to add to the collection
   * @return {Promise<HydratedDocument<Refreet>>} - The newly created Refreet object
   */
  static async addOne(freetId: Types.ObjectId): Promise<HydratedDocument<Refreet>> {
    const freet = await FreetCollection.findOne(freetId);
    const refreet = new RefreetModel({
      freet: freet._id,
      users: []
    });
    await refreet.save(); // Saves Refreet to MongoDB
    return refreet;
  }

  /**
   * Find a Refreet by post ID
   *
   * @param {string} freetId - The freet ID of the Refreet object to find
   * @return {Promise<HydratedDocument<Refreet>> | Promise<null> } - The Refreet for the given id, if any
   */
  static async findOne(freetId: Types.ObjectId): Promise<HydratedDocument<Refreet>> {
    // const freet = await FreetCollection.findOne(freetId);
    return RefreetModel.findOne({freet: freetId})
                      .populate('users');
  }

  /**
   * Get all the Refreets in the database
   *
   * @return {Promise<HydratedDocument<Refreet>[]>} - An array of all of the Refreets
   */
  static async findAll(): Promise<Array<HydratedDocument<Refreet>>> {
    // Retrieves all Refreets in the db
    return RefreetModel.find({}).sort({users: 1})
      .populate('users');
}

  /**
   * Get all the Refreets in the database for a particular user
   *
   * @return {Promise<HydratedDocument<Refreet>[]>} - An array of all of the Refreets
   */
   static async findAllByUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Refreet>>> {
    var user;
    if ((user = await UserCollection.findOneByUserId(userId)) === undefined){
      user = await UserCollection.findOneByUsername(userId as string);
    }
    
    return RefreetModel.find({user: user._id})
      .populate('users');
}

  /**
   * Check if a user has already Refreetd a particular freet
   *
   * @param {string} userId - The id of the user liking the freet
   * @param {string} freetId - The id of the freet being Refreetd
   * @return {boolean} - Whether the user has Refreetd the given freet
   */
     static async hasRefreeted(userId: Types.ObjectId | string, freetId: Types.ObjectId): Promise<boolean> {
      const user = await UserModel.findOne({_id: userId});
      const refreet = await this.findOne(freetId);

      const users_arr: Array<Types.ObjectId> = refreet.users;
      return users_arr.includes(user._id);
    }

  /**
   * Add a user to the collection of users who Refreetd a given freet
   *
   * @param {string} userId - The id of the user liking the freet
   * @param {string} freetId - The id of the freet to be Refreetd
   * @return {Promise<HydratedDocument<Refreet>>} - The newly updated Refreet object
   */
  static async addRefreet(userId: Types.ObjectId | string, freetId: Types.ObjectId): Promise<HydratedDocument<Refreet>> {
    const user = await UserModel.findOne({_id: userId});

    await RefreetModel.updateOne({freet: freetId}, {$addToSet: {users: user._id}});
    
    const refreet = await RefreetModel.findOne({freet: freetId}).exec();
    refreet.save();
    return (await refreet.populate('users'));
  }

  /**
   * Remove a user from the set of users who Refreetd a freet
   *
   * @param {string} userId - The id of the user performing the Refreet
   * @param {string} freetId - The id of the freet to be Refreetd
   * @return {Promise<HydratedDocument<Refreet>>} - The newly updated Refreet object
   */
   static async removeRefreet(userId: Types.ObjectId | string, freetId: Types.ObjectId): Promise<HydratedDocument<Refreet>> {
    const user = await UserModel.findOne({_id: userId});

    await RefreetModel.updateOne({freet: freetId}, {$pull: {users: user._id}});
    
    const refreet = await RefreetModel.findOne({freet: freetId}).exec();
    refreet.save();
    return (await refreet.populate('users'));
  }

  /**
   * Remove all Refreet relations for a given freet
   *
   * @param {string} freetId - The freetId for the Refreet to remove
   * @return {Promise<Boolean>} - true if the Refreet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const refreet = await RefreetModel.deleteOne({freet: freetId});
    // Refreet.delete();
    return refreet !== null;
  }
}

export default RefreetCollection;
