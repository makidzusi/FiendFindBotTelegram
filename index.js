import TelegramBot from "node-telegram-bot-api"
import './database/index.js'
import UserService from "./services/UserService.js"
import * as url from 'url';
import fs from 'fs'
import https from 'https';
import * as dotenv from 'dotenv'
import path from 'path';
dotenv.config()
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true
})


bot.onText(/\/start/, async (msg) => {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['👋 Давай начнем'],
            ]
        })
    };
    const result = await UserService.createUser(msg.from.id)
    if(result === null) {
        bot.sendMessage(msg.chat.id, 'У вас уже есть профиль')
    } else {
        bot.sendMessage(msg.chat.id, 'Привет, твой профиль в боте успешно создан, давай заполним его!', opts)
    }

})

bot.onText(/👋 Давай начнем/, (msg) => {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['Ok 👌'],
            ]
        })
    };
    bot.sendMessage(msg.chat.id, `❗️Помни, что в интернете люди могут выдавать себя за других.
    Бот не запрашивает личные данные и не идентифицирует пользователей по паспортным данным. Продолжая ты соглашаешься с использованием бота на свой страх и риск.`, opts)
})
bot.onText(/img/, (msg) => {
    const photo = `${__dirname}/images/img.jpg`;
    console.log(photo)
    
    bot.sendPhoto(msg.chat.id, photo, {
        caption: "I'm a bot!"
      })
})

bot.on('photo', async (msg) => {
    if (msg.photo && msg.photo[0]) {

        const link = await bot.getFileLink(msg.photo[0].file_id)
        const f = await bot.getFile(msg.photo[0].file_id)
        const extName = path.extname(f.file_path)
        const file = fs.createWriteStream(`images/${msg.from.id}${extName}`);
        https.get(link, (response) => {
            response.pipe(file);
            file.on("finish", async () => {
                file.close();
                await UserService.updateUserByTelegramIdAsync({
                    telegram_id: msg.from.id,
                    image: `${msg.from.id}${extName}`
                })
                console.log("Download Completed");
            });
        }).on("error", (err) => {
            console.log(err)
        })
        
    }
})

bot.onText(/Ok 👌/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Сколько тебе лет?')
})

bot.on(/\d+/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Из какого ты города?')
})
bot.onText(/id/, (msg) => {
    bot.sendMessage(msg.chat.id, JSON.stringify(msg.from.id))
})

bot.on("polling_error", console.log);

bot.onText(/\/myprofile/, async (msg) => {
    const user = await UserService.getUserByTelegramIdAsync(msg.from.id);
    const photo = `${__dirname}/images/${user.image}`;
    bot.sendPhoto(msg.chat.id, photo, {
        caption: `${user?.name}, ${user?.age}, ${user?.description}`
    })
})

