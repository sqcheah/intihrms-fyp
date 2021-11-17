import mongoose from 'mongoose';

const trainingEventSchema = mongoose.Schema({
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

const trainingEventModel = mongoose.model('trainingEvent', trainingEventSchema);

export default trainingEventModel;
