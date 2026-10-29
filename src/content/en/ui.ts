import type { Ui } from '../../i18n/content'

export const ui: Ui = {
  siteTitle: 'Data Systems for Technical Project Managers',
  mapIntro:
    'The parts of Designing Data-Intensive Applications (2nd edition) that technical project managers (PMs) use, grouped by PM work. Each topic gives the conclusion, the trade-off, the questions to ask engineers, and examples. Only these selected sections are covered; this is not a summary of the book.',
  bookSource: 'Source: Designing Data-Intensive Applications, 2nd edition, by Martin Kleppmann and Chris Riccomini (O’Reilly, 2026), summarised in this site’s own words.',
  groups: {
    spec: 'Requirements that belong in the spec',
    anomalies: 'Failures users will run into',
    change: 'Releases and change',
    data: 'Where data lives and which copy is right',
  },
  ratings: { use: 'Use it', ask: 'Ask about it', term: 'Know the term', skip: 'Skip' },
  ratingMeanings: {
    use: 'Apply it in specs and trade-offs, and foresee the failures users will hit.',
    ask: 'Know what to ask engineers and understand the answer.',
    term: 'Recognise the term when you hear it.',
  },
  ratingsHeading: 'Ratings',
  roles: { product: 'Product-team PM', platform: 'Platform-team PM' },
  roleRating: '{role} — {rating}',
  roleSeparator: '; ',
  zoneDefault: 'Default rating: {ratings}',
  ratingDisclaimer: 'Ratings were assigned by an AI model from the site author’s reading notes on the book, and are not yet checked against PM practice.',
  ratingException: 'This section differs from that default: {ratings}',
  labels: {
    conclusion: 'Conclusion',
    tradeoff: 'Trade-off',
    questions: 'Questions to ask engineers',
    examples: 'Examples',
  },
  card: { read: 'Read →', readLabel: 'Read: {topic}', learn: 'What you will learn' },
  index: { label: 'Contents', skip: 'Skip to page content', sections: 'Sections of {topic}' },
  laneNames: { browser: 'Browser', server: 'Web server', database: 'Database' },
  diagram: { message: '{from} to {to}: ', note: '{lane}: ' },
  nav: {
    label: 'Topic navigation',
    map: 'All topics',
    prev: 'Previous: {title}',
    next: 'Next: {title}',
  },
  languageSwitchLabel: 'Change language',
  langName: 'English',
  pageTitle: { map: '{site}', topic: '{topic} · {site}' },
  notFound: {
    title: 'Page not found',
    lead: 'The address may be mistyped, or this page is not published yet.',
    link: 'See all topics',
  },
}
