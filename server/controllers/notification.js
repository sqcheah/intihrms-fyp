import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import notificationModel from '../models/notificationModel.js';

export const getNotificationsById = async (req, res) => {
  const { id } = req.params;
  try {
    const notifications = await notificationModel
      .find({
        recipient: mongoose.Types.ObjectId(id),
      })
      .sort('-createdAt')
      .populate('sender');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
