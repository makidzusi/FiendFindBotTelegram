import UserService from "../services/UserService.js";
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default async function (bot, msg) {
    const finded_user = await UserService.getRandomUserAsync(msg.from.id)
    if(!finded_user) {
        
        bot.sendMessage(msg.chat.id, 'Извините, ничего не нашлось :(')
        return
    }
    console.log(finded_user)
    UserService.updateUserByTelegramIdAsync({
        telegram_id: msg.from.id,
        current_viewed_profile: finded_user.id
    })
    const photo = `${__dirname}/../images/${finded_user.image}`;
    

    bot.sendPhoto(msg.chat.id, photo, {
        caption: `${finded_user.name}, Вораст - ${finded_user.age}, Город - ${finded_user.city}, ${finded_user?.description || ''}, ссылка на профиль: @${finded_user?.t_username}`
    })
}