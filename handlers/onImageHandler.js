import stages from "../helpers/stages.js"
import UserService from "../services/UserService.js"
import fs from 'fs'
import https from 'https';
import * as url from 'url';
import path from 'path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default async function (bot, msg) {
    const user = await UserService.getUserByTelegramIdAsync(msg.from.id)
    const stage = user.stage
    if (stage !== stages.image_input) {
        bot.sendMessage(msg.chat.id, 'Нет такого варианта ответа!')
    }
    const link = await bot.getFileLink(msg.photo[0].file_id)
    const fileFromTelegram = await bot.getFile(msg.photo[0].file_id)
    const extName = path.extname(fileFromTelegram.file_path)
    const file = fs.createWriteStream(`images/${msg.from.id}${extName}`);

    https.get(link, (response) => {
        response.pipe(file);
        file.on("finish", async () => {
            file.close();
            await UserService.updateUserByTelegramIdAsync({
                telegram_id: msg.from.id,
                image: `${msg.from.id}${extName}`,
                stage: stages.in_settings
            })
            const photo = `${__dirname}/../images/${user.image}`;
            bot.sendPhoto(msg.chat.id, photo, {
                caption: `${user.name}, Возраст - ${user.age}, ${user.description}`
            })
            bot.sendMessage(msg.chat.id, 'Поздравляем! Вы успешно заполнили профиль, напишите /find , чтобы начать подбор', {
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['/find'],
                        ['/editprofile'],
                        ['/showme']
                    ]
                })
            })
        });
    }).on("error", (err) => {
        bot.sendMessage(msg.chat.id, 'Не удалось установить картинку, попробуйте еще раз!')
    })
}