const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a user.')
        .addUserOption(option => option.setName('target').setDescription('The user to mute').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (interaction.member.roles.cache.some(role => role.name === 'Admin')) {
            const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
            if (!muteRole) return interaction.reply('No "Muted" role found.');

            const embed = new MessageEmbed()
                .setTitle('Mute Confirmation')
                .setDescription(`Are you sure you want to mute ${target.username}?`)
                .setColor('#FFFF00');

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('confirm_mute')
                        .setLabel('Confirm')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('cancel_mute')
                        .setLabel('Cancel')
                        .setStyle('SECONDARY')
                );

            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = i => i.customId === 'confirm_mute' || i.customId === 'cancel_mute';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'confirm_mute') {
                    await member.roles.add(muteRole);
                    await i.update({ content: `${target.username} was muted.`, components: [] });
                } else {
                    await i.update({ content: 'Mute action canceled.', components: [] });
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({ content: 'Mute action timed out.', components: [] });
                }
            });
        } else {
            await interaction.reply("You don't have the necessary permissions to use this command.");
        }
    }
};


