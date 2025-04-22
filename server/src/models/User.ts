import mongoose ,{ Document, Schema } from 'mongoose';
export interface IUser extends Document {
  name:string;
  email:string;
  Websites: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Websites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Website',
    },
  ],
});
const User = mongoose.model<IUser>('User', userSchema);
export default User;