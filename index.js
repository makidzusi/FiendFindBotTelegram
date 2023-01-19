import TelegramBot from "node-telegram-bot-api"
import './database/index.js'
import * as dotenv from 'dotenv'
import onStartHandler from "./handlers/onStartHandler.js";
import startStageHandler from "./handlers/startStageHandler.js";
import onImageHandler from "./handlers/onImageHandler.js";
import UserModel from "./models/UserModel.js";
import stages from "./helpers/stages.js";
import findUserHandler from "./handlers/findUserHandler.js";
dotenv.config()


const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true
})


bot.onText(/\/start/, async (msg) => {
    onStartHandler(bot, msg);
})

bot.onText(/.*?/, async (msg) => {
    startStageHandler(bot, msg)
})

bot.on('photo', async (msg) => {
    onImageHandler(bot, msg)
})

bot.onText(/\/find/, async (msg) => {
    findUserHandler(bot, msg)
})

bot.onText(/\/fakedata/, async (msg) => {
    const users = Array.from({ length: 10 }, (el, idx) => {
        return {
            name: `User ${idx}`,
            age: idx,
            desription: `Test user description ${idx}`,
            telegram_id: idx,
            city: 'Fake city',
            image: 'fake.jpg',
            stage: stages.finished,
            description: 'lorem ipsum'
        }
    })
    await UserModel.create(users)
})


