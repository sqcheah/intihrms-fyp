import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import notificationModel from '../models/notificationModel.js';

export const createNotifcation = async (req, res) => {
  const notification = req.body;
  const newNotification = new notificationModel(notification);
  newNotification.save();
};
export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
