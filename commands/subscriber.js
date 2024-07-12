const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('subscriber')
    .setDescription('Get the subscriber role'),
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('get-subscriber-role')
          .setLabel('Get Subscriber Role')
          .setStyle(ButtonStyle.Success),
      );

    await interaction.reply({
      content: 'Click the button below to get the Subscriber role:',
      components: [row],
    });
  }
};
