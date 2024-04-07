import mongoose from "mongoose";

const discussSchema = mongoose.Schema({
    message: String,
    name: String,
    recived: Boolean,
    chatName: String
});

export default mongoose.model('messageContents', discussSchema);

