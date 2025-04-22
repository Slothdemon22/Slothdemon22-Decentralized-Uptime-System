import mongoose from "mongoose";
import { Document, Schema } from "mongoose";



interface IValidator extends Document {
 publicKey: string;
 ip: string;
 location:string;
 payment:number
}
const ValidatorSchema = new Schema({
  publicKey: {
    type: String,
    required: true,
    unique: true,
  },
  ip: {
    type: String,
    required: true,
  },
  location:{
    type:String,
    required:true
  },
  payment:{
    type:Number,
    default:0
  }
}, { timestamps: true });
const Validator = mongoose.model<IValidator>("Validator", ValidatorSchema);
export default Validator;
  