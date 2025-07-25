import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
export const app = express();

//server configuration

//1)Using CORS cross-origin server it is use to configure which url are allowed to access our server
app.use(
  cors({
    origin: process.env.CROSS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options('*', cors());

//2) What if the data comes in json() format
//this make sure server can handle json files
app.use(express.json({ limit: "20kb" }));

//3) What if the data comes from the url(?=fnv+kenlkrnv+flkn)
//use the urlencoder to easily read the info from a url
app.use(express.urlencoded({ limit: "20kb", extended: true }));

//4) What if a file are send from user (pdf,img,video etc)
//we can use multer to do so
//but we can store the file on server before sending to other cloud file storage
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

//5)To able to read and write from backend server to user browser cookie
//so we use cookie-parser
app.use(cookieParser());

//Afer all configuration now we add route
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import likeRouter from "./routes/like.route.js";
import playlistRouter from "./routes/playlist.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import healthcheckRouter from "./routes/healthcare.route.js";
import authenticationRouter from "./routes/isAuthenticted.route.js";
//add as a middleware
app.use("/api/v1/user", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/health", healthcheckRouter);
app.use("/api/v1/status", authenticationRouter);
