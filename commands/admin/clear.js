const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear a number of messages.')
        .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to clear').setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (interaction.member.roles.cache.some(role => role.name === 'Admin')) {
            if (amount < 1 || amount > 100) return interaction.reply('You need to input a number between 1 and 100.');

            await interaction.channel.bulkDelete(amount, true).catch(err => {
                console.error(err);
                interaction.reply('There was an error trying to clear messages in this channel!');
            });

            await interaction.reply(`Cleared ${amount} messages.`);
        } else {
            await interaction.reply("You don't have the necessary permissions to use this command.");
        }
    }
};
