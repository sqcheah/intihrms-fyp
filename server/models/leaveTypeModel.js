import mongoose from 'mongoose';

const leaveTypeSchema = mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  count: { type: Number, required: true },
  color: { type: String, default: 'blue' },
});

const leaveTypeModel = mongoose.model('leaveType', leaveTypeSchema);

export default leaveTypeModel;
