import { useEffect, useState } from 'react'
import { isIndexHidden, setIndexHidden } from '../app/indexToggle'
import type { Content } from '../i18n/content'

/**
 * The menu button at the start of the header: on wide screens it hides and shows the site index. It needs
 * JavaScript, so the prerendered page leaves it out; its slot keeps the site name from moving when it appears.
 */
export function IndexToggle({ content }: { content: Content }) {
  const { ui } = content
  // Null until scripts run; then whether the index is hidden.
  const [hidden, setHidden] = useState<boolean | null>(null)
  useEffect(() => setHidden(isIndexHidden()), [])
  // Read from the page, not from state, so the button always does what the reader sees it should.
  const toggle = () => {
    const next = !isIndexHidden()
    setIndexHidden(next)
    setHidden(next)
  }
  return (
    <span className="header-menu">
      {hidden !== null && (
        // An icon alone; the title shows its name on hover, the aria-label gives it to screen readers.
        <button
          type="button"
          className="index-toggle"
          aria-label={ui.index.label}
          title={ui.index.label}
          aria-controls="site-index"
          aria-expanded={!hidden}
          onClick={toggle}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
            <path d="M2 3.5h12M2 8h12M2 12.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  )
}
