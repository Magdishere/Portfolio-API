import jwt from 'jsonwebtoken';
import { getUsersCollection } from '../db.js';
import { ObjectId } from 'mongodb';

export const requireAuth = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usersCollection = getUsersCollection();
      req.user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) }, { projection: { password: 0 } });
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
