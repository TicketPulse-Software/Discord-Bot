const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create a support ticket'),
  async execute(interaction) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('create-ticket')
          .setLabel('Create Ticket')
          .setStyle(ButtonStyle.Primary),
      );

    await interaction.reply({
      content: 'Click the button below to create a support ticket:',
      components: [row],
    });
  }
};
