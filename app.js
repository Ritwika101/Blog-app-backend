import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import UserHandler from "./modules/user/handler/user.js";
import BlogHandler from "./modules/blog/handler/blog.js";
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(
    ""
);

UserHandler.init(app);
BlogHandler.init(app);


export default app;
