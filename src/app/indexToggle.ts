/**
 * Whether the reader hid the site index on wide screens. The choice lives on `<html data-index="hidden">`,
 * which the script in `index.html` sets from storage before the page paints, so the index does not flash
 * in and out on every page.
 */
export const INDEX_KEY = 'data-systems-lab.index'

export function isIndexHidden(): boolean {
  return document.documentElement.dataset.index === 'hidden'
}

export function setIndexHidden(hidden: boolean): void {
  if (hidden) document.documentElement.dataset.index = 'hidden'
  else delete document.documentElement.dataset.index
  // Storage can throw (private windows, blocked site data); then the choice lasts for this page only.
  try {
    if (hidden) localStorage.setItem(INDEX_KEY, 'hidden')
    else localStorage.removeItem(INDEX_KEY)
  } catch {
    // Nothing to do.
  }
}

/**
 * On wide screens the index column scrolls on its own, and a topic late in a long index sits below its fold: bring the
 * current topic a third of the way down, when the page loads and when a hidden index is shown again. A topic already
 * in view, or a column that does not scroll (phones fold the index; a hidden one measures nothing), stays as it is.
 */
export function revealCurrent(): void {
  const column = document.querySelector<HTMLElement>('.index-column')
  const here = column?.querySelector<HTMLElement>('[aria-current="page"]')
  if (column && here && here.offsetTop + here.offsetHeight > column.scrollTop + column.clientHeight) column.scrollTop = here.offsetTop - column.clientHeight / 3
}
