import mongoose from 'mongoose';

const policySchema = mongoose.Schema({
  name: { type: String, required: true },
  stacked: { type: Boolean },
  list: [],
});

const policyModel = mongoose.model('policy', policySchema);

export default policyModel;
