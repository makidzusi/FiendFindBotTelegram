import UserService from "../services/UserService.js";
import * as url from 'url'
import stages from "../helpers/stages.js";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default async function (bot, msg) {
    const finded_user = await UserService.getRandomUserAsync(msg.from.id)
    if(!finded_user) {
        
        bot.sendMessage(msg.chat.id, 'Извините, ничего не нашлось :(')
        return
    }
    
    UserService.updateUserByTelegramIdAsync({
        telegram_id: msg.from.id,
        current_viewed_profile: finded_user.id,
        stage: stages.review_profile
    })
    const photo = `${__dirname}/../images/${finded_user.image}`;
    

    bot.sendPhoto(msg.chat.id, photo, {
        reply_markup: JSON.stringify({
            keyboard: [
                ['👍', '👎', '⚙️'],
            ]
        }),
        caption: `${finded_user.name}, Вораст - ${finded_user.age}, Город - ${finded_user.city}, ${finded_user?.description || ''}, ссылка на профиль: @${finded_user?.t_username}`
    })
}