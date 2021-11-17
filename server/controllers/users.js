import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import passwordGenerator from 'generate-password';

import userModel from '../models/userModel.js';
import { sendMail } from '../service/email.js';
import dotenv from 'dotenv';
dotenv.config();
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel
      .findOne({ email })
      .populate('department roles');
    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exist' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await userModel.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const createUser = async (req, res) => {
  const staff = req.body;
  try {
    const existingUser = await userModel.findOne({ email: staff.email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exist' });

    const hashedPassword = await bcrypt.hash(staff.password, 12);
    const result = await userModel.create({
      ...staff,
      password: hashedPassword,
    });
    await sendMail({
      type: 'createUser',
      email: staff.email,
      password: staff.password,
    });
    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find().populate('department roles');
    res.status(200).json(users);
  } catch (error) {
    console.log(err);
    res.status(404).json({ message: error });
  }
};
export const getUser = async (req, res) => {
  const { id: _id } = req.params;

  try {
    const user = await userModel.findById(_id).populate('department roles');
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const updateUser = async (req, res) => {
  const { id: _id } = req.params;
  const user = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No leave with that id');
  //const updatedUser = await userModel.find({});
  const updatedUser = await userModel
    .findByIdAndUpdate(_id, { ...user, _id }, { new: true })
    .populate([
      { path: 'user', select: 'first_name last_name' },
      { path: 'department', select: 'name' },
    ]);
  res.json(updatedUser);
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  const newPassword = passwordGenerator.generate({
    numbers: true,
    symbols: true,
  });
  await sendMail({ type: 'resetPassword', email, password: newPassword });

  /* const updatedUser = await userModel.findOneAndUpdate(
    { email },
    { password: newPassword },
    { new: true }
  );*/
  const updatedUser = await userModel.findOne({ email });
  console.log(updatedUser);
  res.json(updatedUser);
};

export const fetchDeptUsers = async (req, res) => {
  const { department } = req.params;

  try {
    const users = await userModel.find({ department: department }).populate([
      { path: 'department', select: 'name code' },
      { path: 'roles', select: 'name' },
    ]);
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
