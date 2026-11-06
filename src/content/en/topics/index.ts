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
import { q1 } from './q1'
import { q2 } from './q2'
import { q3 } from './q3'
import { q4 } from './q4'
import { q5 } from './q5'
import { q6 } from './q6'
import { q7 } from './q7'
import { q8 } from './q8'
import { q9 } from './q9'
import { q10 } from './q10'
import { q11 } from './q11'
import { q12 } from './q12'
import { q13 } from './q13'
import { q14 } from './q14'
import { q15 } from './q15'
import { q16 } from './q16'

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
  Q1: q1,
  Q2: q2,
  Q3: q3,
  Q4: q4,
  Q5: q5,
  Q6: q6,
  Q7: q7,
  Q8: q8,
  Q9: q9,
  Q10: q10,
  Q11: q11,
  Q12: q12,
  Q13: q13,
  Q14: q14,
  Q15: q15,
  Q16: q16,
}
