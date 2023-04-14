export function fakeNews(lang = 'en') {
  let fixture = 'news.yaml';

  if (lang !== 'en') {
    fixture = `news-${lang}.yaml`;
  }

  cy.intercept('GET', '**/dips/master/meta/news.yaml*', { fixture }).as('News');
}
