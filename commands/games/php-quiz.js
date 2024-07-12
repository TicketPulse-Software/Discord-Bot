const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('php-quiz')
    .setDescription('Take a PHP quiz'),
  async execute(interaction) {
    let score = 0;
    let questionIndex = 0;

    const askQuestion = async () => {
      if (questionIndex >= quizQuestions.length) {
        await interaction.editReply({ content: `Quiz finished! Your score is ${score}/${quizQuestions.length}.`, components: [] });
        return;
      }

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

      await interaction.editReply({
        content: question.question,
        components: [row]
      });

      const filter = i => i.customId.startsWith('quiz') && i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

      collector.on('collect', async i => {
        if (i.customId === `quiz-${question.answer}`) {
          score++;
          await i.update({ content: `Correct! The answer is ${question.answer}.`, components: [] });
        } else {
          await i.update({ content: `Wrong! The correct answer is ${question.answer}.`, components: [] });
        }
        questionIndex++;
        setTimeout(askQuestion, 5000);
      });

      collector.on('end', collected => {
        if (collected.size === 0) {
          interaction.editReply({ content: 'Time is up! Moving to the next question.', components: [] });
          questionIndex++;
          setTimeout(askQuestion, 5000);
        }
      });
    };

    await interaction.reply({ content: 'Starting PHP quiz...', ephemeral: true });
    askQuestion();
  }
};
