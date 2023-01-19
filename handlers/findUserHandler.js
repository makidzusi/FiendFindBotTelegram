import UserService from "../services/UserService.js";
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default async function (bot, msg) {
    const finded_user = await UserService.getRandomUserAsync(msg.from.id)
    if(!finded_user) {
        bot.sendMessage(msg.chat.id, 'Извините, ничего не нашлось :(')
    }
    const photo = `${__dirname}/../images/${finded_user.image}`;
    

    bot.sendPhoto(msg.chat.id, photo, {
        caption: `${finded_user.name}, Вораст - ${finded_user.age}, Город - ${finded_user.city}, ${finded_user?.description || ''}`
    })
}