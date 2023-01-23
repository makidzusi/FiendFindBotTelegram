import stages from "../helpers/stages.js"
import UserService from "../services/UserService.js"

export default async function(bot, msg) {
    const age = parseInt(msg.text)
    if (isNaN(age)) {
        bot.sendMessage(msg.chat.id, 'Возраст должен быть числом')
        return
    }
    UserService.updateUserByTelegramIdAsync({
        telegram_id: msg.from.id,
        stage: stages.name_input,
        age: age
    })
    bot.sendMessage(msg.chat.id, 'Введи свое отображаемое имя')
}