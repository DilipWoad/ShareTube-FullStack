import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        required:true
    }
    //TODO : only show users the videos that are publishes as true
},{timestamps:true})

//TODO : add a indexs for title and description

videoSchema.plugin(aggregatePaginate);

export const Video = mongoose.model("Video",videoSchema);