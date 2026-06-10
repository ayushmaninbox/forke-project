import { execSync } from 'child_process'

/**
 * Changelog sourced directly from git history.
 *
 * The marketing changelog page renders whatever has actually been merged —
 * no hand-written entries. Commits are expected to loosely follow
 * conventional-commit subjects (`feat: …`, `fix: …`, `style: …`); anything
 * that doesn't match still shows up, tagged as a generic update.
 *
 * On hosts without a .git directory (e.g. some container builds) this
 * degrades gracefully to an empty list and the page shows a fallback note.
 */

export type ChangeKind =
  | 'feature'
  | 'fix'
  | 'polish'
  | 'refactor'
  | 'perf'
  | 'docs'
  | 'chore'
  | 'update'

export interface ChangelogEntry {
  shortHash: string
  author: string
  date: string
  kind: ChangeKind
  scope: string | null
  title: string
}

export interface ChangelogDay {
  date: string
  label: string
  entries: ChangelogEntry[]
}

const KIND_MAP: Record<string, ChangeKind> = {
  feat: 'feature',
  feature: 'feature',
  fix: 'fix',
  hotfix: 'fix',
  bugfix: 'fix',
  style: 'polish',
  polish: 'polish',
  ui: 'polish',
  refactor: 'refactor',
  perf: 'perf',
  docs: 'docs',
  doc: 'docs',
  chore: 'chore',
  build: 'chore',
  ci: 'chore',
  test: 'chore',
}

const SUBJECT_RE = /^([a-zA-Z]+)(?:\(([^)]*)\))?!?:\s*(.+)$/

function parseSubject(subject: string): { kind: ChangeKind; scope: string | null; title: string } {
  const m = subject.match(SUBJECT_RE)
  if (m && KIND_MAP[m[1].toLowerCase()]) {
    const title = m[3].trim()
    return {
      kind: KIND_MAP[m[1].toLowerCase()],
      scope: m[2]?.trim() || null,
      title: title.charAt(0).toUpperCase() + title.slice(1),
    }
  }
  const title = subject.trim()
  return { kind: 'update', scope: null, title: title.charAt(0).toUpperCase() + title.slice(1) }
}

function dayLabel(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toLowerCase()
}

export function getChangelog(limit = 300): ChangelogDay[] {
  let raw: string
  try {
    raw = execSync(`git log --no-merges -n ${limit} --pretty=format:%h%x1f%an%x1f%aI%x1f%s`, {
      cwd: process.cwd(),
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    })
  } catch {
    return []
  }

  const days = new Map<string, ChangelogDay>()

  for (const line of raw.split('\n')) {
    const [shortHash, author, isoDate, subject] = line.split('\x1f')
    if (!shortHash || !isoDate || !subject) continue

    const date = isoDate.slice(0, 10)
    const { kind, scope, title } = parseSubject(subject)

    let day = days.get(date)
    if (!day) {
      day = { date, label: dayLabel(date), entries: [] }
      days.set(date, day)
    }
    day.entries.push({ shortHash, author, date: isoDate, kind, scope, title })
  }

  // git log already emits newest-first; Map preserves insertion order.
  return Array.from(days.values())
}

export function getCommitCount(): number | null {
  try {
    return parseInt(
      execSync('git rev-list --count HEAD', { cwd: process.cwd(), encoding: 'utf8' }).trim(),
      10
    )
  } catch {
    return null
  }
}
