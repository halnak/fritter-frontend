import { ObjectID } from 'bson';
import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import RefreetCollection from './collection';
import * as refreetValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the Refreet objects
 *
 * @name GET /api/refreets
 *
 * @return {RefreetResponse[]} - A list of all the Refreet objects
 */
/**
 * Get Refreet object for a certain post.
 *
 * @name GET /api/refreets?freetId=id
 *
 * @return {RefreetResponse} - The Refreet for a given freet
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
/**
 * Get Refreet object for a certain post.
 *
 * @name GET /api/refreets?userId=id
 *
 * @return {RefreetResponse} - The Refreet for a given 
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

    const allRefreets = await RefreetCollection.findAll();
    const response = allRefreets.map(util.constructRefreetResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    if(req.query.userId !== undefined){
      next();
      return;
    }
    const freet = await FreetCollection.findOne(req.query.freetId as string);
    const refreet = await RefreetCollection.findOne(freet._id);
    const response = util.constructRefreetResponse(refreet);
    res.status(200).json(response);
  },
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUserId(req.query.userId as string);
    const refreets = await RefreetCollection.findAllByUser(req.query.userId as string);
    const response = refreets.map(util.constructRefreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new Refreet object for a freet
 *
 * @name POST /api/Refreets
 *
 * @param {string} freetId - The freet to create a Refreet object for
 * @return {RefreetResponse} - The created Refreet
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    refreetValidator.isRefreetNotExists
  ],
  async (req: Request, res: Response) => {
    const Refreet = await RefreetCollection.addOne(req.body.freetId);

    res.status(201).json({
      message: 'Your Refreet was created successfully.',
      freet: util.constructRefreetResponse(Refreet)
    });
  }
);

/**
 * Delete a Refreet object for a freet
 *
 * @name DELETE /api/Refreets/:freetId
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
    await RefreetCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your refreet was deleted successfully.'
    });
  }
);

/**
 * Add a user to a Refreet
 *
 * @name PUT /api/refreets
 *
 * @param {string} freetId - the freet to be Refreetd
 * @param {string} userId - the user liking the freet
 * @return {RefreetResponse} - the updated Refreet object for the user
 * @throws {403} - if the user is not logged in 
 */
router.put(
  '/add/',
  [
    userValidator.isUserLoggedIn,
    refreetValidator.isRefreetExists,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const refreet = await RefreetCollection.addRefreet(req.body.userId, req.body.freetId);

    res.status(200).json({
      message: 'Your Refreet was updated successfully.',
      freet: util.constructRefreetResponse(refreet)
    });
  }
);

/**
 * Remove a user from a Refreet
 *
 * @name PUT /api/Refreets
 *
 * @param {string} freetId - the freet to be Refreetd
 * @param {string} userId - the user liking the freet
 * @return {RefreetResponse} - the updated Refreet object for the user
 * @throws {403} - if the user is not logged in 
 */
 router.put(
  '/remove/',
  [
    userValidator.isUserLoggedIn,
    refreetValidator.isRefreetExists,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const refreet = await RefreetCollection.removeRefreet(req.body.userId, req.body.freetId);

    res.status(200).json({
      message: 'Your Refreet was updated successfully.',
      freet: util.constructRefreetResponse(refreet)
    });
  }
);

export {router as refreetRouter};
