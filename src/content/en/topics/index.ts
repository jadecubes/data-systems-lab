import type { Translation } from '../../types'
import type { topics as zhTopics } from '../../zh-TW/topics'
import { t3 } from './t3'
import { t4 } from './t4'

// Exactly the topics the Chinese side has, each with the same sections, questions and examples.
export const topics: { readonly [K in keyof typeof zhTopics]: Translation<(typeof zhTopics)[K]> } = { T3: t3, T4: t4 }
