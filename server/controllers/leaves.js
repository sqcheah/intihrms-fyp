import mongoose from 'mongoose';
import leaveModel from '../models/leaveModel.js';
import mailer from 'nodemailer';
import holidayModel from '../models/holidayModel.js';
import moment from 'moment';
export const fetchAllLeaves = async (req, res) => {
  try {
    const leaves = await leaveModel.find().populate([
      { path: 'user', select: 'first_name last_name' },
      { path: 'department', select: 'name' },
    ]);
    res.status(200).json(leaves);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
export const fetchLeaveById = async (req, res) => {
  const { id } = req.params;
  try {
    const leave = await leaveModel.findById(id).populate([
      { path: 'user', select: 'first_name last_name' },
      { path: 'department', select: 'name' },
    ]);
    console.log(leave);
    res.status(200).json(leave);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error });
  }
};

export const createLeave = async (req, res) => {
  const leave = req.body;
  console.log(req.body);
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
  const newLeave = new leaveModel({
    ...leave,
    attachments: [...filesArray],
  });
  newLeave
    .save()
    .then((result) => {
      return res.status(201).json(newLeave);
    })
    .catch((error) => {
      return res.status(409).json({ message: error });
    });
};
export const updateLeave = async (req, res) => {
  const { id: _id } = req.params;
  const leave = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No leave with that id');
  //mongoose
  const updatedLeave = await leaveModel
    .findByIdAndUpdate(_id, { ...leave, _id }, { new: true })
    .populate([
      { path: 'user', select: 'first_name last_name' },
      { path: 'department', select: 'name' },
    ]);
  res.json(updatedLeave);
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

export const fetchLeaveByDateRange = async (req, res) => {
  console.log('here');
  const { fromDate, toDate } = req.body;
  try {
    const leaves = await leaveModel
      .find({
        $and: [
          { fromDate: { $gte: new Date(fromDate) } },
          { toDate: { $lte: new Date(toDate) } },
          { status: 'approve' },
        ],
      })
      .populate([
        { path: 'user', select: 'first_name last_name roles' },
        { path: 'department', select: 'name' },
      ])
      .exec();

    //https://stackoverflow.com/questions/62970611/return-match-item-only-from-array-of-object-mongoose
    const holidays = await holidayModel
      .aggregate([
        { $unwind: { path: '$lists' } },
        { $replaceRoot: { newRoot: '$lists' } },
        {
          $match: {
            $and: [
              { startDate: { $gte: new Date(fromDate) } },
              { endDate: { $lte: new Date(toDate) } },
            ],
          },
        },
      ])
      .exec();
    console.log(leaves);
    console.log(holidays);
    res.status(200).json({ leaves, holidays });
  } catch (error) {
    console.log(err);
    res.status(404).json({ message: error });
  }
};
export const fetchLeaveRequests = async (req, res) => {
  const role = req.params.role;
  const id = req.params.user;
  const department = req.params.department;
  try {
    let leaves = [{}];
    if (role == 'admin') {
      leaves = await leaveModel
        .find({})
        .populate([
          { path: 'user', select: 'first_name last_name roles' },
          { path: 'department', select: 'name' },
        ])
        .exec((err, items) => {
          const filterItems = items.filter((item) => item.user._id != id);
          res.status(200).json(filterItems);
        });
    } else if (role == 'supervisor') {
      leaves = await leaveModel
        .find({
          $and: [{}],
        })
        .populate([
          {
            path: 'user',
            select: 'first_name last_name roles',
            populate: {
              path: 'roles',
              select: 'name',
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
    } else res.status(200).json(leaves);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error });
  }
};

export const fetchUpcomingLeaves = async (req, res) => {
  const { id } = req.params;
  var currentDate = moment().startOf('day');
  var date7Days = moment(currentDate).add(7, 'days');

  try {
    const leaves = await leaveModel
      .find({
        $and: [
          { user: id },
          { status: 'approve' },
          { fromDate: { $gte: currentDate } },
          { fromDate: { $lte: date7Days } },
        ],
      })
      .populate([
        { path: 'user', select: 'first_name last_name roles' },
        { path: 'department', select: 'name' },
      ]);
    var limit2 = leaves.slice(0, 2);
    res.status(200).json(limit2);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
export const fetchLeaveHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const leaves = await leaveModel.find({ user: id }).populate([
      { path: 'user', select: 'first_name last_name roles' },
      { path: 'department', select: 'name' },
    ]);
    res.status(200).json(leaves);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
export const fetchTodayLeaves = async (req, res) => {
  var currentDate = moment().startOf('day');
  var next1Day = moment(currentDate).add(1, 'day');

  try {
    const leaves = await leaveModel
      .find({
        $and: [
          { status: 'approve' },
          {
            $or: [
              {
                $and: [
                  { fromDate: { $lte: currentDate } },
                  { toDate: { $gte: currentDate } },
                ],
              },
              {
                $and: [
                  { fromDate: { $gte: currentDate } },
                  { fromDate: { $lt: next1Day } },
                ],
              },
            ],
          },
        ],
      })
      .populate([
        { path: 'user', select: 'first_name last_name roles' },
        { path: 'department', select: 'name' },
      ]);
    res.status(200).json(leaves);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
