const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user.')
        .addUserOption(option => option.setName('target').setDescription('The user to unban').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');

        if (interaction.member.roles.cache.some(role => role.name === 'Admin')) {
            try {
                await interaction.guild.bans.remove(target.id);
                await interaction.reply(`${target.username} was unbanned.`);
            } catch (error) {
                await interaction.reply('An error occurred while trying to unban the user.');
            }
        } else {
            await interaction.reply("You don't have the necessary permissions to use this command.");
        }
    }
};
