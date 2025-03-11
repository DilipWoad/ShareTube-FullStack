import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    //for now it just text based post
    //in future try for text+IMG post
    content:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})


export const Post = mongoose.model("Post",postSchema);