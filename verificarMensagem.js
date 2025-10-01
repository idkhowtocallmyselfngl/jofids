const { general, resgate } = require('../../wiodb/index.js')

module.exports = {
  name: "messageCreate",
  run: async(message) => {
    if (message.author.bot || message.channel.id != general.get('canal_feedback')) return
    
    const mensagens = general.get('mensagens') || []
    const contemMsg = mensagens.some(m => message.content.toLowerCase().includes(m.toLowerCase()))
    
    if (contemMsg) {
      if (resgate.has(message.author.id)) return
      
      resgate.set(message.author.id, true)
      await message.author.send({
        content: `🎉 Olá, ${message.author.username}!\n\nAgradecemos sinceramente pelo seu feedback. Como forma de agradecimento, você agora pode resgatar o seu prêmio. Boa sorte e aproveite! 🚀`
      })
    }
  }
}
// https://discord.gg/cRweSR7ThX
// https://discord.gg/cRweSR7ThX
// https://discord.gg/cRweSR7ThX