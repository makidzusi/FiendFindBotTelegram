import stages from "../helpers/stages.js"
import UserService from "../services/UserService.js"

export default async function (bot, msg) {
    const description = msg.text
    UserService.updateUserByTelegramIdAsync({
        description: description,
        telegram_id: msg.from.id,
        stage: stages.image_input
    })
    bot.sendMessage(msg.chat.id, 'Прекрасно! Теперь отправь фото, которое будет использоваться в анкете')
}