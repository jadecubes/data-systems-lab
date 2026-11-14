import { Fragment, useId } from 'react'
import { ORDER_AMOUNT, screenLies, type Run, type Version } from '../../lessons/retryWorkshop'
import type { Content } from '../../i18n/content'
import { interpolate } from '../../i18n/format'

/** What the user sees: the PM's view of the run, so it comes first. */
export function Phone({ content, run }: { content: Content; run: Run }) {
  const t = content.labs.d1
  const text = run.browser === 'idle' ? t.phone.idle : run.claim === 'none' ? t.phone.waiting : t.claims[run.claim]
  const id = useId()
  return (
    <figure className="lab-phone" aria-labelledby={id}>
      <figcaption id={id}>{t.phone.label}</figcaption>
      <p className="phone-screen" data-claim={run.browser === 'idle' ? 'idle' : run.claim}>
        {text}
      </p>
    </figure>
  )
}

/** The request and the SQL of this question's version, sliced from examples/order_retry.sql, with notes beside lines. */
export function CodePanel({ content, version, active }: { content: Content; version: Version; active: 'api' | 'sql' | null }) {
  const t = content.labs.d1.code
  const sql = content.code.d1.versions[version]
  const heading = interpolate(t.heading, { version: t.versions[version] })
  return (
    <section className="lab-code" aria-label={heading}>
      <h4>{heading}</h4>
      <p className="code-label">{t.api}</p>
      <pre className="code-api" data-active={active === 'api' ? '' : undefined}>
        <code>{sql.api}</code>
      </pre>
      <p className="code-label">{t.sql}</p>
      <div className="code-listing" role="group" aria-label={t.sql} tabIndex={0} data-active={active === 'sql' ? '' : undefined}>
        {sql.lines.map((line, i) => (
          <Fragment key={i}>
            <code>{line}</code>
            <span className="code-note">{t.notes.find(({ match }) => line.includes(match))?.note}</span>
          </Fragment>
        ))}
      </div>
    </section>
  )
}

/** The database the roles share, and the rule checked against it. */
export function Database({ content, version, run }: { content: Content; version: Version; run: Run }) {
  const { shared, rule } = content.labs.d1
  const order = (id: number) => interpolate(shared.order, { order: content.number(id) })
  const duplicate = run.orders.length > 1
  const screen = run.claim === 'none' ? 'none' : screenLies(run) ? 'lie' : 'true'
  return (
    <section className="lab-database" aria-labelledby="database-title">
      <h4 id="database-title">{shared.heading}</h4>
      <table>
        <caption>{shared.orders}</caption>
        <thead>
          <tr>
            <th scope="col">{shared.orderId}</th>
            <th scope="col">{shared.amount}</th>
          </tr>
        </thead>
        <tbody>
          {run.orders.length ? (
            run.orders.map((id) => (
              <tr key={id} className={id > 1 ? 'row-bad' : undefined}>
                <td>{order(id)}</td>
                <td>{content.money(ORDER_AMOUNT)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>{shared.noOrders}</td>
            </tr>
          )}
        </tbody>
      </table>
      {version !== 'none' && (
        <table>
          <caption>{shared.requests}</caption>
          <thead>
            <tr>
              <th scope="col">{shared.requestId}</th>
              <th scope="col">{shared.orderId}</th>
            </tr>
          </thead>
          <tbody>
            {run.requests.length ? (
              run.requests.map((r, i) => (
                <tr key={i} className={r.blocked ? 'row-bad' : undefined}>
                  <td>
                    <code>{content.code.d1.ids[r.requestId]}</code>
                  </td>
                  <td>{r.blocked ? shared.blocked : order(r.orderId)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>{shared.noRequests}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <div className="lab-rule" role="group" aria-labelledby="rule-title">
        <h5 id="rule-title">{rule.heading}</h5>
        <p>
          {interpolate(rule.orders, { count: content.number(run.orders.length) })}{' '}
          <strong className={duplicate ? 'verdict-bad' : 'verdict-ok'}>{duplicate ? rule.ordersBad : rule.ordersOk}</strong>
        </p>
        <p>
          {rule.screen}
          <strong className={screen === 'lie' ? 'verdict-bad' : screen === 'true' ? 'verdict-ok' : undefined}>
            {screen === 'lie' ? rule.screenLie : screen === 'true' ? rule.screenTrue : rule.screenNone}
          </strong>
        </p>
      </div>
    </section>
  )
}
