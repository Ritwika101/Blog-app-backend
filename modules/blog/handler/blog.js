
import BlogHelper from '../helper/blog.js';
import Util from "../../util.js";
import UserHelper from "../../user/helper/user.js"
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

class BlogHandler {
    
    async checkAuthorization(req,res,next){  //checks authorization while logging in
        if(Util.isUndefinedString(req.headers.authorization)){
            res.status(401).json({
                message : 'Authorization failed'
            });
            return;
        }
        const token = req.headers.authorization.split(" ")[1];
        try{       
            const decoded = jwt.verify(token, "thisIsASecretKey");
            console.log("Authorization Success with JWT Token");
            req.userId = decoded.userId;
            next();
        }catch(error){
            res.status(401).json({
                message : 'Authorization failed'
            });
        } 
    }

    async getAllBlogs(req, res, next) {
        try {
            let docs = await BlogHelper.getAllBlogs();
            if(docs.length == 0) {
                res.status(404).json({
                    users: "No blogs found"
                });
            } else {
                res.status(200).json({
                    blogs: docs
                });
            }
        }catch(error) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    async getBlogById(req, res, next) {
        try {
            const blogId = req.params.id;
            const blog = await BlogHelper.getById(blogId);
            res.status(200).json({blog});
        }catch(error) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    async addBlog(req, res, next) {
        try {
            const {title, description, image} = req.body;
            const user = req.userId;
            if(Util.isUndefinedString(title) || Util.isUndefinedString(description) || Util.isUndefinedString(image)) {
                res.status(400).json({
                    message: "Missing data"
                });
            }
            const existingUser = await UserHelper.findUserById(user);
            if(!existingUser) {
                res.status(404).json({
                    message: "User does not exist"
                });
            }
            try {
                const session = await mongoose.startSession();
                session.startTransaction();
                const blog = await BlogHelper.saveBlog(title, description, image, user, session);
                await UserHelper.addBlogToUser(existingUser._id, blog, session);
                await session.commitTransaction();
                res.status(200).json({blog});
            }catch(error) {
                throw error;
            }
            
        }catch(error) {
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }

    async updateBlog(req, res, next) {
        try {
            const blogId = req.params.id;
            const {title, description} = req.body;
            const blog = await BlogHelper.getById(blogId);
            if(!blog) {
                res.status(404).json({
                    message: "Blog does not exist"
                });
            }
            const updatedBlog = await BlogHelper.updateBlog(blogId, {title, description});
            res.status(200).json({updatedBlog});
        }catch(error) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    async deleteBlogById(req, res, next) {
        try {
            const blogId = req.params.id;
            await BlogHelper.deleteById(blogId);
            res.status(200).json({message: "Deleted blog"});
        }catch(error) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    init(app) {
        app.get("/api/blog", this.getAllBlogs);
        app.get("/api/blog/:id", this.checkAuthorization, this.getBlogById)
        app.post("/api/blog/add", this.checkAuthorization, this.addBlog);
        app.patch("/api/blog/update/:id", this.checkAuthorization, this.updateBlog);
        app.delete("/api/blog/:id", this.checkAuthorization, this.deleteBlogById)
    }
}

export default new BlogHandler();