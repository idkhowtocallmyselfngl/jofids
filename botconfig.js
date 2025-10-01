const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits } = require('discord.js')
const { general } = require('../../wiodb/index.js')

module.exports = {
  name: "botconfig",
  description: "[🤖] Configure o seu bot.",
  default_member_permissions: PermissionFlagsBits.Administrator,
  run: async(client, interaction) => {
    
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
         .setAuthor({ name: `${client.user.username} - Bot feedback`, iconURL: client.user.displayAvatarURL({ dynamic: true, format: 'png' })})
         .setDescription(`Olá ${interaction.user}, seja bem-vindo ao painel de configuração do bot, utilize os botões abaixo para configurar o bot feedback.`)
         .addFields(
           { name: `Mensagens permitidas:`, value: `${general.get(`mensagens`)?.length ? general.get(`mensagens`).map(msg => msg).join('\n') : 'Nenhuma mensagem configurada'}` },
           { name: `Canal de Feedbacks`, value: `${interaction.guild.channels.cache.get(general.get(`canal_feedback`)) || '\`Não definido\`'}` }
          )
          .setColor(general.get(`color`))
          .setThumbnail(interaction.client.user.displayAvatarURL())
          .setFooter({ text: `${interaction.guild.name}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setTimestamp()
      ],
      components: [
        new ActionRowBuilder()
         .addComponents(
            new ButtonBuilder()
             .setCustomId('cfgbot')
             .setLabel('Personalizar Bot')
             .setEmoji(`1380618424027185253`)
             .setStyle(2),
            new ButtonBuilder()
             .setCustomId('mensagens')
             .setLabel('Mensagens Permitidas')
             .setEmoji(`1382101135061418196`)
             .setStyle(2),
            new ButtonBuilder()
             .setCustomId('canais')
             .setLabel('Canal Feedback')
             .setEmoji(`1374592801702023229`)
             .setStyle(2),
            new ButtonBuilder()
             .setCustomId('estoque')
             .setLabel('Gerenciar Estoque')
             .setEmoji(`1383867747280093274`)
             .setStyle(2)
         )
      ],
      flags: 64
    })
    
  }
}
// https://discord.gg/cRweSR7ThX
// https://discord.gg/cRweSR7ThX
// https://discord.gg/cRweSR7ThX