const { PermissionsBitField, ChannelType, TextInputBuilder, ModalBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const quizQuestions = [
  {
    question: "What does PHP stand for?",
    options: ["PHP: Hypertext Preprocessor", "Private Home Page", "Personal Hypertext Processor"],
    answer: "PHP: Hypertext Preprocessor"
  },
  {
    question: "PHP server scripts are surrounded by delimiters, which?",
    options: ["<?php...?>", "<&>...</&>", "<script>...</script>"],
    answer: "<?php...?>"
  },
  {
    question: 'How do you write "Hello World" in PHP?',
    options: ['echo "Hello World";', '"Hello World";', 'Document.Write("Hello World");'],
    answer: 'echo "Hello World";'
  },
  {
    question: 'All variables in PHP start with which symbol?',
    options: ['$', '&', '!'],
    answer: '$'
  },
  {
    question: 'What is the correct way to end a PHP statement?',
    options: [';', 'New line', '.'],
    answer: ';'
  },
  {
    question: 'The PHP syntax is most similar to:',
    options: ['Perl and C', 'JavaScript', 'VBScript'],
    answer: 'Perl and C'
  },
  {
    question: 'How do you get information from a form that is submitted using the "get" method?',
    options: ['$_GET[];', 'Request.QueryString;', 'Request.Form;'],
    answer: '$_GET[];'
  },
  {
    question: 'When using the POST method, variables are displayed in the URL:',
    options: ['True', 'False'],
    answer: 'False'
  },
  {
    question: 'In PHP you can use both single quotes ( \' \' ) and double quotes ( " " ) for strings:',
    options: ['True', 'False'],
    answer: 'True'
  },
  {
    question: 'Include files must have the file extension ".inc"',
    options: ['True', 'False'],
    answer: 'False'
  },
  {
    question: 'What is the correct way to include the file "time.inc" ?',
    options: ['<?php include "time.inc"; ?>', '<?php include:"time.inc"; ?>', '<!-- include file="time.inc" -->', '<?php include file="time.inc"; ?>'],
    answer: '<?php include "time.inc"; ?>'
  },
  {
    question: 'What is the correct way to create a function in PHP?',
    options: ['function myFunction()', 'new_function myFunction()', 'create myFunction()'],
    answer: 'function myFunction()'
  },
  {
    question: 'What is the correct way to open the file "time.txt" as readable?',
    options: ['fopen("time.txt","r");', 'open("time.txt");', 'fopen("time.txt","r+");', 'open("time.txt","read");'],
    answer: 'fopen("time.txt","r");'
  },
  {
    question: 'PHP allows you to send emails directly from a script',
    options: ['True', 'False'],
    answer: 'True'
  },
  {
    question: 'Which superglobal variable holds information about headers, paths, and script locations?',
    options: ['$GLOBALS', '$_GET', '$_SESSION', '$_SERVER'],
    answer: '$_SERVER'
  },
  {
    question: 'What is the correct way to add 1 to the $count variable?',
    options: ['$count++;', '$count =+1', '++count', 'count++;'],
    answer: '$count++;'
  },
  {
    question: 'What is a correct way to add a comment in PHP?',
    options: ['/*...*/', '<comment>...</comment>', '<!--...-->', '*\...\*'],
    answer: '/*...*/'
  },
  {
    question: 'PHP can be run on Microsoft Windows IIS(Internet Information Server):',
    options: ['True', 'False'],
    answer: 'True'
  },
  {
    question: 'The die() and exit() functions do the exact same thing.',
    options: ['True', 'False'],
    answer: 'True'
  },
  {
    question: 'Which one of these variables has an illegal name?',
    options: ['$my-Var', '$myVar', '$my_Var'],
    answer: '$my-Var'
  },
  {
    question: 'How do you create a cookie in PHP?',
    options: ['setcookie()', 'createcookie', 'makecookie()'],
    answer: 'setcookie()'
  },
  {
    question: 'In PHP, the only way to output text is with echo.',
    options: ['True', 'False'],
    answer: 'False'
  },
  {
    question: 'How do you create an array in PHP?',
    options: ['$cars = array["Volvo", "BMW", "Toyota"];', '$cars = "Volvo", "BMW", "Toyota";', '$cars = array("Volvo", "BMW", "Toyota");'],
    answer: '$cars = array("Volvo", "BMW", "Toyota");'
  },
  {
    question: 'The if statement is used to execute some code only if a specified condition is true',
    options: ['True', 'False'],
    answer: 'True'
  },
  {
    question: 'Which operator is used to check if two values are equal and of same data type?',
    options: ['==', '!=', '===', '='],
    answer: '==='
  }
];

let score = 0;
let questionIndex = 0;

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton() && !interaction.isModalSubmit() && !interaction.isSelectMenu()) return;

    if (interaction.customId.startsWith('guess')) {
      const selectedWord = interaction.message.content.split(' ').pop();
      const guess = interaction.customId.split('-').pop();

      if (guess === selectedWord) {
        await interaction.update({ content: `Correct! The word is ${selectedWord}.`, components: [] });
      } else {
        await interaction.update({ content: `Wrong! The word was ${selectedWord}.`, components: [] });
      }
    } else if (interaction.customId.startsWith('quiz')) {
      const selectedAnswer = interaction.customId.split('-').pop();
      const correctAnswer = quizQuestions[questionIndex].answer;

      if (selectedAnswer === correctAnswer) {
        score++;
        await interaction.update({ content: `Correct! The answer is ${correctAnswer}.`, components: [] });
      } else {
        await interaction.update({ content: `Wrong! The correct answer is ${correctAnswer}.`, components: [] });
      }
      questionIndex++;

      if (questionIndex < quizQuestions.length) {
        setTimeout(async () => {
          const question = quizQuestions[questionIndex];
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`quiz-${question.options[0]}`)
                .setLabel(question.options[0])
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId(`quiz-${question.options[1]}`)
                .setLabel(question.options[1])
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId(`quiz-${question.options[2]}`)
                .setLabel(question.options[2])
                .setStyle(ButtonStyle.Primary)
            );

          await interaction.followUp({
            content: question.question,
            components: [row]
          });
        }, 1000);
      } else {
        await interaction.followUp({ content: `Quiz finished! Your score is ${score}/${quizQuestions.length}.`, components: [] });
        score = 0;
        questionIndex = 0;
      }
    }

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

    // Other interaction logic (e.g., ticket creation) goes here...
  }
};

