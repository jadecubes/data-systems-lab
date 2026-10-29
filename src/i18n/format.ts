import type { RoleRatings } from '../content/types'
import type { Content } from './content'

/** Fills `{name}` placeholders; a missing value is a content bug, so it throws instead of showing `{name}`. */
export function interpolate(template: string, params: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (!Object.hasOwn(params, key)) throw new Error(`Missing {${key}} for "${template}"`)
    return params[key]
  })
}

/** "產品型 PM 要會用、平台型 PM 要會用": only the roles present, in a fixed order. */
export function formatRoleRatings(ratings: Partial<RoleRatings>, { ui }: Content): string {
  return (['product', 'platform'] as const)
    .filter((role) => ratings[role])
    .map((role) => interpolate(ui.roleRating, { role: ui.roles[role], rating: ui.ratings[ratings[role]!] }))
    .join(ui.roleSeparator)
}
