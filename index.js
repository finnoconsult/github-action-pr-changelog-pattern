const core = require('@actions/core');
const { extactMessages, messageRegex, linkUrlOrSemanticReleaseMatchingPattern } = require('./extactMessages');

try {

  const pr = JSON.parse(process.env.PR);
  messages = [pr.title, ...pr.body.split('\n')];

  const currentVersion = core.getInput('version');
  const messagePattern = core.getInput('message-pattern') || linkUrlOrSemanticReleaseMatchingPattern;
  const bodyTempate = core.getInput('body-template') || '## {{version}} - {{date}}\n\n{ - {message}\n}';

  console.log('messagePattern', messagePattern);
  console.log('bodyTempate', bodyTempate);
  console.log('messages', messages);

  // TODO: order and group by fix/feature classification?
  const extractedContent = extactMessages(bodyTempate, messages, messagePattern);

  console.log('extractedContent', extractedContent);

  const body = bodyTempate
    .replace(/{{version}}/g, currentVersion)
    .replace(/{{date}}/g, new Date().toISOString().substring(0,10))
    .replace(/{{datetime}}/g, new Date().toISOString())
    .replace(messageRegex, extractedContent);

  console.log('new content', body);

  core.setOutput("new", body);
  core.setOutput("new_array", body.split('\n'));
  // Get the JSON webhook payload for the event that triggered the workflow
} catch (error) {
  core.setFailed(error.message);
}