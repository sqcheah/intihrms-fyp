import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  content: {
    id: { type: String, required: true }, //notification link to refer to
    message: { type: String, required: true },
    status: { type: String, required: true }, //notification type reminder/status
    type: { type: String, required: true }, //training/ leave
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: { type: Date, default: new Date() },
  status: { type: String, default: 'unread' }, //notification status
});

const notificationModel = mongoose.model('notification', notificationSchema);

export default notificationModel;
