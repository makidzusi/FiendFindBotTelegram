import UserModel from '../models/UserModel.js'

class UserService {
    async createUser(telegram_id) {
        const user = await UserModel.findOne({
            telegram_id: telegram_id
        })
        console.log(user)

        if (user) return null

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
        t_username,
        current_viewed_profile
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
                stage: stage,
                t_username: t_username,
                current_viewed_profile: current_viewed_profile
            }
        })
        return user
    }
    async getRandomUserAsync(telegram_id) {
        const count = await UserModel.count() - 1
        const random = Math.floor(Math.random() * count)
        return await UserModel.findOne({
            telegram_id: {
                $ne: telegram_id
            }
        }).skip(random)
    }
    async getUserByIdAsync(id) {
        return await UserModel.findById(id)
    }
}

export default new UserService()