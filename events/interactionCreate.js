const { PermissionsBitField, ChannelType, TextInputBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton() && !interaction.isModalSubmit() && !interaction.isSelectMenu()) return;

    if (interaction.customId === 'create-ticket') {
      const modal = new ModalBuilder()
        .setCustomId('ticket-modal')
        .setTitle('Create Support Ticket')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('ticket-description')
              .setLabel('Describe your issue')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new SelectMenuBuilder()
              .setCustomId('ticket-type')
              .setPlaceholder('Select Ticket Type')
              .addOptions([
                {
                  label: 'Stari-Helpdesk',
                  description: 'General support for Stari',
                  value: 'stari-helpdesk',
                },
                {
                  label: 'Stari-Status',
                  description: 'Status and updates about Stari',
                  value: 'stari-status',
                }
              ])
              .setRequired(true)
          )
        );

      await interaction.showModal(modal);
    }

    if (interaction.customId === 'ticket-modal') {
      const description = interaction.fields.getTextInputValue('ticket-description');
      const ticketType = interaction.fields.getSelectMenuValue('ticket-type');
      const category = interaction.guild.channels.cache.get(interaction.client.ticketCategoryId);

      const ticketChannel = await interaction.guild.channels.create({
        name: `${ticketType}-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
          },
          {
            id: interaction.client.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
          }
        ],
      });

      await ticketChannel.send(`Ticket created by ${interaction.user.tag}\n\nDescription:\n${description}`);
      await interaction.reply({ content: 'Your ticket has been created.', ephemeral: true });

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`close-ticket-${interaction.user.id}`)
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Danger),
        );

      await ticketChannel.send({ content: 'Click the button below to close the ticket.', components: [row] });

      // Assign the appropriate role based on the ticket type
      const roleName = ticketType === 'stari-helpdesk' ? 'Stari-Helpdesk' : 'Stari-Status';
      const role = interaction.guild.roles.cache.find(r => r.name === roleName);
      if (role && !interaction.member.roles.cache.has(role.id)) {
        await interaction.member.roles.add(role);
      }
    }

    if (interaction.customId.startsWith('close-ticket')) {
      const ticketChannel = interaction.channel;
      const transcript = await createTranscript(ticketChannel);
      await interaction.reply({ content: 'Ticket closed. The transcript will be sent to you shortly.', ephemeral: true });
      const userId = interaction.customId.split('-')[2];
      const user = await interaction.guild.members.fetch(userId);
      await user.send({ content: 'Here is the transcript of your support ticket.', files: [transcript] });
      fs.unlinkSync(transcript);  // Clean up the transcript file
      await ticketChannel.delete();
    }
  },
};

async function createTranscript(channel) {
  const messages = await channel.messages.fetch({ limit: 100 });
  const transcript = messages
    .map(message => `${message.author.tag}: ${message.content}`)
    .reverse()
    .join('\n');

  const transcriptPath = path.join(__dirname, `../../transcripts/${channel.name}.txt`);
  fs.writeFileSync(transcriptPath, transcript);

  return transcriptPath;
}
