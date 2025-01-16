const messageRegex = /{([^{]*){message}([^{]*)}/i;

const lowercaseFirstWordInSentence = (sentence) => sentence.replace(/^\b\w+\b/, match => match.toLowerCase());

const linkUrlOrSemanticReleaseMatchingPattern='(^(feat|fix|docs|style|refactor|perf|test|chore|ci)!?:\\s.*)|(https://[wéáőúíóüö#/\\w-.]+)';

function extactMessages(template, messages, messagePattern=linkUrlOrSemanticReleaseMatchingPattern) {
  const messagesPattern = template.match(messageRegex);

  const extractedContent = messages.reduce(
    (array, message) => {
      const matched = message.match(new RegExp(messagePattern, 'gi'));
      if (process.env.VERBOSE !== 'false') {
        console.log('checking message', message, 'against', new RegExp(messagePattern, 'gi'), '=>', matched);
      }
      return matched ? array.concat(matched) : array;
    },
    []
  )
  .map(message => lowercaseFirstWordInSentence(`${messagesPattern[1]}${message}${messagesPattern[2]}`))
  .join('');

  // console.log('extractedContent', extractedContent);

  return extractedContent;
}

exports.extactMessages = extactMessages;

exports.messageRegex = messageRegex;
exports.lowercaseFirstWordInSentence = lowercaseFirstWordInSentence;
exports.linkUrlOrSemanticReleaseMatchingPattern = linkUrlOrSemanticReleaseMatchingPattern;
