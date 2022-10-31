import type {Request, Response, NextFunction} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import CircleCollection from './collection';
import * as userValidator from '../user/middleware';
import * as circleValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the circles
 *
 * @name GET /api/circles
 *
 * @return {CircleResponse[]} - A list of all the circles sorted by name
 */
/**
 * Get circles by owner
 *
 * @name GET /api/circle?owner=id
 *
 * @return {CircleResponse[]} - An array of circles created by owner with id, ownerId
 * @throws {400} - If ownerId is not given
 * @throws {404} - If no user has given ownerId
 *
 */
/**
 * Get circles by member
 *
 * @name GET /api/circle?memberId=id
 *
 * @return {CircleResponse[]} - An array of circles that contain the user with memberId as a member
 * @throws {400} - If memberId is not given
 * @throws {404} - If no user has given memberId
 *
 */
 router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.owner !== undefined || req.query.member !== undefined) {
      next();
      return;
    }

    const allCircles = await CircleCollection.findAll();
    const response = allCircles.map(util.constructCircleResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next:NextFunction) => {
    if (req.query.member !== undefined) {
      next();
      return;
    }
    const ownerCircles = await CircleCollection.findAllByOwner(req.query.owner as string);
    const response = ownerCircles.map(util.constructCircleResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response) => {
    const memberCircles = await CircleCollection.findAllByMember(req.query.member as string);
    const response = memberCircles.map(util.constructCircleResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a circle.
 *
 * @name POST /api/circles
 *
 * @param {string} name - name of circle
 * @param {string} owner - username of creator
 * @return {CircleResponse} - The created circle
 * @throws {403} - If the user is not logged in
 *
 */
router.post(
  '/',
  [
    // userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsername(req.body.owner);
    const circle = await CircleCollection.addOne(req.body.name, user.id);
    res.status(201).json({
      message: `Your circle was created successfully.`,
      user: util.constructCircleResponse(circle)
    });
  }
);

/**
 * Update the membership of a circle.
 *
 * @name PUT /api/circles/addMember
 *
 * @param {string} id - The id of the circle to modify
 * @param {string} member - The user to add from the circle
 * @return {CircleResponse} - The updated circle
 * @throws {403} - If user is not logged in
 * @throws {403} - If the user is not the owner of the circle
 * @throws {404} - If the Circle ID is invalid (does not exist)
 * @throws {409} - If the member is already a part of the circle
 */
router.put(
  '/addMember/',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.userNotMemberCircle
  ],
  async (req: Request, res: Response) => {
    const circle = await CircleCollection.findOneByCircleId(req.body.id);
    const member = await UserCollection.findOneByUsername(req.body.member);
    const updated = await CircleCollection.addMember(circle.id, req.body.member);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructCircleResponse(updated)
    });
  }
);

/**
 * Update the membership of a circle.
 *
 * @name PUT /api/circles/removeMember
 *
 * @param {string} id - The id of the circle to modify
 * @param {string} member - The user to remove from the circle
 * @return {CircleResponse} - The updated circle
 * @throws {403} - If user is not logged in
 * @throws {403} - If the user is not the owner of the circle
 * @throws {404} - If the Circle ID is invalid (does not exist)
 * @throws {409} - If the member is not a part of the circle
 */
 router.put(
  '/removeMember/',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.userMemberCircle
  ],
  async (req: Request, res: Response) => {
    const circle = await CircleCollection.findOneByCircleId(req.body.id);
    const member = await UserCollection.findOneByUsername(req.body.member);
    const updated = await CircleCollection.removeMember(circle.id, req.body.member);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructCircleResponse(updated)
    });
  }
);

/**
 * Update the membership of a circle.
 *
 * @name PUT /api/circles/addFreet
 *
 * @param {string} id - The id of the circle to modify
 * @param {string} freetId - The id of the freet to add
 * @return {CircleResponse} - The updated circle
 * @throws {403} - If user is not logged in
 * @throws {403} - If the user is not the owner of the circle
 * @throws {404} - If the Circle ID is invalid (does not exist)
 */
 router.put(
  '/addFreet/',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.userNotMemberCircle
  ],
  async (req: Request, res: Response) => {
    const circle = await CircleCollection.findOneByCircleId(req.body.id);
    const freet = await FreetCollection.findOne(req.body.freetId);
    const updated = await CircleCollection.addFreet(circle.id, freet._id);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructCircleResponse(updated)
    });
  }
);

/**
 * Update the membership of a circle.
 *
 * @name PUT /api/circles/removeFreet
 *
 * @param {string} id - The id of the circle to modify
 * @param {string} member - The user to remove from the circle
 * @return {CircleResponse} - The updated circle
 * @throws {403} - If user is not logged in
 * @throws {403} - If the user is not the owner of the circle
 * @throws {404} - If the Circle ID is invalid (does not exist)
 * @throws {409} - If the member is not a part of the circle
 */
 router.put(
  '/removeFreet/',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.userMemberCircle
  ],
  async (req: Request, res: Response) => {
    const circle = await CircleCollection.findOneByCircleId(req.body.id);
    const freet = await UserCollection.findOneByUsername(req.body.freetId);
    const updated = await CircleCollection.removeFreet(circle.id, freet._id);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructCircleResponse(updated)
    });
  }
);

/**
 * Delete a circle.
 *
 * @name DELETE /api/circles:id
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the owner of the circle
 * @throws {404} - If the circle to delete does not exist
 */
router.delete(
  '/:circleId?',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const circle = await CircleCollection.findOneByCircleId(req.params.circleId);
    await CircleCollection.deleteOne(circle.id);
    res.status(200).json({
      message: 'Your circle has been deleted successfully.'
    });
  }
);

export {router as circleRouter};
