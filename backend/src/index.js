import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "/env",
});


connectDB()
.then(()=>{
  app.listen(process.env.PORT, () => {
  console.log("Server Running... at PORT : ", process.env.PORT);
});
})
.catch((err)=>{
  console.log("MongoDB to Server Connection error",err);
})


// (async ()=>{
//     //alway try catch for DataBase
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",(error)=>{
//             console.log("Error : ",error);
//             throw error;
//         })

//         //also start the server
//         app.listen(process.env.PORT,()=>{
//             "Mongo Db Connected and Server is UP at PORT : ",process.env.PORT
//         })
//     } catch (error) {
//         console.log("Error : ",error)
//     }
// })()
