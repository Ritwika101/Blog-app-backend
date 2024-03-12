import User from "../model/user.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
class UserHelper {
    async getAllUsers() {
        try {
            const docs = await User.find().exec();
            return docs;
        } catch(error) {
            throw error;
        }  
    }

    async findOneUser(email) {
        try {
            let user = await User.findOne({email: email}).exec();
            return user;
        } catch(error) {
            throw error;
        }

    }

    async findUserById(userId) {
        try {
            const user = await User.findById(userId).exec();
            return user;
        } catch(error) {
            throw error;
        }

    }

    async saveUser(name, email, password) {
        try {
            const hashedPassword = bcrypt.hashSync(password);
            const user = new User({_id: new mongoose.Types.ObjectId, name: name, email: email, password: hashedPassword, blogs: []});
            return await user.save();
        }catch(error) {
            throw error;
        }
    }

    async addBlogToUser(userId, blog, session) {
        try {
            const updatedUser = await User.updateOne({_id: userId}, {$push: {blogs: blog}}, {session});
            return updatedUser;
        }catch(error) {
            throw error;
        }
    }
}

export default new UserHelper();