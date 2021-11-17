import mongoose from 'mongoose';

const trainingSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainingEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trainingEvent',
    required: true,
  },
  status: { type: String, default: 'pending' },
  attachments: [],
});

const trainingModel = mongoose.model('training', trainingSchema);

export default trainingModel;
