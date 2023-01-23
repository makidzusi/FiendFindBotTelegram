export default async function(bot,msg) {
    console.log('kekw')
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