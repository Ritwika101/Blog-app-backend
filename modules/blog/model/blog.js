import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        minlength: 6
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
});

export default mongoose.model("Blog", BlogSchema);