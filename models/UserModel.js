import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    age: Number,
    description: String,
    telegram_id: String,
    city: String,
    isActiveProfile: Boolean,
    image: String,
    stage: String,
    t_username: String,
    current_viewed_profile: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

userSchema.index({name: 'text', 'description': 'text'});
const UserModel = mongoose.model('User', userSchema);

export default UserModel