const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const words = [
  { word: "cat", options: ["cat", "dog"] },
  { word: "apple", options: ["apple", "banana"] },
  ( word: "Ukraine", options: ["Ukraine", "Russia"] },
  { word: "smii7y", options: ["Grizzy", "Smii7y"] },
  { word: "M2", options: ["M1", "M2"] },
  { word: "IDEA", options: ["IDEA", "ADA"] },
  { word: "C172", options: ["C172", "C150"] },
  { word: "Connect", options: ["Switch", "Connect"] },
  { word: "UTC", options: ["UTK", "UTC"] },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guess-word')
    .setDescription('Guess the word game'),
  async execute(interaction) {
    const selectedWord = words[Math.floor(Math.random() * words.length)];

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`guess-${selectedWord.options[0]}`)
          .setLabel(selectedWord.options[0])
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`guess-${selectedWord.options[1]}`)
          .setLabel(selectedWord.options[1])
          .setStyle(ButtonStyle.Primary)
      );

    await interaction.reply({
      content: `Guess the word:`,
      components: [row]
    });

    const filter = i => i.customId.startsWith('guess') && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === `guess-${selectedWord.word}`) {
        await i.update({ content: `Correct! The word is ${selectedWord.word}.`, components: [] });
      } else {
        await i.update({ content: `Wrong! The word was ${selectedWord.word}.`, components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: 'Time is up! No one guessed the word.', components: [] });
      }
    });
  }
};
