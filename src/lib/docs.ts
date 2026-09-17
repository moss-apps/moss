import codeOfConductRaw from "../../CODE_OF_CONDUCT.md?raw"
import contributingRaw from "../../CONTRIBUTING.md?raw"
import licenseRaw from "../../LICENSE?raw"
import privacyRaw from "../../PRIVACY.md?raw"
import readmeRaw from "../../README.md?raw"
import securityRaw from "../../SECURITY.md?raw"
import termsRaw from "../../TERMS.md?raw"

export type DocSlug =
  | "readme"
  | "contributing"
  | "code-of-conduct"
  | "security"
  | "privacy"
  | "terms"
  | "license"

export interface Doc {
  slug: DocSlug
  label: string
  raw: string
}

export const DOCS: Doc[] = [
  { slug: "readme", label: "Readme", raw: readmeRaw },
  { slug: "contributing", label: "Contributing", raw: contributingRaw },
  { slug: "code-of-conduct", label: "Code of Conduct", raw: codeOfConductRaw },
  { slug: "security", label: "Security", raw: securityRaw },
  { slug: "privacy", label: "Privacy", raw: privacyRaw },
  { slug: "terms", label: "Terms", raw: termsRaw },
  { slug: "license", label: "License", raw: licenseRaw },
]

const FILE_TO_SLUG: Record<string, DocSlug> = {
  readme: "readme",
  contributing: "contributing",
  code_of_conduct: "code-of-conduct",
  codeofconduct: "code-of-conduct",
  security: "security",
  privacy: "privacy",
  terms: "terms",
  license: "license",
}

export function resolveInternal(href: string): DocSlug | null {
  const match = href.match(/^[./\s]*([A-Za-z0-9_-]+?)(?:\.md)?$/)
  if (!match) return null
  const key = match[1].toLowerCase().replace(/-/g, "_")
  return FILE_TO_SLUG[key] ?? null
}
