require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const { PermissionsBitField } = require('discord.js');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

module.exports = {
  name: 'contribute',
  description: 'Contribute code to a GitHub repository',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply('You do not have permission to use this command.');
    }

    const repoDetails = args[0];
    const filePath = args[1];
    const fileContent = args.slice(2).join(' ');

    if (!repoDetails || !filePath || !fileContent) {
      return message.reply('Please provide the repository details, file path, and file content.');
    }

    const [owner, repo] = repoDetails.split('/');
    if (!owner || !repo) {
      return message.reply('Please provide valid repository details in the format `owner/repo`.');
    }

    try {
      // Get the default branch of the repository
      const { data: repoData } = await octokit.repos.get({ owner, repo });
      const defaultBranch = repoData.default_branch;

      // Create a new branch
      const branchName = `contribution-${Date.now()}`;
      const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`
      });

      await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: refData.object.sha,
      });

      // Create or update the file
      const { data: blobData } = await octokit.git.createBlob({
        owner,
        repo,
        content: Buffer.from(fileContent).toString('base64'),
        encoding: 'base64'
      });

      const { data: treeData } = await octokit.git.createTree({
        owner,
        repo,
        base_tree: refData.object.sha,
        tree: [
          {
            path: filePath,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha,
          }
        ]
      });

      const { data: commitData } = await octokit.git.createCommit({
        owner,
        repo,
        message: `Contribution from ${message.author.tag}`,
        tree: treeData.sha,
        parents: [refData.object.sha],
      });

      await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${branchName}`,
        sha: commitData.sha,
      });

      // Create a pull request
      const { data: prData } = await octokit.pulls.create({
        owner,
        repo,
        title: `Contribution from ${message.author.tag}`,
        head: branchName,
        base: defaultBranch,
        body: 'This is an automated contribution.',
      });

      message.reply(`Pull request created: ${prData.html_url}`);
    } catch (error) {
      console.error(error);
      message.reply('There was an error creating the contribution. Please check the details and try again.');
    }
  }
};
