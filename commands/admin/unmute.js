module.exports = {
  name: 'unmute',
  description: 'Unmute a user in the server',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return message.reply('You do not have permission to use this command.');

    const member = message.mentions.members.first();
    if (!member) return message.reply('You need to mention a user to unmute.');

    const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return message.reply('Mute role not found. Please create a role named "Muted".');

    try {
      await member.roles.remove(muteRole);
      message.channel.send(`${member.user.tag} has been unmuted.`);
    } catch (error) {
      console.error(error);
      message.reply('I was unable to unmute the member.');
    }
  }
};
