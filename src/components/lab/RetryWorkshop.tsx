import { useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import {
  answered,
  builds,
  canVerify,
  eventsThroughTask,
  guidedNext,
  maxOrders,
  passedQuestion,
  pending,
  q3Answers,
  q4Answers,
  q5Answers,
  replay,
  replayTrace,
  settled,
  simulate,
  tasks,
  undoStep,
  type LabEvent,
  type LabState,
  type Q3Answer,
  type StepEvent,
  STANDARD_Q1,
} from '../../lessons/retryWorkshop'
import type { Content } from '../../i18n/content'
import { interpolate } from '../../i18n/format'
import { stepText } from './describe'
import { CodePanel, Database, Phone } from './Panels'
import { Roles } from './Roles'
import { DryRun, FinalCriterion, Q3Reveal, Worlds } from './Sections'
import { Controls, controlsHint, LockedPreview, ProgressStrip, QuestionHeader } from './Shell'
import { Timeline } from './Timeline'
import type { LabHistory } from './useLabHistory'

const original = tasks[0].setup

/** Questions 3 to 5 each ask for one answer, by question index. */
const singleAnswer: Partial<Record<number, readonly ['q3' | 'q4' | 'q5', readonly string[]]>> = { 2: ['q3', q3Answers], 3: ['q4', q4Answers], 4: ['q5', q5Answers] }

/**
 * The verdict in the lab's words: a "done" or "not yet" for the questions the reader builds, then why. Chosen answers
 * need no such word: their feedback opens with its own ("Right.", "A common misconception.").
 */
function verdictText(content: Content, state: LabState): { prefix: string | null; body: string } | null {
  const t = content.labs.d1.verdicts
  const v = state.verdict
  if (!v) return null
  if (v.code === 'answer') {
    const feedback = content.labs.d1.answers[singleAnswer[state.task]![0]].feedback
    return { prefix: null, body: (feedback as Record<string, string>)[v.answer] }
  }
  // Step numbers and question 6's order count, by name.
  const numbers = Object.fromEntries(Object.entries(v).flatMap(([k, x]) => (typeof x === 'number' ? [[k, content.number(x)]] : [])))
  const texts: Record<string, string> = state.task === 0 ? t.q1 : state.task === 1 ? t.q2 : t.q6
  return { prefix: v.ok ? t.passed : t.notYet, body: interpolate(texts[v.code], numbers) }
}

export function RetryWorkshop({ content, history, live }: { content: Content; history: LabHistory; live: LabState }) {
  const t = content.labs.d1
  const { location, notice, viewing, setViewing, navigate, act } = history
  // A finished question can be read again in full; a locked one only previewed.
  const readOnly = viewing !== null && viewing < live.task
  const state = readOnly ? replay(eventsThroughTask(location.events, viewing)) : live
  const preview = viewing !== null && viewing > live.task ? viewing : null
  // The back buttons unmount with the question they leave; focus the live question instead of losing it.
  const wasViewing = useRef(viewing)
  useEffect(() => {
    if (wasViewing.current !== null && viewing === null) document.getElementById('lab-question-title')?.focus()
    wasViewing.current = viewing
  }, [viewing])
  const focusQuestion = () => document.getElementById('lab-question-title')?.focus()
  const next = () => {
    act('next')
    focusQuestion()
  }
  // A control can turn itself off (Check after checking, Reset after resetting, the guided button after its last step);
  // then focus goes to Check this question if that is on, otherwise to the feedback, which says what happened.
  const keepFocus = (change: () => void) => {
    flushSync(change)
    const focused = document.activeElement
    if (focused !== document.body && !(focused instanceof HTMLButtonElement && focused.disabled)) return
    const verify = document.getElementById('lab-verify') as HTMLButtonElement | null
    ;(verify && !verify.disabled ? verify : document.getElementById('lab-feedback'))?.focus()
  }
  const { task, verdict } = state
  const setup = tasks[task].setup
  const building = builds(task)
  const checked = !!verdict?.ok
  const interactive = building && !readOnly && !checked
  const hasNext = task < tasks.length - 1
  // Previous step and Reset this question stay within this question, and stop once it passes: undoing a pass would
  // take away what it showed.
  const canUndo = location.events.length > state.taskStart && !checked
  const canRestart = location.events.length > 0

  // Questions 4 and 5 run question 1's order under new code, shown only once answered correctly, so a wrong answer
  // gives nothing away.
  const replayed = task === 3 || task === 4 ? replayTrace(state.q1Trace, setup) : null
  const trace = building ? state.trace : replayed && checked ? replayed.trace : []
  const run = simulate(setup, trace)
  const last = run.steps.at(-1)
  const active = !last ? null : last.actor === 'server' ? 'sql' : last.event === 'send' || last.event === 'resend' ? 'api' : null
  const guided = interactive ? guidedNext(state) : null
  // Offered while it can still help: the standard order goes on, or the reader's own run is not over yet.
  const offerGuided = interactive && (!!guided || !settled(run))

  const hint = controlsHint(content, {
    checked,
    failedOn: verdict && !verdict.ok ? (verdict.code === 'too-few' || (building && task !== 5) ? 'build' : 'answer') : null,
    needsSteps: !building || settled(run) ? null : !state.trace.length ? 'empty' : pending(run) === 'server' ? { server: run.queue[0] + 1 } : 'waiting',
    needsAnswer: !answered(state) ? (task === 5 ? 'both' : 'one') : null,
    hasNext,
    canUndo,
    canRestart,
  })
  // A notice is about the question being worked on, so a finished one read again shows its own verdict.
  const shownNotice = readOnly ? null : notice
  const verdictLine = verdictText(content, state)
  // A notice outranks the verdict; the crux notice comes with a step, which clears the verdict, so it never hides one.
  const status =
    (shownNotice && t.notices[shownNotice]) ??
    verdictLine?.body ??
    (building ? (last ? stepText(content, setup, last) : t.notices.noSteps) : answered(state) ? t.notices.answered : t.notices.pickAnswer)
  const prefix = shownNotice ? null : verdictLine?.prefix

  const single = singleAnswer[task]
  const radio = (name: string, value: string, label: string) => (
    <label key={value}>
      <input type="radio" name={name} checked={state.answers.includes(value)} disabled={readOnly || checked} onChange={() => act(value as LabEvent)} />
      {label}
    </label>
  )

  return (
    <section className="lab-workshop" aria-labelledby="workshop-title">
      <h2 id="workshop-title">{t.workshopHeading}</h2>
      {location.invalid && (
        <p role="alert" className="lab-alert">
          {t.notices.invalid}
        </p>
      )}
      <ProgressStrip content={content} live={live} viewing={viewing} onView={(i) => (i === null && viewing === null ? focusQuestion() : setViewing(i))} onNext={next} />

      {preview !== null ? (
        <LockedPreview content={content} index={preview} liveTask={live.task} onBack={() => setViewing(null)} />
      ) : (
        <>
          <QuestionHeader content={content} index={task} readOnly={readOnly} />
          {replayed?.substituted && <p className="lab-caption">{t.replayed}</p>}
          {replayed?.dropped && checked && <p className="lab-caption">{t.replayedDropped}</p>}

          {task === 2 ? (
            <Worlds content={content} q1Trace={state.q1Trace} q2Trace={state.q2Trace} />
          ) : (
            <div className="lab-experiment">
              {(building || checked) && <Phone content={content} run={run} />}
              <CodePanel content={content} version={setup.version} active={active} />
              {building || checked ? (
                <div className="lab-stage" role="group" aria-labelledby="stage-title">
                  <h4 id="stage-title">{t.stage.heading}</h4>
                  <p className="lab-caption">{building ? t.stage.note : t.stage.replayNote}</p>
                  {building && (
                    <>
                      <p className="lab-goal">{t.questions[task].goal}</p>
                      <ol className="lab-howto">
                        {t.questions[task].howTo.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </>
                  )}
                  {offerGuided && (
                    <div className="lab-action lab-guided">
                      <button type="button" disabled={!guided} aria-describedby="guided-why" onClick={() => guided && keepFocus(() => act(guided, task === 0 && state.trace.length === 2 ? 'crux' : null))}>
                        {t.stage.guided}
                      </button>
                      <small id="guided-why">{!guided ? t.stage.guidedOff : state.trace.length ? t.stage.guidedMore : t.stage.guidedFirst}</small>
                    </div>
                  )}
                  {building && checked && !readOnly && <p className="lab-caption">{t.stage.passed}</p>}
                  {building && <Roles content={content} setup={setup} trace={trace} interactive={interactive} onStep={(e: StepEvent) => act(e)} />}
                  <Timeline content={content} setup={setup} trace={trace} title={t.timeline.heading} caption={t.timeline.caption} />
                  <Database content={content} version={setup.version} run={run} />
                </div>
              ) : (
                <div className="lab-stage" role="group" aria-labelledby="reference-title">
                  <h4 id="reference-title">{t.reference.heading}</h4>
                  <Timeline content={content} setup={original} trace={replayed?.substituted ? STANDARD_Q1 : state.q1Trace} title={t.timeline.heading} caption={replayed?.substituted ? t.reference.standard : t.reference.caption} />
                </div>
              )}
            </div>
          )}

          {single && (
            <fieldset className="lab-choices">
              <legend>{t.answers[single[0]].legend}</legend>
              {single[1].map((a) => radio(single[0], `${single[0]}-${a}`, (t.answers[single[0]].options as Record<string, string>)[a]))}
            </fieldset>
          )}
          {task === 5 && (
            <div className="lab-choice-pair">
              {(['none', 'client'] as const).map((group) => (
                <fieldset key={group} className="lab-choices">
                  <legend>{t.answers.q6[group]}</legend>
                  {maxOrders.map((n) => radio(`q6-${group}`, `q6-${group}-${n}`, interpolate(t.answers.q6.option, { count: content.number(n) })))}
                </fieldset>
              ))}
            </div>
          )}

          <p id="lab-feedback" className="lab-feedback" role="status" tabIndex={-1} data-verdict={verdict ? (verdict.ok ? 'ok' : 'not-yet') : undefined}>
            {prefix && <strong>{prefix}</strong>}
            {status}
          </p>
          {task === 2 && verdict?.code === 'answer' && <Q3Reveal content={content} answer={verdict.answer as Q3Answer} />}
          <Controls
            content={content}
            readOnly={readOnly}
            liveTask={live.task}
            canVerify={!verdict && canVerify(state)}
            checked={checked}
            hasNext={hasNext}
            canUndo={canUndo}
            canRestart={canRestart}
            hint={hint}
            onBack={() => setViewing(null)}
            onVerify={() => keepFocus(() => act('verify'))}
            onNext={next}
            onUndo={() => keepFocus(() => navigate(undoStep(location.events, state.taskStart)))}
            onReset={() => keepFocus(() => navigate(location.events.slice(0, state.taskStart), 'reset', true))}
            onRestart={() => keepFocus(() => navigate([], 'restart', true))}
          />
          {task === 1 && checked && <Worlds content={content} q1Trace={state.q1Trace} q2Trace={state.trace} />}
        </>
      )}

      {passedQuestion(live, 1) && <DryRun content={content} showClient={passedQuestion(live, 3)} showServer={passedQuestion(live, 4)} explainLate={passedQuestion(live, 2)} />}
      {passedQuestion(live, 5) && <FinalCriterion content={content} />}
    </section>
  )
}
