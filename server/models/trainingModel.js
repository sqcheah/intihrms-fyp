import mongoose from 'mongoose';

const trainingSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'department' },
  title: { type: String },
  description: { type: String },
  date: { type: Date },
  time: { type: String },
  duration: { type: Number },
  attendants: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'User',
  },
  trainingType: { type: String },
  status: { type: String },
  organization: { type: String },
  attachments: [],
});

const trainingModel = mongoose.model('training', trainingSchema);

export default trainingModel;
