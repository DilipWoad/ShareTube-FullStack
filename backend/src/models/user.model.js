import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String,
    },
    password:{
        type:String,
        required:[true,"Password is Required"]
    },
    refreshToken:{
        type:String
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    
},{timestamps:true});


//adding bcrypt password
//using pre as mongoose middleware 
userSchema.pre('save',async function(next){
    //as this will be called evertime when an change happen 
    //we need to do this call only if password is changed
    if(!this.isModified("password")) return next();
    //call a function that takes the user send password
    //and encrpty it 
    this.password = await bcrypt.hash(this.password,10,);
    next();
})

//now for checking the password with encrptyed pass
//we can add a method to a schema and use that method
userSchema.methods.isCorrectPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}


//generating access and refresh token

//Acess Token -> For short LifeSpan
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            //payload
            _id : this._id,
            fullName : this.fullName,
            email : this.email,
            username : this.username
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//Refresh Token -> For longer LifeSpan
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            //payload
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User',userSchema);