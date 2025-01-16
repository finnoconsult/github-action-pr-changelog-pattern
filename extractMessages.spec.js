const {extactMessages, lowercaseFirstWordInSentence} = require('./extactMessages')


describe.each([
  ['Feat: hello World feature', 'feat: hello World feature'],
  ['Feat!: disrupting the World feature', 'feat!: disrupting the World feature'],
  ['CI!: new ENV vars', 'ci!: new ENV vars'],
  ['ci!: new ENV vars', 'ci!: new ENV vars'],
  ['Chore: new ENV vars', 'chore: new ENV vars'],
  ['chore: new ENV vars', 'chore: new ENV vars'],
  ['fix: something bad', 'fix: something bad'],
  ['Hello World', 'hello World'],
  ['!Hello World', '!Hello World'],
  ['', ''],
  ['   Hello   World', '   Hello   World'],
  ['Hello, World!', 'hello, World!'],
  ['Árvíztűrő tükörfúrógép!', 'Árvíztűrő tükörfúrógép!']
])('lowercaseFirstWordInSentence', (input, expectedOutput) => {
  it(`should ${expectedOutput === input ? 'not change' : 'lowercase the first word in'} the sentence`, () => {
    const result = lowercaseFirstWordInSentence(input);
    expect(result).toBe(expectedOutput);
  });
}); 

describe('extract trello messages with link breaks', () => {
  const bodyTemplate = '## {{version}}\n\n{{date}}\n\n{ - {message}\n}';
  const messages2 = [
    'new version\nhttps://trello.com/whatever/asdasd-sd-sdf',
    'Merge pull request #12 from finnoconsult/fix/merge-dev-v1\n' +
      '\n' +
      'fix new https://trello.com/whatever/2nd-link\n' +
      'undefined'
  ];
  it('2 links', () => expect(extactMessages(bodyTemplate, messages2)).toEqual(" - https://trello.com/whatever/asdasd-sd-sdf\n - https://trello.com/whatever/2nd-link\n"));

  const messages3 = [
    'new version\nhttps://trello.com/whatever/asdasd-sd-sdf\nhttps://trello.com/whatever/SDFÁD-234534',
    'Merge pull request #12 from finnoconsult/fix/merge-dev-v1\n' +
      '\n' +
      'fix new https://trello.com/whatever/2nd-link\n' +
      'undefined'
  ];
  it('3 links', () => expect(extactMessages(bodyTemplate, messages3)).toEqual(" - https://trello.com/whatever/asdasd-sd-sdf\n - https://trello.com/whatever/SDFÁD-234534\n - https://trello.com/whatever/2nd-link\n"));

  const messages1 = [
    'new version\nhttps://trello.com/whatever/asdasd-sd-sdf',
    'Merge pull request #12 from finnoconsult/fix/merge-dev-v1\n' +
      'undefined'
  ];
  it('1 link', () => expect(extactMessages(bodyTemplate, messages1)).toEqual(" - https://trello.com/whatever/asdasd-sd-sdf\n"));
});

describe('extract trello messages with simple template', () => {
  const bodyTemplate = '{{message},}';
  const messages = [
    'new version\nhttps://trello.com/whatever/asdasd-sd-sdf',
    'Merge pull request #12 from finnoconsult/fix/merge-dev-v1\n' +
      '\n' +
      'fix new https://trello.com/whatever/2nd-link\n' +
      'undefined'
  ];
  it('2 links', () => expect(extactMessages(bodyTemplate, messages)).toEqual("https://trello.com/whatever/asdasd-sd-sdf,https://trello.com/whatever/2nd-link,"));
});

describe.each([
  { messages:[
    'fix: amend readme',
    '### This PR Resolves\r',
    '\r',
    'testing CI\r',
    'fix: add title for testing CI\r',
    "add pull_request_template.md in order to generate the next PR's body"
  ] , output:"fix: amend readme,fix: add title for testing CI," },
  { messages:[
    'feat: 759 new strapi plugin page to enlist potential institution problems missing logo',
    'resolves [#759](https://github.com/finnoconsult/websites/issues/759)\n',
    '![image](https://github.com/user-attachments/assets/83fae773-b7c7-43df-b601-ecea5e05351d)\n'
  ] , output:"feat: 759 new strapi plugin page to enlist potential institution problems missing logo,https://github.com/finnoconsult/websites/issues/759,https://github.com/user-attachments/assets/83fae773-b7c7-43df-b601-ecea5e05351d," },
  { messages:[
    'Feat: #344 something great feat',
    'Merge pull request #12 from finnoconsult/fix/merge-dev-v1\n'
  ] , output:"feat: #344 something great feat," },
  { messages: [
    'Feat #344 something great feat',
    'Merge pull request #12 from finnoconsult/fix/merge-dev-v1\n'
  ] , output:"" },
  { messages: [
    'Merge pull request #12 from https://finnoconsult/fix/merge-dev-v1#ádé\n'
  ] , output:"https://finnoconsult/fix/merge-dev-v1#ádé," },
  { messages: [
    'Merge pull request #12 from https://finnoconsult/fix/merge-dev-v1-pomádé\n'
  ] , output:"https://finnoconsult/fix/merge-dev-v1-pomádé," },
  { messages: [
    'Feat: #344 something great feat',
    'Merge pull request #12 from HTTPS://finnoconsult/fix/merge-dev-v1\n'
  ] , output:"feat: #344 something great feat,https://finnoconsult/fix/merge-dev-v1," },
  { messages: [
    'Feat: #344 something great feat',
    'Merge pull request #12 from http://finnoconsult/fix/merge-dev-v1\n'
  ] , output:"feat: #344 something great feat," },
  { messages: [
    'Chore!: #333 something annoying chore',
  ] , output:"chore!: #333 something annoying chore," }
])('extract semantical commits from messages', ({messages, output}) => {
  const bodyTemplate = '{{message},}';

  it('1 semantic ', () => expect(extactMessages(bodyTemplate, messages)).toEqual(output));


});
