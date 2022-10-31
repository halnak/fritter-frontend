import type {HydratedDocument, Types} from 'mongoose';
import type {Circle} from './model';
import CircleModel from './model';
import UserModel from '../user/model';
import FreetModel from '../freet/model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This file contains a class with functionality to interact with circle stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<Circle> is the output of the CircleModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class CircleCollection {
  /**
   * Add a new Circle
   *
   * @param {string} name - The name of the circle
   * @param {{ type: Types.ObjectId, ref: 'User' }} owner - The username of the owner
   * @return {Promise<HydratedDocument<Circle>>} - The newly created user
   */
  static async addOne(name: string, ownerId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    const owner = await UserCollection.findOneByUserId(ownerId);
    const members = [owner._id]; // owner is first member of circle
    // const freets: Array<{ type: Types.ObjectId, ref: 'Freet' }> = [];
    const circle = new CircleModel({
      name: name, 
      owner: owner._id, 
      members: members, 
      freets: []
    });
    await circle.save(); // Saves user to MongoDB
    return circle;
  }

  /**
   * Find a circle by circleId.
   *
   * @param {string} circleId - The circleId of the circle to find
   * @return {Promise<HydratedDocument<Circle>> | Promise<null>} - The circle with the given circleId, if any
   */
  static async findOneByCircleId(circleId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    return CircleModel.findOne({_id: circleId})
      .populate('owner')
      .populate('members')
      .populate('freets');
  }

    /**
   * Get all the circles in the database
   *
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
  static async findAll(): Promise<Array<HydratedDocument<Circle>>> {
    // Retrieves circles and sorts them alphabetically by name
    return CircleModel.find({}).sort({name: 1})
      .populate('owner')
      .populate('members')
      .populate('freets');
  }

  /**
   * Get all the circles by given owner
   *
   * @param {string} username - The username of the owner of the circles
   * @return {Promise<HydratedDocument<Circles>[]>} - An array of all of the circles
   */
  static async findAllByOwner(username: string): Promise<Array<HydratedDocument<Circle>>> {
    const owner = await UserCollection.findOneByUsername(username);
    return CircleModel.find({owner: owner._id})
      .populate('owner')
      .populate('members')
      .populate('freets');
  }

  /**
   * Get all the circles by given member
   *
   * @param {string} username - The username of the member in the circles
   * @return {Promise<HydratedDocument<Circles>[]>} - An array of all of the circles
   */
     static async findAllByMember(username: string): Promise<Array<HydratedDocument<Circle>>> {
      const member = await UserCollection.findOneByUsername(username);
      return CircleModel.find({members: {$in: [member._id]}})
        .populate('owner')
        .populate('members')
        .populate('freets');
    }

  /**
   * Check if a user is already a member of a given circle
   *
   * @param {string} circleId - The id of the circle being checked
   * @param {string} userId - The id of the user to check membership of
   * @return {boolean} - Whether the user is already a member of the circle
   */
   static async isMember(circleId: Types.ObjectId, userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.findOne({_id: userId});
    const circle = await this.findOneByCircleId(circleId);

    const members_arr: Array<Types.ObjectId> = circle.members;
    return members_arr.includes(user._id);
  }

  /**
   * Check if a freet is already a member of a given circle's freets
   *
   * @param {string} circleId - The id of the circle being checked
   * @param {string} freetId - The id of the freet to check membership of
   * @return {boolean} - Whether the user is already a member of the circle
   */
   static async isMemberFreet(circleId: Types.ObjectId, freetId: Types.ObjectId): Promise<boolean> {
    const freet = await FreetModel.findOne({_id: freetId});
    const circle = await this.findOneByCircleId(circleId);

    const freets_arr: Array<Types.ObjectId> = circle.freets;
    return freets_arr.includes(freet._id);
  }

  /**
   * Update members of a circle. 
   *
   * @param {string} circleId - The circleId of the circle to update
   * @param {string} userId - The userId of the user to add to circle members
   * @return {Promise<HydratedDocument<Circle>>} - The updated circle
   */
  static async addMember(circleId: Types.ObjectId, userId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    const user = await UserModel.findOne({_id: userId});
    if (!this.isMember(circleId, userId)){
      await CircleModel.updateOne({_id: circleId}, {$addToSet: {members: user._id}});
    }
    await circle.save();
    return circle;
  }

  /**
   * Update members of a circle. 
   *
   * @param {string} circleId - The circleId of the circle to update
   * @param {string} userId - The userId of the user to remove from circle members
   * @return {Promise<HydratedDocument<Circle>>} - The updated circle
   */
   static async removeMember(circleId: Types.ObjectId, userId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    const user = await UserModel.findOne({_id: userId});
    if (this.isMember(circleId, userId)){
      await CircleModel.updateOne({_id: circleId}, {$pull: {members: user._id}});
    }
    await circle.save();
    return circle;
  }

  /**
   * Update freets of a circle. 
   *
   * @param {string} circleId - The circleId of the circle to update
   * @param {string} freetId - The freetId of the freet to add to circle freets
   * @return {Promise<HydratedDocument<Circle>>} - The updated circle
   */
   static async addFreet(circleId: Types.ObjectId, freetId: Types.ObjectId): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    const freet = await FreetModel.findOne({_id: freetId});
    if (!this.isMemberFreet(circleId, freetId)){
      await CircleModel.updateOne({_id: circleId}, {$addToSet: {freets: freet._id}});
    }
    await circle.save();
    return circle;
  }

  /**
   * Update freets of a circle. 
   *
   * @param {string} circleId - The circleId of the circle to update
   * @param {string} freetId - The freetId of the freet to remove from circle freets
   * @return {Promise<HydratedDocument<Circle>>} - The updated circle
   */
   static async removeFreet(circleId: Types.ObjectId, freetId: Types.ObjectId): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    const freet = await FreetModel.findOne({_id: freetId});
    if (this.isMemberFreet(circleId, freetId)){
      await CircleModel.updateOne({_id: circleId}, {$pull: {freets: freet._id}});
    }
    await circle.save();
    return circle;
  }

  /**
   * Delete a circle from the collection.
   *
   * @param {string} circleId - The circleId of user to delete
   * @return {Promise<Boolean>} - true if the circle has been deleted, false otherwise
   */
  static async deleteOne(circleId: Types.ObjectId): Promise<boolean> {
    const circle = await CircleModel.deleteOne({_id: circleId});
    return circle !== null;
  }
}

export default CircleCollection;
