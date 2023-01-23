import stages from "../helpers/stages.js"
import UserService from "../services/UserService.js"
import ageInputStageHandler from "../stage_handlers/ageInputStageHandler.js"
import nameInputHandler from "../stage_handlers/nameInputHandler.js"
import startStageHandler from "../stage_handlers/startStageHandler.js"
import descInputHandler from "../stage_handlers/descInputHandler.js"
import inSettingsHandler from "../stage_handlers/inSettingsHandler.js"

export default async function (bot, msg) {
    const user = await UserService.getUserByTelegramIdAsync(msg.from.id)
    const user_stage = user.stage
    switch(user_stage) {
        case stages.start:
            startStageHandler(bot,msg)
            return
        case stages.age_input:
            ageInputStageHandler(bot,msg);
            return
        case stages.name_input:
            nameInputHandler(bot,msg)
            return
        case stages.description_input:
            descInputHandler(bot,msg)
            return
        case stages.in_settings:
            inSettingsHandler(bot, msg)
            return
    }

    
}