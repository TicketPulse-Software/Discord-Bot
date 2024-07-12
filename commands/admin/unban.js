module.exports = {
  name: 'unban',
  description: 'Unban a user from the server',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply('You do not have permission to use this command.');

    const userId = args[0];
    if (!userId) return message.reply('You need to provide the ID of the user to unban.');

    try {
      await message.guild.members.unban(userId);
      message.channel.send(`User with ID ${userId} has been unbanned.`);
    } catch (error) {
      console.error(error);
      message.reply('I was unable to unban the member. Please make sure the ID is correct.');
    }
  }
};
