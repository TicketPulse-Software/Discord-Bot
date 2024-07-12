module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing that command.');
    }
  },
};
