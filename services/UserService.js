import UserModel from '../models/UserModel.js'

class UserService {
    async createUser(telegram_id) {
        const user = await UserModel.findOne({
            telegram_id: telegram_id
        })
        console.log(user)

        if(user) return null

        const new_user = await UserModel.create({
            telegram_id: telegram_id
        })

        return new_user
    }

    async getUserByTelegramIdAsync(telegram_id) {
        const user = await UserModel.findOne({
            telegram_id: telegram_id
        })

        return user
    }

    async updateUserByTelegramIdAsync({
        telegram_id,
        image,
        description,
        name,
        age,
        stage,
    }) {
        const user = await UserModel.findOne({
            telegram_id: telegram_id
        })

        await user.update({
            $set: {
                telegram_id: telegram_id,
                image: image,
                description: description,
                name: name,
                age: age,
                stage
            }
        })
        return user
    }
}

export default new UserService()