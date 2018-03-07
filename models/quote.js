import mongoose, {Schema} from 'mongoose';

export default mongoose.model('Quote', new Schema({
  data: {
    type: String,
    required: true
  },{
    timestamps: true
  }
}));
