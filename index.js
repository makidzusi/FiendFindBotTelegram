import TelegramBot from "node-telegram-bot-api"
import './database/index.js'
import * as dotenv from 'dotenv'
import onStartHandler from "./handlers/onStartHandler.js";
import startStageHandler from "./handlers/startStageHandler.js";
import onImageHandler from "./handlers/onImageHandler.js";
import UserModel from "./models/UserModel.js";
import { faker } from '@faker-js/faker/locale/ru';
import stages from "./helpers/stages.js";
import findUserHandler from "./handlers/findUserHandler.js";
import client from './elkclient/index.js'

dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true
})

// bot.onText(/\/search\s(.+)/gm, async (msg) => {
//     const value = msg.text.substring(8, msg.text.length)
//     try {
//         const r = await client.search({
//             index: 'users',
//             query: {
//                 match: {
//                     description: value
                    
//                 }
//             }
//         })
//         const hits = r.hits.hits
//         if(!hits.length) {
//             bot.sendMessage(msg.from.id, 'Изивните, никого не нашлось, попробуйте еще!')
//             return
//         }
//         const rand = Math.floor(Math.random() * hits.length)
//         bot.sendMessage(msg.from.id, JSON.stringify(hits[rand]))
//         console.log('nice',r, r.hits.hits)
//     } catch(err) {
//         console.log(err)
//     }
// })

bot.onText(/\/start/, async (msg) => {
    onStartHandler(bot, msg);
})

bot.onText(/.*?/, async (msg) => {
    startStageHandler(bot, msg)
})

bot.on('photo', async (msg) => {
    onImageHandler(bot, msg)
})


bot.onText(/\/fakedata/, async (msg) => {
    const users = Array.from({ length: 10 }, (el, idx) => {
        return {
            name: faker.name.fullName(),
            age: faker.datatype.number(100),
            desription: `Test user description ${idx}`,
            telegram_id: faker.datatype.number(100000),
            city: faker.address.city(),
            image: 'fake.jpg',
            stage: stages.finished,
            description: faker.lorem.text(),
            t_username: 'sshev1'
        }
    })
    await UserModel.create(users)
})


