const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'mute',
  description: 'Mute a user in the server',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return message.reply('You do not have permission to use this command.');

    const member = message.mentions.members.first();
    if (!member) return message.reply('You need to mention a user to mute.');

    const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return message.reply('Mute role not found. Please create a role named "Muted".');

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('confirm-mute')
          .setLabel('Confirm')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('cancel-mute')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary),
      );

    const muteMessage = await message.channel.send({
      content: `Are you sure you want to mute ${member.user.tag}?`,
      components: [row],
    });

    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = muteMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'confirm-mute') {
        await member.roles.add(muteRole);
        await interaction.update({ content: `${member.user.tag} has been muted.`, components: [] });
      } else {
        await interaction.update({ content: 'Mute action cancelled.', components: [] });
      }
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        muteMessage.edit({ content: 'Mute action timed out.', components: [] });
      }
    });
  }
};
