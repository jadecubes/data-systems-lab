/** Fills `{name}` placeholders; a missing value is a content bug, so it throws instead of showing `{name}`. */
export function interpolate(template: string, params: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (!Object.hasOwn(params, key)) throw new Error(`Missing {${key}} for "${template}"`)
    return params[key]
  })
}
