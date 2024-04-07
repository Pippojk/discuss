import mongoose from "mongoose";

const user = mongoose.Schema({
    key: {type: String, unique: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});
export default mongoose.model('loginContent', user);


