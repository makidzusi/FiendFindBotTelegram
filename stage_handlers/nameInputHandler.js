import stages from "../helpers/stages.js"
import UserService from "../services/UserService.js"

export default async function(bot,msg) {
    const name = msg.text
    UserService.updateUserByTelegramIdAsync({
        name: name,
        telegram_id: msg.from.id,
        stage: stages.description_input
    })
    bot.sendMessage(msg.chat.id, 'Отлично! Теперь введите коротко о себе')
}