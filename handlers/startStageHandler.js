import UserService from "../services/UserService.js"
import stages from '../helpers/stages.js'
import findUserHandler from "./findUserHandler.js";
import url from 'url';
import client from '../elkclient/index.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

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
                if (msg.text === '👍') {
                    bot.sendMessage(msg.chat.id, 'Вам нравится этот человек')
                    const user = await UserService.getUserByTelegramIdAsync(msg.from.id)
                    const target_user = await UserService.getUserByIdAsync(user.current_viewed_profile)
                    const photo = `${__dirname}/../images/${user.image}`;
                    bot.sendPhoto(target_user.telegram_id, photo, {
                        caption: `Вы получили лайк от пользователя: @${user.t_username}, Возраст ${user.age}, ${user.description}`
                    })
                    return
                }
                if (msg.text === '👎') {

                    await findUserHandler(bot, msg)

                }
                if (msg.text === '⚙️') {
                    await UserService.updateUserByTelegramIdAsync({
                        telegram_id: msg.from.id,
                        stage: stages.in_settings
                    })
                    bot.sendMessage(msg.chat.id, 'Доступные команды: /continue для продлжения поиска, /startfind для поиска по описанию или /editprofile для редактирования профиля', {
                        reply_markup: JSON.stringify({
                            keyboard: [
                                ['/continue'],
                                ['/startfind'],
                                ['/editprofile']
                            ]
                        })
                    })
                    return
                    //bot.sendMessage(msg.from.id, 'Сколько вам лет?')
                }
                bot.sendMessage(msg.chat.id, 'Доступные комманды для ввода: 👍 или 👎 или ⚙️', {
                    reply_markup: JSON.stringify({
                        keyboard: [
                            ['👍'],
                            ['👎'],
                            ['⚙️']
                        ]
                    })
                })
                return
            case stages.in_settings:
            case stages.finished:

                const text = msg.text
                if (text === '/find') {
                    await UserService.updateUserByTelegramIdAsync({
                        telegram_id: msg.from.id,
                        stage: stages.review_profile
                    })
                    await findUserHandler(bot, msg)

                }
                if (msg.text.substring(0, 5) === '/find') {

                    const userFromElk = await client.search({
                        index: 'users',
                        query: {
                            match: {
                                description: msg.text.substring(5)
                            }
                        }
                    })
                    const hits = userFromElk.hits.hits
                    if (!hits.length) {
                        bot.sendMessage(msg.from.id, 'Изивните, никого не нашлось, попробуйте еще!')
                        return
                    }
                    const rand = Math.floor(Math.random() * hits.length)
                    const user = hits[rand]
                    console.log(user._source)

                    const finded_user = await UserService.getUserByTelegramIdAsync(user._source.telegram_id)
                    const photo = `${__dirname}/../images/${finded_user.image}`;
                    bot.sendPhoto(msg.chat.id, photo, {
                        caption: `${finded_user.name}, Вораст - ${finded_user.age}, Город - ${finded_user.city}, ${finded_user?.description || ''}, ссылка на профиль: @${finded_user?.t_username}`
                    })
                    console.log(userFromElk.hits)
                }

                return
                bot.sendMessage(msg.chat.id, 'Введите /find , чтобы начать поиск!')
                return
            default:
                bot.sendMessage(msg.chat.id, 'Нет такого варианта!')
        }
    } else {
        bot.sendMessage(msg.chat.id, 'У вас не создан профиль! Напишите /start , чтобы начать')
    }
}