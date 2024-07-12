const { SlashCommandBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user in the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to mute')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return interaction.reply('You do not have permission to use this command.');
    }

    const member = interaction.options.getMember('target');
    if (!member) return interaction.reply('You need to mention a user to mute.');

    const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return interaction.reply('Mute role not found. Please create a role named "Muted".');

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

    await interaction.reply({
      content: `Are you sure you want to mute ${member.user.tag}?`,
      components: [row],
    });

    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'confirm-mute') {
        await member.roles.add(muteRole);
        await i.update({ content: `${member.user.tag} has been muted.`, components: [] });
      } else {
        await i.update({ content: 'Mute action cancelled.', components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: 'Mute action timed out.', components: [] });
      }
    });
  }
};

