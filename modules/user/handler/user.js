import User from "../model/user.js";
import UserHelper from '../helper/user.js';
import Util from "../../util.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserHandler {
    async getAllUsers(req, res, next) {
        try {
            let docs = await UserHelper.getAllUsers();
            if(docs.length == 0) {
                res.status(404).json({
                    users: "No users found"
                });
            } else {
                res.status(200).json({
                    users: docs
                });
            }
        }catch(error) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    async signupUser(req, res, next) {
        try {
            const {name, email, password} = req.body;
            if(Util.isUndefinedString(name) || Util.isUndefinedString(email) || Util.isUndefinedString(password)) {
                res.status(400).json({
                    message: "Missing data"
                });
            }
            const existingUser = await UserHelper.findOneUser(email);
            if(existingUser != null || existingUser) {
                res.status(400).json({
                    message: "Email already exists"
                });
            } else {
                const user = await UserHelper.saveUser(name, email, password);
                res.status(200).json({
                    user
                })
            }
        }catch(error) {
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }

    async loginUser(req, res, next) {
        try {
            const {email, password} = req.body;
            if(Util.isUndefinedString(email) || Util.isUndefinedString(password)) {
                res.status(400).json({
                    message: "Missing data"
                });
            }
            const existingUser = await UserHelper.findOneUser(email);
            if(!existingUser) {
                res.status(404).json({
                    message: "User does not exist"
                });
            }
            const passwordMatch = bcrypt.compareSync(password, existingUser.password);
            if(!passwordMatch) {
                res.status(400).json({
                    message: "Incorrect password/email"
                });
            } else {
                const token = jwt.sign(
                    {
                        email : existingUser.email,
                        name : existingUser.name,
                        userId: existingUser._id
                    },
                    "thisIsASecretKey",
                    {
                        expiresIn: "1hr"
                    }
                );
                
                res.status(200).json({
                    messae: "Logged In",
                    token: token
                })
            }
        }catch(error) {
            res.status(500).json({
                message: "Internal server error"
            })
        }

    }

    init(app) {
        app.get("/api/user", this.getAllUsers);
        app.post("/api/user/signup", this.signupUser);
        app.post("/api/user/login", this.loginUser)
    }
}

export default new UserHandler();