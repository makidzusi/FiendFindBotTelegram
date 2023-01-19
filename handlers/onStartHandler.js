import UserService from "../services/UserService.js"
import stages from '../helpers/stages.js'

export default async function (bot, msg) {
    const opts = {
        reply_to_message_id: msg.message_id,
        resize_keyboard: true,
        one_time_keyboard: true,
        reply_markup: JSON.stringify({
            keyboard: [
                ['👋 Давай начнем'],
            ]
        })
    };
    const result = await UserService.createUser(msg.from.id);
    if (result === null) {
        bot.sendMessage(msg.chat.id, 'У вас уже есть профиль')
    } else {
        await UserService.updateUserByTelegramIdAsync({
            telegram_id: msg.from.id,
            stage: stages.start
        })
        bot.sendMessage(msg.chat.id, 'Привет, твой профиль в боте успешно создан, давай заполним его!', opts)
    }
}