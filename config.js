const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder } = require('discord.js')
const { general, resgate } = require('../../wiodb/index.js')
const fs = require('fs')

module.exports = {
  name: "interactionCreate",
  run: async(interaction) => {
    const { client, customId } = interaction
    
    if (interaction.isButton()) {
      // resgatar o premio
      if (customId == 'resgatarPremio') {
        if (!resgate.has(interaction.user.id) || resgate.get(interaction.user.id) != true) {
          return await interaction.reply({ 
            content: `${!resgate.has(interaction.user.id) ? `❌ Você ainda não enviou nenhum feedback. Por favor, use o canal ${interaction.guild.channels.cache.get(general.get('canal_feedback')) || '\`Canal não encontrado\`'} para deixar sua opinião e ganhar um prêmio.` : `❌ Você já resgatou seu prêmio.`}`, 
            flags: 64 
          })
        }
        
        if (!general.get('estoque').length) {
          return await interaction.reply({ content: `❌ Estamos sem estoque de prêmios no momento!`, flags: 64 })
        }
        
        resgate.set(interaction.user.id, false)
        const premio = general.get(`estoque`)[0]
        await interaction.reply({ content: `🎁 Parabéns, ${interaction.user.username}!\nAqui está o seu prêmio resgatado com sucesso:\n\n\`${premio}\`\n\nAgradecemos novamente pelo seu feedback!`, flags: 64 })
        await interaction.user.send({ content: `🎁 Parabéns, ${interaction.user.username}!\nAqui está o seu prêmio resgatado com sucesso:\n\n\`${premio}\`\n\nAgradecemos novamente pelo seu feedback!` })
        
        general.pull('estoque', (element) => element == premio)
      }
      
      if (customId == 'cfgbot') {
        await interaction.update({
          embeds: [
            new EmbedBuilder()
             .setAuthor({ name: `${client.user.username} - Bot feedback`, iconURL: client.user.displayAvatarURL({ dynamic: true, format: 'png' })})
             .setDescription(`Olá ${interaction.user}, Aqui você pode personalizar a sua aplicação conforme sua necessidade.`)
             .addFields(
               { name: `Nome`, value: `${client.user.username}` },
               { name: `Avatar`, value: `[Ver avatar](${client.user.displayAvatarURL()})` },
               { name: `Cor principal`, value: `${general.get(`color`)}` },
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
                .setCustomId('nomebot')
                .setLabel('Alterar Nome')
                .setEmoji(`1382101135061418196`)
                .setStyle(2),
               new ButtonBuilder()
                .setCustomId('avatarbot')
                .setLabel('Alterar Avatar')
                .setEmoji(`1374592677919854592`)
                .setStyle(2),
               new ButtonBuilder()
                .setCustomId('color')
                .setLabel('Alterar Cor Principal')
                .setEmoji(`1374596272870395934`)
                .setStyle(2),
               new ButtonBuilder()
                .setCustomId('voltar')
                .setLabel('Voltar')
                .setEmoji(`1382095031707500596`)
                .setStyle(2)
             )
          ]
        })
      }
      
      if (customId == 'mensagens') {
        await interaction.update({
          embeds: [
            new EmbedBuilder()
             .setAuthor({ name: `${client.user.username} - Bot feedback`, iconURL: client.user.displayAvatarURL({ dynamic: true, format: 'png' })})
             .setDescription(`Olá ${interaction.user}, Aqui você pode configurar as mensagens permitidas para resgatar prêmios.`)
             .addFields(
               { name: `Mensagens permitidas:`, value: `${general.get(`mensagens`)?.length ? general.get(`mensagens`).map(msg => msg).join('\n') : 'Nenhuma mensagem configurada'}` }
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
                 .setCustomId('addmsg')
                 .setLabel('Adicionar')
                 .setEmoji(`1382178412428267571`)
                 .setStyle(2),
                new ButtonBuilder()
                 .setCustomId('delmsg')
                 .setLabel('Limpar')
                 .setEmoji(`1382098908729053247`)
                 .setStyle(2),
                new ButtonBuilder()
                 .setCustomId('voltar')
                 .setLabel('Voltar')
                 .setEmoji(`1382095031707500596`)
                 .setStyle(2)
             )
          ]
        })
      }
      
      if (customId == 'canais') {
        const modal = new ModalBuilder()
        .setCustomId('canais')
        .setTitle('Canal de Feedback')
        
        const nome = new TextInputBuilder()
        .setCustomId('canal')
        .setLabel('Canal')
        .setStyle(1)
        
        modal.addComponents(new ActionRowBuilder().addComponents(nome))
        
        await interaction.showModal(modal)
      }
      
      if (customId == 'estoque') {
        await interaction.update({
          embeds: [
            new EmbedBuilder()
             .setAuthor({ name: `${client.user.username} - Bot feedback`, iconURL: client.user.displayAvatarURL({ dynamic: true, format: 'png' })})
             .setDescription(`Olá ${interaction.user}, Aqui você pode configurar o estoque de prêmios que as pessoas irão receber.`)
             .addFields(
               { name: `Estoque total`, value: `${general.get(`estoque`).length}` }
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
                 .setCustomId('addestoque')
                 .setLabel('Adicionar')
                 .setEmoji(`1382178412428267571`)
                 .setStyle(2),
                new ButtonBuilder()
                 .setCustomId('limparestoque')
                 .setLabel('Limpar')
                 .setEmoji(`1382098908729053247`)
                 .setStyle(2),
                new ButtonBuilder()
                 .setCustomId('backup')
                 .setLabel('Backup')
                 .setEmoji(`1383867747280093274`)
                 .setDisabled(!general.get(`estoque`).length)
                 .setStyle(2),
                new ButtonBuilder()
                 .setCustomId('voltar')
                 .setLabel('Voltar')
                 .setEmoji(`1382095031707500596`)
                 .setStyle(2)
             )
          ]
        })
      }
      
      if (customId == 'nomebot') {
        const modal = new ModalBuilder()
        .setCustomId('nomebot')
        .setTitle('Nome do Bot')
        
        const nome = new TextInputBuilder()
        .setCustomId('nome')
        .setLabel('Nome')
        .setStyle(1)
        
        modal.addComponents(new ActionRowBuilder().addComponents(nome))
        
        await interaction.showModal(modal)
      }
      
      if (customId == 'avatarbot') {
        const modal = new ModalBuilder()
        .setCustomId('avatarbot')
        .setTitle('Avatar do Bot')
        
        const nome = new TextInputBuilder()
        .setCustomId('avatar')
        .setLabel('Avatar')
        .setStyle(1)
        
        modal.addComponents(new ActionRowBuilder().addComponents(nome))
        
        await interaction.showModal(modal)
      }
      
      if (customId == 'color') {
        const modal = new ModalBuilder()
        .setCustomId('color')
        .setTitle('Cor Principal')
        
        const nome = new TextInputBuilder()
        .setCustomId('cor')
        .setLabel('Cor')
        .setPlaceholder("#007626")
        .setStyle(1)
        
        modal.addComponents(new ActionRowBuilder().addComponents(nome))
        
        await interaction.showModal(modal)
      }
      
      if (customId == 'addmsg') {
        const modal = new ModalBuilder()
        .setCustomId('addmsg')
        .setTitle('Adicionar Mensagem')
        
        const msg = new TextInputBuilder()
        .setCustomId('msg')
        .setLabel('Mensagem (1 por linha)')
        .setPlaceholder('Exemplo:\n10/10\nMuito bom')
        .setStyle(2)
        
        modal.addComponents(new ActionRowBuilder().addComponents(msg))
        
        await interaction.showModal(modal)
      }
      
      if (customId == 'delmsg') {
        const modal = new ModalBuilder()
        .setCustomId('delmsg')
        .setTitle('Limpar Mensagens')
        
        const msg = new TextInputBuilder()
        .setCustomId('cfm')
        .setLabel('Deseja limpar?')
        .setPlaceholder('\"SIM\"')
        .setStyle(2)
        
        modal.addComponents(new ActionRowBuilder().addComponents(msg))
        
        await interaction.showModal(modal)
      }
      
      if (customId == 'addestoque') {
        const modal = new ModalBuilder()
        .setCustomId('addestoque')
        .setTitle('Adicionar Estoque')
        
        const msg = new TextInputBuilder()
        .setCustomId('estoque')
        .setLabel('Estoque (1 por linha)')
        .setPlaceholder('Exemplo:\nhttps://discord.gift/ag13uBaf3\nconta@gmail.com:1234578')
        .setStyle(2)
        
        modal.addComponents(new ActionRowBuilder().addComponents(msg))
        
        await interaction.showModal(modal)
      }
      
      if (customId == 'limparestoque') {
        const modal = new ModalBuilder()
        .setCustomId('limparestoque')
        .setTitle('Limpar Estoque')
        
        const msg = new TextInputBuilder()
        .setCustomId('cfm')
        .setLabel('Deseja limpar?')
        .setPlaceholder('\"SIM\"')
        .setStyle(2)
        
        modal.addComponents(new ActionRowBuilder().addComponents(msg))
        
        await interaction.showModal(modal)
      }
      
      if (customId == 'backup') {
        fs.writeFile('estoque.txt', general.get(`estoque`).map(x => x).join('\n'), 'utf8', (err) => {
          if (err) throw err
        })
        await interaction.reply({
          files: ['estoque.txt'],
          flags: 64
        })
        fs.unlink('estoque.txt', (err) => {
          if (err) throw err
        })
      }
      
      if (customId == 'voltar') {
        EmbedPcp()
      }
    }
    
    
    if (interaction.isModalSubmit()) {
      if (customId == 'nomebot') {
        const nome = interaction.fields.getTextInputValue('nome')
        
        try {
          await client.user.setUsername(nome)
          EmbedBot()
        } catch (e) {
          console.error(e.message)
          await interaction.reply({ content: `Ocorreu um erro ao trocar o nome do bot`, flags: 64 })
        }
      }
      
      if (customId == 'avatarbot') {
        const avatar = interaction.fields.getTextInputValue('avatar')
        
        if (!avatar.startsWith('https://')) {
          return await interaction.reply({ content: `Imagem invalida`, flags: 64 })
        }
        
        try {
          await client.user.setAvatar(avatar)
          EmbedBot()
        } catch (e) {
          console.error(e.message)
          await interaction.reply({ content: `Ocorreu um erro ao trocar o avatar do bot`, flags: 64 })
        }
      }
      
      if (customId == 'color') {
        const cor = interaction.fields.getTextInputValue('cor')
        
        if (!isValidHexColor(cor)) {
          return await interaction.reply({ content: `Informe um cor hex valida, exemplo: #007626`, flags: 64 })
        }
        
        general.set(`color`, cor)
        EmbedBot()
      }
      
      if (customId == 'addmsg') {
        const msg = interaction.fields.getTextInputValue('msg').split('\n')
        
        for (const mgs of msg) {
          general.push('mensagens', mgs)
        }
        
        EmbedMsg()
      }
      
      if (customId == 'delmsg') {
        const cfm = interaction.fields.getTextInputValue('cfm')
        
        if (cfm != 'SIM') {
          return await interaction.reply({ content: `Cancelado`, flags: 64 })
        }
        
        general.set(`mensagens`, [])
        EmbedMsg()
      }
      
      if (customId == 'canais') {
        const canal = interaction.fields.getTextInputValue('canal')
        
        if (!interaction.guild.channels.cache.get(canal)) {
          return await interaction.reply({ content: `Canal não encontrado`, flags: 64 })
        }
        
        general.set(`canal_feedback`, canal)
        EmbedPcp()
      }
      
      if (customId == 'addestoque') {
        const estoque = interaction.fields.getTextInputValue('estoque').split('\n')
        
        for (const est of estoque) {
          general.push('estoque', est)
        }
        
        EmbedEstoque()
      }
      
      if (customId == 'limparestoque') {
        const cfm = interaction.fields.getTextInputValue('cfm')
        
        if (cfm != 'SIM') {
          return await interaction.reply({ content: `Cancelado`, flags: 64 })
        }
        
        general.set(`estoque`, [])
        EmbedEstoque()
      }
    }
    
    
    async function EmbedPcp() {
      await interaction.update({
        embeds: [
          new EmbedBuilder()
          .setAuthor({ name: `${client.user.username} - Bot feedback`, iconURL: client.user.displayAvatarURL({ dynamic: true, format: 'png' })})
          .setDescription(`Olá ${interaction.user}, seja bem-vindo ao painel de configuração do bot, utilize os botões abaixo para configurar o bot feedback.`)
          .addFields(
            { name: `Mensagens permitidas:`, value: `${general.get(`mensagens`)?.length ? general.get(`mensagens`).map(msg => msg).join('\n'): 'Nenhuma mensagem configurada'}` },
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
        ]
      })
    }
    
    async function EmbedBot() {
      await interaction.update({
        embeds: [
          new EmbedBuilder()
          .setAuthor({ name: `${client.user.username} - Bot feedback`, iconURL: client.user.displayAvatarURL({ dynamic: true, format: 'png' })})
          .setDescription(`Olá ${interaction.user}, Aqui você pode personalizar a sua aplicação conforme sua necessidade.`)
          .addFields(
            { name: `Nome`, value: `${client.user.username}` },
            { name: `Avatar`, value: `[Ver avatar](${client.user.displayAvatarURL()})` },
            { name: `Cor principal`, value: `${general.get(`color`)}` },
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
            .setCustomId('nomebot')
            .setLabel('Alterar Nome')
            .setEmoji(`1382101135061418196`)
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId('avatarbot')
            .setLabel('Alterar Avatar')
            .setEmoji(`1374592677919854592`)
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId('color')
            .setLabel('Alterar Cor')
            .setEmoji(`1374596272870395934`)
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId('voltar')
            .setLabel('Voltar')
            .setEmoji(`1382095031707500596`)
            .setStyle(2)
          )
        ]
      })
    }
    
    async function EmbedMsg() {
      await interaction.update({
        embeds: [
          new EmbedBuilder()
          .setAuthor({ name: `${client.user.username} - Bot feedback`, iconURL: client.user.displayAvatarURL({ dynamic: true, format: 'png' })})
          .setDescription(`Olá ${interaction.user}, Aqui você pode configurar as mensagens permitidas para resgatar prêmios.`)
          .addFields(
            { name: `Mensagens permitidas:`, value: `${general.get(`mensagens`)?.length ? general.get(`mensagens`).map(msg => msg).join('\n'): 'Nenhuma mensagem configurada'}` }
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
            .setCustomId('addmsg')
            .setLabel('Adicionar')
            .setEmoji(`1382178412428267571`)
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId('delmsg')
            .setLabel('Limpar')
            .setEmoji(`1382098908729053247`)
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId('voltar')
            .setLabel('Voltar')
            .setEmoji(`1382095031707500596`)
            .setStyle(2)
          )
        ]
      })
    }
    
    async function EmbedEstoque() {
      await interaction.update({
        embeds: [
          new EmbedBuilder()
          .setAuthor({ name: `${client.user.username} - Bot feedback`, iconURL: client.user.displayAvatarURL({ dynamic: true, format: 'png' })})
          .setDescription(`Olá ${interaction.user}, Aqui você pode configurar o estoque de prêmios que as pessoas irão receber.`)
          .addFields(
            { name: `Estoque total`, value: `${general.get(`estoque`).length}` }
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
            .setCustomId('addestoque')
            .setLabel('Adicionar')
            .setEmoji(`1382178412428267571`)
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId('limparestoque')
            .setLabel('Limpar')
            .setEmoji(`1382098908729053247`)
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId('backup')
            .setLabel('Backup')
            .setEmoji(`1383867747280093274`)
            .setDisabled(!general.get(`estoque`).length)
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId('voltar')
            .setLabel('Voltar')
            .setEmoji(`1382095031707500596`)
            .setStyle(2)
          )
        ]
      })
    }
    
    function isValidHexColor(hex) {
      return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(hex)
    }
  }
}
// https://discord.gg/cRweSR7ThX
// https://discord.gg/cRweSR7ThX
// https://discord.gg/cRweSR7ThX