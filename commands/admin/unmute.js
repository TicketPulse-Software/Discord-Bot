const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a user.')
        .addUserOption(option => option.setName('target').setDescription('The user to unmute').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (interaction.member.roles.cache.some(role => role.name === 'Admin')) {
            const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
            if (!muteRole) return interaction.reply('No "Muted" role found.');

            await member.roles.remove(muteRole);
            await interaction.reply(`${target.username} was unmuted.`);
        } else {
            await interaction.reply("You don't have the necessary permissions to use this command.");
        }
    }
};

