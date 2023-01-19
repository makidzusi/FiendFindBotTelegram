import mongoose from 'mongoose';
const { Schema } = mongoose;

const LikeSchema = new Schema({
    source_user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    target_user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const LikeModel = mongoose.model('Like', LikeSchema);

export default LikeModel