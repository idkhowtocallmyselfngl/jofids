const { ApplicationCommandType } = require("discord.js");

module.exports = {
  name: "painel_feedback",
  description: "[🤖] Envie o painel de feedbacks.",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({
        content: "❌ Você não tem permissão para usar este comando.",
        ephemeral: true,
      });
    }

    try {
      await interaction.reply({
        content: "✅ Painel enviado com sucesso.",
        ephemeral: true,
      });

      const FotoDoBot = client.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 });

      await interaction.channel.send({
        content: "",
        components: [
          {
            type: 17,
            components: [
              {
                type: 9,
                accessory: {
                  type: 11,
                  media: {
                    url: FotoDoBot,
                  },
                  description: null,
                  spoiler: false,
                },
                components: [
                  {
                    type: 10,
                    content: `## 🎉 Resgate de Prêmio\n> Agradecemos pelo seu interesse em contribuir com um feedback!\n> Clique no botão abaixo para resgatar sua recompensa exclusiva.`,
                  },
                  {
                    type: 10,
                    content: "## 📌 Detalhes do Feedback\n- Envie um feedback honesto e detalhado.\n- Feedbacks ajudam a melhorar nossos serviços.\n- Após o envio, você poderá resgatar seu prêmio.",
                  },
                ],
              },
              {
                type: 14,
                spacing: 1,
                divider: true,
              },
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    custom_id: "resgatarPremio",
                    label: "Resgatar",
                    style: 2,
                    emoji: {
                      id: "1365577784587456524",
                    },
                  },
                ],
              },
              {
                type: 10,
                content: "-# Todos os direitos reservados a **https://discord.gg/cRweSR7ThX**",
              },
            ],
          },
        ],
        flags: 32768,
      });

    } catch (error) {
      console.error("Erro ao enviar o painel de feedback:", error);
      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ Ocorreu um erro ao enviar o painel.",
          ephemeral: true,
        });
      }
    }
  },
};
// https://discord.gg/cRweSR7ThX
// https://discord.gg/cRweSR7ThX
// https://discord.gg/cRweSR7ThX