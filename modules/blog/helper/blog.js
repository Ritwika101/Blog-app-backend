import Blog from "../model/blog.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import blog from "../model/blog.js";

class BlogHelper {
    async getAllBlogs() {
        try {
            const docs = await Blog.find().exec();
            return docs;
        } catch(error) {
            throw error;
        }  
    }
    async getById(blogId) {
        try {
            const docs = await Blog.findById(blogId).exec();
            return docs;
        } catch(error) {
            throw error;
        }  
    }

    async saveBlog(title, description, image, user, session) {
        try {
            const blog = new Blog({
                _id: new mongoose.Types.ObjectId, title: title, description: description, image: image, user: user
            });
            const savedBlog = await blog.save({session});
            return savedBlog;
        }catch(error) {
            throw error;
        }
    }

    async updateBlog(blogId, updateOps) {
        try {
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateOps, {new: true});
            //const updatedBlog = await Blog.updateOne({_id : blogId}, {$set: updateOps}, {new: true}).exec();
            return updatedBlog;
        }catch(error) {
            throw error;
        }
    }

    async deleteById(blogId) {
        try {
            const blog = await Blog.findByIdAndDelete(blogId).populate("user");
            if(blog) {
                await blog.user.blogs.pull(blog);
                await blog.user.save();
            }
            
        }catch(error) {
            throw error;
        }
    }
}

export default new BlogHelper();