import mongoose from "mongoose";
import { Document, Schema } from "mongoose";
interface IWebsite extends Document {
    url:string;
    userID:mongoose.Types.ObjectId;
    Ticks:mongoose.Types.ObjectId[];
    disabled:boolean;
}




const WebsiteSchema=new Schema({

    url:{
        type:String,
        required:true,
        unique:true
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    disabled:{
        type:Boolean,
        default:false
    },
    Ticks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'WebsiteTick'
    }]
},{ timestamps:true})
const Website=mongoose.model<IWebsite>('Website',WebsiteSchema);
export default Website;