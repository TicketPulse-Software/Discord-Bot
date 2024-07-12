const axios = require('axios');

module.exports = {
  name: 'track',
  description: 'Track a GitHub repository',
  async execute(message, args) {
    const repo = args[0];
    if (!repo) return message.reply('Please provide a repository in the format `owner/repo`.');

    try {
      const response = await axios.get(`https://api.github.com/repos/${repo}`);
      const repoInfo = response.data;

      message.channel.send(`**${repoInfo.full_name}**
        - ⭐ Stars: ${repoInfo.stargazers_count}
        - 🍴 Forks: ${repoInfo.forks_count}
        - 🐛 Open Issues: ${repoInfo.open_issues_count}
        - 📅 Last Updated: ${new Date(repoInfo.updated_at).toLocaleString()}`);
    } catch (error) {
      console.error(error);
      message.reply('Error fetching repository data. Please make sure the repository exists.');
    }
  }
};
