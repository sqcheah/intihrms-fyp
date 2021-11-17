import mongoose from 'mongoose';
import trainingModel from '../models/trainingModel.js';
import leaveModel from '../models/leaveModel.js';
import mailer from 'nodemailer';
import holidayModel from '../models/holidayModel.js';
import moment from 'moment';
export const fetchAllTrainings = async (req, res) => {
  try {
    const trainings = await trainingModel
      .find({ trainingType: 'internal' })
      .populate([
        { path: 'user', select: 'first_name last_name' },
        { path: 'department', select: 'name' },
      ]);

    res.status(200).json(trainings);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
export const fetchTrainingById = async (req, res) => {
  const { id } = req.params;

  try {
    const training = await trainingModel.findById(id).populate([
      { path: 'user', select: 'first_name last_name' },
      { path: 'department', select: 'name' },
      { path: 'attendants', select: 'first_name last_name' },
    ]);

    res.status(200).json(training);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createTraining = async (req, res) => {
  const training = req.body;
  console.log(req.params, req.body);
  console.log('files', req.files);

  let filesArray = [];
  req.files.forEach((element) => {
    const file = {
      fileId: mongoose.Types.ObjectId(),
      fileName: element.originalname,
      filePath: element.path,
      fileType: element.mimetype,
      fileSize: fileSizeFormatter(element.size, 2),
    };
    console.log('1', element);
    filesArray.push(file);
  });
  const newTraining = new trainingModel({
    ...training,
    attachments: [...filesArray],
  });
  newTraining
    .save()
    .then((result) => {
      return res.status(201).json(newTraining);
    })
    .catch((error) => {
      return res.status(409).json({ message: error });
    });
};
export const updateTraining = async (req, res) => {
  const { id: _id } = req.params;
  const user_id = req.body.user_id;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No training with that id');

  const updatedTraining = await trainingModel
    .findByIdAndUpdate(
      _id,
      //https://www.codegrepper.com/code-examples/whatever/mongoose+push+to+subarray+if+not+exists
      { $addToSet: { attendants: user_id } },
      // { $push: { attendants: user_id } },
      { new: true, upsert: true }
    )
    .populate([
      { path: 'user', select: 'first_name last_name' },
      { path: 'department', select: 'name' },
      { path: 'attendants', select: 'first_name last_name' },
    ]);
  res.json(updatedTraining);
};
export const leaveTraining = async (req, res) => {
  const { id: _id } = req.params;
  const user_id = req.body.user_id;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No training with that id');

  const updatedTraining = await trainingModel
    .findByIdAndUpdate(
      _id,
      //https://www.codegrepper.com/code-examples/whatever/mongoose+push+to+subarray+if+not+exists
      { $pull: { attendants: user_id } },
      // { $push: { attendants: user_id } },
      { new: true, upsert: true }
    )
    .populate([
      { path: 'user', select: 'first_name last_name' },
      { path: 'department', select: 'name' },
      { path: 'attendants', select: 'first_name last_name' },
    ]);
  console.log(updateTraining);
  res.json(updatedTraining);
};
export const fetchExtTraining = async (req, res) => {
  const role = req.params.role;
  const id = req.params.user;
  const department = req.params.department;
  try {
    let trainings = [{}];
    if (role == 'admin') {
      trainings = await trainingModel
        .find({ trainingType: 'external' })
        .populate([
          { path: 'user', select: 'first_name last_name roles' },
          { path: 'department', select: 'name' },
        ])
        .exec((err, items) => {
          const filterItems = items.filter((item) => item.user._id != id);
          res.status(200).json(filterItems);
        });
    } else if (role == 'supervisor') {
      trainings = await trainingModel
        .find({
          $and: [{ trainingType: 'external' }],
        })
        .populate([
          {
            path: 'user',
            select: 'first_name last_name roles',
            populate: {
              path: 'roles',
              select: 'name',
              //match: { name: { $ne: 'admin' } },
            },
          },
          { path: 'department', select: 'name' },
        ])
        .exec((err, items) => {
          const filterItems = items.filter(
            (item) =>
              item.user.roles.name != 'admin' &&
              item.user._id != id &&
              item.department.name == department
          );
          res.status(200).json(filterItems);
        });
    } else res.status(200).json(trainings);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error });
  }
};
export const updateTrainingStatus = async (req, res) => {
  const { id: _id } = req.params;
  const training = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No training with that id');

  const updatedTraining = await trainingModel
    .findByIdAndUpdate(_id, { ...training, _id }, { new: true })
    .populate([
      { path: 'user', select: 'first_name last_name' },
      { path: 'department', select: 'name' },
    ]);
  res.json(updatedTraining);
};
export const fetchExtTrainingHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const trainings = await trainingModel
      .find({ $and: [{ trainingType: 'external' }, { user: id }] })
      .populate([
        { path: 'user', select: 'first_name last_name roles' },
        { path: 'department', select: 'name' },
      ]);
    res.status(200).json(trainings);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
export const fetchTrainingHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const trainings = await trainingModel
      .find({
        $and: [
          { trainingType: 'internal' },
          { $or: [{ attendants: id }, { user: id }] },
        ],
      })
      .populate([
        { path: 'user', select: 'first_name last_name roles' },
        { path: 'department', select: 'name' },
      ]);
    res.status(200).json(trainings);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
export const fetchUpcomingTraining = async (req, res) => {
  const { id } = req.params;
  var currentDate = moment().startOf('day');
  var date7Days = moment(currentDate).add(7, 'days');

  try {
    const trainings = await trainingModel
      .find({
        $and: [
          { $or: [{ attendants: id }, { user: id }] },
          { date: { $gte: currentDate } },
          { date: { $lte: date7Days } },
        ],
      })
      .populate([
        { path: 'user', select: 'first_name last_name roles' },
        { path: 'department', select: 'name' },
      ]);
    var limit2 = trainings.slice(0, 2);
    res.status(200).json(limit2);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
export const fetchTodayTrainings = async (req, res) => {
  var currentDate = moment().startOf('day');
  var next1Day = moment(currentDate).add(1, 'day');

  try {
    const trainings = await trainingModel
      .find({
        $and: [
          { trainingType: 'internal' },
          { date: { $gte: currentDate } },
          { date: { $lt: next1Day } },
        ],
      })
      .populate([
        { path: 'user', select: 'first_name last_name roles' },
        { path: 'department', select: 'name' },
      ]);
    res.status(200).json(trainings);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
//https://github.com/Musawirkhann/Nodejs_Mongodb_Express_Multer/blob/main/serverproject/controllers/fileuploaderController.js
const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const dm = decimal || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index]
  );
};

export const sendMail = async (req, res) => {
  let body = {
    from: 'test <csq3411@gmail.com>',
    to: 'shaoqi1688@gmail.com',
    subject: 'This is subject',
    html: '<h2>The html content</h2><br>',
  };

  const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  transporter.sendMail(body, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({
        msg: 'fail',
      });
      return false;
    }
    res.json({
      msg: 'success',
    });
    console.log('email sent');
  });
};
