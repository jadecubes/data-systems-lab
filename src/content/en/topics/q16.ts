import type { Translation } from '../../types'
import type { q16 as zh } from '../../zh-TW/topics/q16'

export const q16: Translation<typeof zh> = {
  title: 'How soon would we notice corrupted data?',
  summary: 'Data corruption will happen sooner or later; keep checking, regularly try restoring backups, and do not wait for damage downstream to find out.',
  tags: ['data corruption', 'auditing', 'integrity', 'backup'],
  sections: {
    'ch13-trust-but-verify': {
      conclusion: 'Data corruption will happen sooner or later; even mature databases have had bugs that violated constraints. Keep auditing the integrity of the whole derived-data pipeline, regularly try restoring from a backup, and design the system so you can reconstruct afterwards what happened.',
      tradeoff: 'Continuous auditing and deriving a second copy to compare against cost resources; without checks, corruption is found only after it has damaged things downstream, when tracing it is harder and more expensive.',
      questions: ['When did we last actually restore from a backup? Did it work?', 'Do we regularly check that derived data still matches its source?', 'When something goes wrong, can we reproduce which input and which version of the code caused it?'],
      examples: [
        { source: 'book', text: 'The book notes that HDFS and Amazon S3 do not fully trust disks: background processes keep reading files back and comparing them with other replicas. Likewise, if you never try restoring, you may discover a broken backup only after data is lost.' },
        { source: 'book', text: 'The book also points out that past versions of MySQL failed to maintain a uniqueness constraint correctly, and PostgreSQL’s serializable isolation once allowed write skew.' },
      ],
    },
  },
}
