const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user.')
        .addUserOption(option => option.setName('target').setDescription('The user to kick').setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (interaction.member.roles.cache.some(role => role.name === 'Admin')) {
            const embed = new MessageEmbed()
                .setTitle('Kick Confirmation')
                .setDescription(`Are you sure you want to kick ${target.username}?`)
                .setColor('#FFA500');

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('confirm_kick')
                        .setLabel('Confirm')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('cancel_kick')
                        .setLabel('Cancel')
                        .setStyle('SECONDARY')
                );

            await interaction.reply({ embeds: [embed], components: [row] });

            const filter = i => i.customId === 'confirm_kick' || i.customId === 'cancel_kick';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'confirm_kick') {
                    await member.kick();
                    await i.update({ content: `${target.username} was kicked.`, components: [] });
                } else {
                    await i.update({ content: 'Kick action canceled.', components: [] });
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    interaction.editReply({ content: 'Kick action timed out.', components: [] });
                }
            });
        } else {
            await interaction.reply("You don't have the necessary permissions to use this command.");
        }
    }
};

    });
  }
};
