const { SlashCommandBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to kick')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply('You do not have permission to use this command.');
    }

    const member = interaction.options.getMember('target');
    if (!member) return interaction.reply('You need to mention a user to kick.');

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

    await interaction.reply({
      content: `Are you sure you want to kick ${member.user.tag}?`,
      components: [row],
    });

    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'confirm-kick') {
        await member.kick();
        await i.update({ content: `${member.user.tag} has been kicked.`, components: [] });
      } else {
        await i.update({ content: 'Kick action cancelled.', components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: 'Kick action timed out.', components: [] });
      }
    });
  }
};
