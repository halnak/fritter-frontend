import type {Request, Response, NextFunction} from 'express';
import { ObjectId } from 'mongoose';
import RefreetCollection from './collection';

/**
 * Checks if the user with userId already Refreeted the freet with freetId
 */
const userRefreetedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const hasRefreeted = await RefreetCollection.hasRefreeted(req.body.userId, req.body.freetId);
  if (!hasRefreeted) {
    res.status(409).json({
      error: {
        freetNotFound: `User with ID ${req.body.userId} has not refreeted the freet with ID ${req.body.freetId}.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the user with userId has not Refreetd the freet with freetId
 */
 const userUnRefreetedFreet = async (req: Request, res: Response, next: NextFunction) => {
  const hasRefreeted = await RefreetCollection.hasRefreeted(req.body.userId, req.body.freetId);
  if (hasRefreeted) {
    res.status(409).json({
      error: {
        freetNotFound: `User with ID ${req.body.userId} has already refreeted freet with ID ${req.body.freetId}.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a Refreet object for the freet with freetId already exists
 */
 const isRefreetExists = async (req: Request, res: Response, next: NextFunction) => {
  var refreet = await RefreetCollection.findOne(req.body.freetId);
  if (!refreet) {
    res.status(404).json({
      error: {
        freetNotFound: `Refreet with ${req.body.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a Refreet object for the freet with freetId does not already exist
 */
 const isRefreetNotExists = async (req: Request, res: Response, next: NextFunction) => {
  const refreet = await RefreetCollection.findOne(req.body.freetId);
  if (refreet) {
    res.status(404).json({
      error: {
        freetNotFound: `Refreet with ${req.body.freetId} already exists.`
      }
    });
    return;
  }

  next();
};

export {
  userRefreetedFreet,
  userUnRefreetedFreet,
  isRefreetExists,
  isRefreetNotExists
};
