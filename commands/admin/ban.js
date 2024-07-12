const { SlashCommandBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to ban')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply('You do not have permission to use this command.');
    }

    const member = interaction.options.getMember('target');
    if (!member) return interaction.reply('You need to mention a user to ban.');

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('confirm-ban')
          .setLabel('Confirm')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('cancel-ban')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary),
      );

    await interaction.reply({
      content: `Are you sure you want to ban ${member.user.tag}?`,
      components: [row],
    });

    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'confirm-ban') {
        await member.ban();
        await i.update({ content: `${member.user.tag} has been banned.`, components: [] });
      } else {
        await i.update({ content: 'Ban action cancelled.', components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: 'Ban action timed out.', components: [] });
      }
    });
  }
};

      }
    });
  }
};
