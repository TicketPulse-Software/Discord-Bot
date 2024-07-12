const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick a user from the server',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply('You do not have permission to use this command.');

    const member = message.mentions.members.first();
    if (!member) return message.reply('You need to mention a user to kick.');

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('confirm-kick')
          .setLabel('Confirm')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('cancel-kick')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary),
      );

    const kickMessage = await message.channel.send({
      content: `Are you sure you want to kick ${member.user.tag}?`,
      components: [row],
    });

    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = kickMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'confirm-kick') {
        await member.kick();
        await interaction.update({ content: `${member.user.tag} has been kicked.`, components: [] });
      } else {
        await interaction.update({ content: 'Kick action cancelled.', components: [] });
      }
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        kickMessage.edit({ content: 'Kick action timed out.', components: [] });
      }
    });
  }
};
