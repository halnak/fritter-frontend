import type {Request, Response, NextFunction} from 'express';
import { ObjectId } from 'mongoose';
import LikeCollection from './collection';

/**
 * Checks if the user with userId already liked the freet with freetId
 */
const userLikedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const hasLiked = await LikeCollection.hasLiked(req.body.userId, req.body.freetId);
  if (!hasLiked) {
    res.status(409).json({
      error: {
        freetNotFound: `User with ID ${req.body.userId} has not liked freet with ID ${req.body.freetId}.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the user with userId has not liked the freet with freetId
 */
 const userUnlikedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const hasLiked = await LikeCollection.hasLiked(req.body.userId, req.body.freetId);
  if (hasLiked) {
    res.status(409).json({
      error: {
        freetNotFound: `User with ID ${req.body.userId} has already liked the freet with ID ${req.body.freetId}.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a like object for the freet with freetId already exists
 */
 const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  var like = await LikeCollection.findOne(req.body.freetId);
  if (!like) {
    res.status(404).json({
      error: {
        freetNotFound: `Like with ${req.body.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a like object for the freet with freetId does not already exist
 */
 const isLikeNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findOne(req.body.freetId);
  if (like) {
    res.status(404).json({
      error: {
        freetNotFound: `Like with ${req.body.freetId} already exists.`
      }
    });
    return;
  }

  next();
};

export {
  userLikedFreet,
  userUnlikedFreet,
  isLikeExists,
  isLikeNotExists
};
