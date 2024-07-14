const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user.')
        .addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (interaction.member.roles.cache.some(role => role.name === 'Admin')) {
            const embed = new MessageEmbed()
                .setTitle('Ban Confirmation')
                .setDescription(`Are you sure you want to ban ${target.username}?`)
                .setColor('#FF0000');

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('confirm_ban')
                        .setLabel('Confirm')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('cancel_ban')
                        .setLabel('Cancel')
                        .setStyle('SECONDARY')
                );

            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = i => i.customId === 'confirm_ban' || i.customId === 'cancel_ban';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'confirm_ban') {
                    await member.ban();
                    await i.update({ content: `${target.username} was banned.`, components: [] });
                } else {
                    await i.update({ content: 'Ban action canceled.', components: [] });
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({ content: 'Ban action timed out.', components: [] });
                }
            });
        } else {
            await interaction.reply("You don't have the necessary permissions to use this command.");
        }
    }
};

