const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a user from the server',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('You do not have permission to use this command.');
    }

    const member = message.mentions.members.first();
    if (!member) return message.reply('You need to mention a user to ban.');

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

    const banMessage = await message.channel.send({
      content: `Are you sure you want to ban ${member.user.tag}?`,
      components: [row],
    });

    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = banMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'confirm-ban') {
        await member.ban();
        await interaction.update({ content: `${member.user.tag} has been banned.`, components: [] });
      } else {
        await interaction.update({ content: 'Ban action cancelled.', components: [] });
      }
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        banMessage.edit({ content: 'Ban action timed out.', components: [] });
      }
    });
  }
};
