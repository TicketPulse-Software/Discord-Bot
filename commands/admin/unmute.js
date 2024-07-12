const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a user in the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to unmute')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.reply('You do not have permission to use this command.');

    const member = interaction.options.getMember('target');
    if (!member) return interaction.reply('You need to mention a user to unmute.');

    const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return interaction.reply('Mute role not found. Please create a role named "Muted".');

    try {
      await member.roles.remove(muteRole);
      interaction.reply(`${member.user.tag} has been unmuted.`);
    } catch (error) {
      console.error(error);
      interaction.reply('I was unable to unmute the member.');
    }
  }
};

