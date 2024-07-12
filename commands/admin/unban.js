const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the server')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('The ID of the user to unban')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply('You do not have permission to use this command.');

    const userId = interaction.options.getString('userid');
    if (!userId) return interaction.reply('You need to provide the ID of the user to unban.');

    try {
      await interaction.guild.members.unban(userId);
      interaction.reply(`User with ID ${userId} has been unbanned.`);
    } catch (error) {
      console.error(error);
      interaction.reply('I was unable to unban the member. Please make sure the ID is correct.');
    }
  }
};

