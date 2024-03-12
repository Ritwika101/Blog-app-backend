import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    blogs: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Blog",
            required: true
        }
    ]
});

export default mongoose.model("User", UserSchema);