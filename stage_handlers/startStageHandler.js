import UserService from "../services/UserService.js"
import stages from "../helpers/stages.js"

export default async function (bot, msg) {
    UserService.updateUserByTelegramIdAsync({
        telegram_id: msg.from.id,
        stage: stages.age_input,
    })
    bot.sendMessage(msg.chat.id, 'Сколько вам лет?', {
        reply_markup: JSON.stringify({
            remove_keyboard: true
        })
    })
}