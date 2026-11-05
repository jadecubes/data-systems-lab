import { useEffect, useState } from 'react'
import { HISTORY_LIMIT, labHref, readLabLocation, replay, type LabEvent } from '../../lessons/retryWorkshop'

export type Notice = 'reset' | 'restart' | 'limit' | 'crux' | null

/**
 * The lab's state is its URL. The prerendered page and the first client render know no URL, so both start empty;
 * the URL is read once mounted, which is also when the lab's controls appear (they need JavaScript).
 */
export function useLabHistory() {
  const [location, setLocation] = useState<{ events: LabEvent[]; invalid: boolean }>({ events: [], invalid: false })
  const [mounted, setMounted] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const [viewing, setViewing] = useState<number | null>(null)

  useEffect(() => {
    const restore = () => {
      setLocation(readLabLocation(window.location.href))
      setNotice(null)
      setViewing(null)
    }
    restore()
    setMounted(true)
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])

  function navigate(events: LabEvent[], next: Notice = null) {
    window.history.pushState(null, '', `${window.location.pathname}${labHref(events)}`)
    setLocation({ events, invalid: false })
    setNotice(next)
    setViewing(null)
  }

  function act(event: LabEvent, next: Notice = null) {
    const events = [...location.events, event]
    if (events.length > HISTORY_LIMIT) return setNotice('limit')
    replay(events)
    navigate(events, next)
  }

  // Looking at another question leaves behind any notice about this one.
  const view = (index: number | null) => {
    setViewing(index)
    setNotice(null)
  }

  return { location, mounted, notice, viewing, setViewing: view, navigate, act }
}

export type LabHistory = ReturnType<typeof useLabHistory>
