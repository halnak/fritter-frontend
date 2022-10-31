import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from 'user/collection';
import FreetCollection from '../freet/collection';
import FollowCollection from './collection';
import * as followValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the follow objects
 *
 * @name GET /api/follows
 *
 * @return {FollowResponse[]} - A list of all the follows sorted in ascending
 *                      order by username
 */
/**
 * Get follow object for a certain user.
 *
 * @name GET /api/follows?userId=id
 *
 * @return {FollowResponse} - An array of the follow for a particular user
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.user !== undefined) {
      next();
      return;
    }

    const allFollows = await FollowCollection.findAll();
    const response = allFollows.map(util.constructFollowResponse);
    res.status(200).json(response);
  },
  [
    followValidator.isFollowExists
  ],
  async (req: Request, res: Response) => {
    const userFollow = await FollowCollection.findOne(req.query.user as string);
    const response = util.constructFollowResponse(userFollow);
    res.status(200).json(response);
  }
);

/**
 * Create a new follow relationship for a user.
 *
 * @name POST /api/follows
 *
 * @param {string} userId - The user to create a follow relationship for
 * @return {FollowResponse} - The created follow
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    followValidator.isFollowExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const follow = await FollowCollection.addOne(userId);

    res.status(201).json({
      message: 'Your follow was created successfully.',
      freet: util.constructFollowResponse(follow)
    });
  }
);

/**
 * Delete a follow relation map
 *
 * @name DELETE /api/follows/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/:userId?',
  [
    followValidator.isFollowExists
  ],
  async (req: Request, res: Response) => {
    await FreetCollection.deleteOne(req.params.userId);
    res.status(200).json({
      message: 'Your follow was deleted successfully.'
    });
  }
);

/**
 * Add a follower
 *
 * @name PUT /api/follows
 *
 * @param {string} userId - the user making the follow
 * @param {string} followId - the nuser to follow
 * @param {string} addFollower - true if adding a follower, null if removing a follower
 * @return {FollowResponse} - the updated follow object for the user
 * @throws {403} - if the user is not logged in 
 */
router.put(
  '/',
  [
    followValidator.isFollowExists
  ],
  async (req: Request, res: Response) => {
    var follow;
    
    if(req.body.addFollower !== undefined){
      follow = await FollowCollection.addFollowing(req.body.userId, req.body.followId);
    }else{
      follow = await FollowCollection.removeFollowing(req.body.userId, req.body.followId);
    }
    res.status(200).json({
      message: 'Your follow was updated successfully.',
      freet: util.constructFollowResponse(follow)
    });
  }
);

export {router as followRouter};
