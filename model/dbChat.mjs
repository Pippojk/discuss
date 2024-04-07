import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
    partecipanti: [{ type: String }],
    name: String
});

export default mongoose.model('chatContent', chatSchema);