import findUserHandler from '../handlers/findUserHandler.js'

export default async function(bot,msg) {
    const msg_text = msg.text;
    switch (msg_text) {
        case '/find':
            findUserHandler(bot,msg)
            return
        case '/showme':
            return
        case 'editprofile':
            return
    }
    bot.sendMessage(msg.chat.id, 'Доступны варианты: /find , /editprofile, /showme',{
        reply_markup: JSON.stringify({
            keyboard: [
                ['/find'],
                ['/editprofile'],
                ['/showme']
            ]
        })
    })
}