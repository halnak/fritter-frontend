import { ObjectID } from 'bson';
import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import LikeCollection from './collection';
import * as likeValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the like objects
 *
 * @name GET /api/likes
 *
 * @return {LikeResponse[]} - A list of all the like objects
 */
/**
 * Get like object for a certain post.
 *
 * @name GET /api/likes?freetId=id
 *
 * @return {LikeResponse} - The like for a given 
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
/**
 * Get like object for a certain post.
 *
 * @name GET /api/likes?userId=id
 *
 * @return {LikeResponse} - The like for a given 
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if ((req.query.freetId !== undefined) || (req.query.userId !== undefined)) {
      next();
      return;
    }

    const allLikes = await LikeCollection.findAll();
    const response = allLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    if(req.query.userId !== undefined){
      next();
      return;
    }
    const freet = await FreetCollection.findOne(req.query.freetId as string);
    const like = await LikeCollection.findOne(freet._id);
    const response = util.constructLikeResponse(like);
    res.status(200).json(response);
  },
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.query.userId as string);
    const likes = await LikeCollection.findAllByUser(req.query.userId as string);
    const response = likes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new like object for a freet
 *
 * @name POST /api/likes
 *
 * @param {string} freetId - The freet to create a like object for
 * @return {LikeResponse} - The created like
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.isLikeNotExists
  ],
  async (req: Request, res: Response) => {
    const like = await LikeCollection.addOne(req.body.freetId);

    res.status(201).json({
      message: 'Your like was created successfully.',
      freet: util.constructLikeResponse(like)
    });
  }
);

/**
 * Delete a like object for a freet
 *
 * @name DELETE /api/likes/:freetId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);

/**
 * Add a user to a like
 *
 * @name PUT /api/likes
 *
 * @param {string} freetId - the freet to be liked
 * @param {string} userId - the user liking the freet
 * @return {LikeResponse} - the updated like object for the user
 * @throws {403} - if the user is not logged in 
 */
router.put(
  '/add/',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isLikeExists,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const like = await LikeCollection.addLike(req.body.userId, req.body.freetId);

    res.status(200).json({
      message: 'Your like was updated successfully.',
      freet: util.constructLikeResponse(like)
    });
  }
);

/**
 * Remove a user from a like
 *
 * @name PUT /api/likes
 *
 * @param {string} freetId - the freet to be liked
 * @param {string} userId - the user liking the freet
 * @return {LikeResponse} - the updated like object for the user
 * @throws {403} - if the user is not logged in 
 */
 router.put(
  '/remove/',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isLikeExists,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const like = await LikeCollection.removeLike(req.body.userId, req.body.freetId);

    res.status(200).json({
      message: 'Your like was updated successfully.',
      freet: util.constructLikeResponse(like)
    });
  }
);

export {router as likeRouter};
