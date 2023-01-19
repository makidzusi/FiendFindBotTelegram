import mongoose from "mongoose"

mongoose.connect('mongodb://localhost:27017/bot_node_telegram', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDb connected'))
.catch((err) => console.log('Error MongoDb connect', err))