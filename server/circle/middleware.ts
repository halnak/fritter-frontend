import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import CircleCollection from './collection';

/**
 * Checks if the user with userId already a member of the circle
 */
 const userMemberCircle = async (req: Request, res: Response, next: NextFunction) => {
  const isMember = await CircleCollection.isMember(req.body.circleId, req.body.userId);
  if (!isMember) {
    res.status(409).json({
      error: {
        freetNotFound: `User with ID ${req.body.userId} is not a  member of the circle with ID ${req.body.circleId}.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the user with userId is not a member of the given circle
 */
 const userNotMemberCircle = async (req: Request, res: Response, next: NextFunction) => {
  const isMember = await CircleCollection.isMember(req.body.circleId, req.body.userId);
  if (isMember) {
    res.status(409).json({
      error: {
        freetNotFound: `User with ID ${req.body.userId} is already a member of the circle with ID ${req.body.circleId}.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a circle already exists
 */
 const isCircleExists = async (req: Request, res: Response, next: NextFunction) => {
  var circle = await CircleCollection.findOneByCircleId(req.body.circleId);
  if (!circle) {
    res.status(404).json({
      error: {
        freetNotFound: `Circle with ${req.body.circleId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a circle already exists
 */
 const isCircleNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const circle = await CircleCollection.findOneByCircleId(req.body.circleId);
  if (circle) {
    res.status(404).json({
      error: {
        freetNotFound: `Circle with ${req.body.circleId} already exists.`
      }
    });
    return;
  }

  next();
};

export {
  userMemberCircle,
  userNotMemberCircle,
  isCircleExists,
  isCircleNotExists
};