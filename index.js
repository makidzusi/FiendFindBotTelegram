import TelegramBot from "node-telegram-bot-api"
import './database/index.js'
import * as dotenv from 'dotenv'
import onStartHandler from "./handlers/onStartHandler.js";
import startStageHandler from "./handlers/startStageHandler.js";
import onImageHandler from "./handlers/onImageHandler.js";
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


