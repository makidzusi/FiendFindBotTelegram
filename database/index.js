import mongoose from "mongoose"

import * as dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDb connected'))
.catch((err) => console.log('Error MongoDb connect', err))