import type {Request, Response, NextFunction} from 'express';
import FollowCollection from '../follow/collection';

/**
 * Checks if a follow for user with userId in req.body exists
 */
const isFollowExists = async (req: Request, res: Response, next: NextFunction) => {
  const follow = await FollowCollection.findOne(req.body.userId);
  if (!follow) {
    res.status(404).json({
      error: {
        freetNotFound: `Follow for user with ID ${req.body.userId} does not exist.`
      }
    });
    return;
  }

  next();
};

export {
  isFollowExists,
};
