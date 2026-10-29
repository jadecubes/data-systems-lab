import type { Translation } from '../../types'
import type { t2 as zh } from '../../zh-TW/topics/t2'

export const t2: Translation<typeof zh> = {
  title: 'Do not let averages hide slow requests',
  summary: 'Use the median for typical experience and high percentiles for the slowest requests, then make the target measurable.',
  tags: ['median', 'percentile', 'tail latency', 'service level objective'],
  sections: {
    'ch2-average-median-and-percentiles': {
      conclusion: 'Average response time can be distorted by a few very slow requests and obscures the difference between typical and worst experiences. The median splits requests in half; percentiles such as p99 expose tail latency.',
      tradeoff: 'One metric is easy to report but hides the distribution. Several percentiles help, provided the sample and measurement window are sound.',
      questions: ['How long do the slowest 1% of requests take?', 'Is the number aggregated across users or separated by request type?'],
      examples: [{ source: 'book', text: 'The book uses Amazon to show that the slowest requests may come from customers who buy the most; a small group of slow requests can have a large business impact.' }],
    },
    'ch2-use-of-response-time-metrics': {
      conclusion: 'A service level objective should set measurable boundaries for the median and percentiles such as p99, along with success rate. A page waiting on many backend calls is more likely to encounter tail latency.',
      tradeoff: 'Parallel backend calls make a page easy to assemble, but the page often waits for the slowest call. One backend’s p99 can understate page latency.',
      questions: ['How many backend calls does the page wait for, and what is each p99?', 'What happens when the service level objective is missed?'],
      examples: [
        { source: 'book', text: 'The book illustrates a measurable objective: median under 200 ms, p99 under one second, and at least 99.9% of valid requests receiving a non-error response.' },
        { source: 'ours', text: 'Suppose each of 100 parallel backend calls independently has a 1% chance of being slow. The chance that at least one is slow is 1 − 0.99¹⁰⁰, about 63%.' },
      ],
    },
  },
}
