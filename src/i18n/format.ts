import type { PageRange, RoleRatings } from '../content/types'
import type { Content } from './content'

/** Fills `{name}` placeholders; a missing value is a content bug, so it throws instead of showing `{name}`. */
export function interpolate(template: string, params: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (!Object.hasOwn(params, key)) throw new Error(`Missing {${key}} for "${template}"`)
    return params[key]
  })
}

export function formatPages(pages: readonly PageRange[], { ui, number }: Content): string {
  return pages
    .map(([from, to]) =>
      from === to ? interpolate(ui.pageSingle, { page: number(from) }) : interpolate(ui.pageRange, { from: number(from), to: number(to) }),
    )
    .join(ui.listSeparator)
}

/** Text cites PDF pages as `{p:372}` or `{p:371-372}`, like the notes; readers see printed pages (PDF − 24). */
export function expandPageRefs(text: string, { ui, number }: Content): string {
  const printed = (pdf: string) => number(Number(pdf) - 24)
  return text.replace(/\{p:(\d+)(?:-(\d+))?\}/g, (_, from: string, to?: string) =>
    to ? interpolate(ui.pageRefRange, { from: printed(from), to: printed(to) }) : interpolate(ui.pageRef, { page: printed(from) }),
  )
}

/** "產品型 PM 要會用、平台型 PM 要會用": only the roles present, in a fixed order. */
export function formatRoleRatings(ratings: Partial<RoleRatings>, { ui }: Content): string {
  return (['product', 'platform'] as const)
    .filter((role) => ratings[role])
    .map((role) => interpolate(ui.roleRating, { role: ui.roles[role], rating: ui.ratings[ratings[role]!] }))
    .join(ui.roleSeparator)
}
