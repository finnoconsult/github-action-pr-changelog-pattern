const core = require('@actions/core');
const { extactMessages, messageRegex } = require('./extactMessages');

try {

  const pr = JSON.parse(process.env.PR);
  messages = [pr.title].concat(pr.body.split('\n'));

  const currentVersion = core.getInput('version');
  const messagePattern = core.getInput('message-pattern') || 'https://[\wéáőúíóüö/\-\.]+';
  const bodyTempate = core.getInput('body-template') || '## {{version}} - {{date}}\n\n{ - {message}\n}';

  console.log('messages', messages);
  console.log('messagePattern', messagePattern);
  console.log('bodyTempate', bodyTempate);

  // TODO: order and group by fix/feature classification?
  const extractedContent = extactMessages(bodyTempate, messages, messagePattern);

  console.log('extractedContent', extractedContent);

  const body = bodyTempate
    .replace(/{{version}}/g, currentVersion)
    .replace(/{{date}}/g, new Date().toISOString().substring(0,10))
    .replace(/{{datetime}}/g, new Date().toISOString())
    .replace(messageRegex, extractedContent);

  console.log('content', body);

  core.setOutput("content", body);
  // Get the JSON webhook payload for the event that triggered the workflow
} catch (error) {
  core.setFailed(error.message);
}