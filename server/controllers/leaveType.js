import mongoose from 'mongoose';
import leaveTypeModel from '../models/leaveTypeModel.js';

export const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await leaveTypeModel.find();
    res.status(200).json(leaveTypes);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
export const getLeaveType = async (req, res) => {
  const { id } = req.params;

  try {
    const leaveType = await leaveTypeModel.findById(id);
    res.status(200).json(leaveType);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createLeaveType = async (req, res) => {
  const leaveType = req.body;
  const newLeaveType = new leaveTypeModel(leaveType);

  newLeaveType
    .save()
    .then((result) => {
      return res.status(201).json(newLeaveType);
    })
    .catch((error) => {
      return res.status(409).json({ message: error });
    });
};
export const updateLeaveType = async (req, res) => {
  const { id: _id } = req.params;
  const leaveType = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No leave with that id');
  const updatedLeaveType = await leaveTypeModel.findByIdAndUpdate(
    _id,
    { ...leaveType, _id },
    { new: true }
  );
  res.json(updatedLeaveType);
};
