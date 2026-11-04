import type { Translation } from '../../types'
import type { topics as zhTopics } from '../../zh-TW/topics'
import { t0 } from './t0'
import { t1 } from './t1'
import { t2 } from './t2'
import { t3 } from './t3'
import { t4 } from './t4'
import { t5 } from './t5'
import { t6 } from './t6'
import { t7 } from './t7'
import { t8 } from './t8'
import { t9 } from './t9'
import { t10 } from './t10'
import { t11 } from './t11'
import { t12 } from './t12'

// Exactly the topics the Chinese side has, each with the same sections, questions and examples.
export const topics: { readonly [K in keyof typeof zhTopics]: Translation<(typeof zhTopics)[K]> } = {
  T0: t0,
  T1: t1,
  T2: t2,
  T3: t3,
  T4: t4,
  T5: t5,
  T6: t6,
  T7: t7,
  T8: t8,
  T9: t9,
  T10: t10,
  T11: t11,
  T12: t12,
}
