import mongoose from 'mongoose';
//https://stackoverflow.com/questions/42019679/object-type-in-mongoose/43064841
const UserSchema = mongoose.Schema({
  emp_id: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  employment_date: { type: Date, required: true },
  password: { type: String, required: true },
  leaveCount: {
    casual: { type: Number, default: 19 },
    medical: { type: Number, default: 10 },
  },
  trainingHours: { type: Number, default: 60 },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'department',
    required: true,
  },
  /*
  position: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'position',
    required: true,
  },*/
  roles: { type: mongoose.Schema.Types.ObjectId, ref: 'roles', required: true },
  id: { type: String },
});

const userModel = mongoose.model('User', UserSchema);

export default userModel;
