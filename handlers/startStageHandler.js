import UserService from "../services/UserService.js"
import stages from '../helpers/stages.js'
import findUserHandler from "./findUserHandler.js";

export default async function (bot, msg) {
    const user = await UserService.getUserByTelegramIdAsync(msg.from.id)
    if (user) {
        const user_stage = user.stage;
        switch (user_stage) {
            case stages.start:
                UserService.updateUserByTelegramIdAsync({
                    telegram_id: msg.from.id,
                    stage: stages.age_input,
                })
                bot.sendMessage(msg.chat.id, 'Сколько вам лет?')
                return
            case stages.age_input:
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
                return
            case stages.name_input:
                const name = msg.text
                UserService.updateUserByTelegramIdAsync({
                    name: name,
                    telegram_id: msg.from.id,
                    stage: stages.description_input
                })
                bot.sendMessage(msg.chat.id, 'Отлично! Теперь введите коротко о себе')
                return
            case stages.description_input:
                const description = msg.text
                UserService.updateUserByTelegramIdAsync({
                    description: description,
                    telegram_id: msg.from.id,
                    stage: stages.image_input
                })
                bot.sendMessage(msg.chat.id, 'Прекрасно! Теперь отправь фото, которое будет использоваться в анкете')
                return
            case stages.image_input:
                bot.sendMessage(msg.chat.id, 'Твое сообщение должно быть картинкой!');
                return
            case stages.review_profile:
                if(msg.text === '👍') {
                    bot.sendMessage(msg.chat.id, 'Вам нравится этот человек')
                    const user = await UserService.getUserByTelegramIdAsync(msg.from.id)
                    const target_user = await UserService.getUserByIdAsync(user.current_viewed_profile)
                    bot.sendMessage(target_user.telegram_id, `Вы получили лайк от пользователя: @${user.t_username}`)
                    return
                }
                if(msg.text === '👎') {
                    
                    await findUserHandler(bot, msg)

                }
                bot.sendMessage(msg.chat.id, 'Доступные комманды для ввода: 👍 или 👎',{
                    reply_markup: JSON.stringify({
                        keyboard: [
                            ['👍'],
                            ['👎']
                        ]
                    })
                })
                return
            case stages.finished:
                const text = msg.text
                if(text === '/find') {
                    await UserService.updateUserByTelegramIdAsync({
                        telegram_id: msg.from.id,
                        stage: stages.review_profile
                    })
                    await findUserHandler(bot, msg)
                    return
                }
                console.log(msg.from)
                bot.sendMessage(msg.chat.id, 'Введите /find , чтобы начать поиск!')
                return
            default:
                bot.sendMessage(msg.chat.id, 'Нет такого варианта!')
        }
    } else {
        bot.sendMessage(msg.chat.id, 'У вас не создан профиль! Напишите /start , чтобы начать')
    }
}