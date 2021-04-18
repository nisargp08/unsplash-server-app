import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  location: {
    type: String,
    required: true,
  },
  aws_key: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Photo = mongoose.model('photo', PhotoSchema);

export default Photo;
