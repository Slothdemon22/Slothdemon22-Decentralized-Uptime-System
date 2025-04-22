import mongoose from "mongoose";
import { Document, Schema } from "mongoose";


interface IWebsiteTick extends Document {
  validatorID: mongoose.Types.ObjectId;

  status: "Good" | "Bad";
  latency: number;
  statusCode: number;

}

const WebsiteTickSchema = new Schema({
  validatorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Validator",
    required: true,
  },
  
  status: {
    type: String,
    enum: ["Good", "Bad"],
    required: true,
  },
    latency: {
        type: Number,
        required: true,
    },
    statusCode: {
        type: Number,
        required: true,
    }
},{ timestamps: true });
const WebsiteTick = mongoose.model<IWebsiteTick>("WebsiteTick", WebsiteTickSchema);
export default WebsiteTick;