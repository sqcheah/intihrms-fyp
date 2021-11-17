import mongoose from 'mongoose';

const leaveSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department',
    required: true,
  },
  title: { type: String, required: true },
  reason: { type: String, required: true },
  leaveType: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  attachments: [],
});

const leaveModel = mongoose.model('leave', leaveSchema);

export default leaveModel;
