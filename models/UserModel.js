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
});

userSchema.index({name: 'text', 'description': 'text'});
const UserModel = mongoose.model('User', userSchema);

export default UserModel