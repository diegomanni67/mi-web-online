import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name)
  if (entry.name === 'node_modules' || entry.name === '.next') return []
  return entry.isDirectory() ? walk(full) : [full]
})
const files = walk(root).filter((file) => /\.(ts|tsx|js|jsx|mjs)$/.test(file) && !file.endsWith(`${path.sep}scripts${path.sep}release-check.mjs`))
const pages = walk(path.join(root, 'app')).filter((file) => file.endsWith(`${path.sep}page.tsx`))
const apiRoutes = walk(path.join(root, 'app', 'api')).filter((file) => file.endsWith(`${path.sep}route.ts`))

const routeFrom = (file, suffix) => {
  let rel = path.relative(path.join(root, 'app'), file).replaceAll(path.sep, '/')
  rel = rel.slice(0, -suffix.length).replace(/\/$/, '')
  return '/' + rel
}
const pageRoutes = new Set(pages.map((file) => routeFrom(file, '/page.tsx')).map((r) => r === '/' ? '/' : r))
const apiPaths = new Set(apiRoutes.map((file) => routeFrom(file, '/route.ts')))

function matchesRoute(candidate, routes) {
  const clean = candidate.split('?')[0].split('#')[0] || '/'
  for (const route of routes) {
    const pattern = '^' + route
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\[\.\.\.([^\]]+)\\\]/g, '.+')
      .replace(/\\\[([^\]]+)\\\]/g, '[^/]+') + '$'
    if (new RegExp(pattern).test(clean)) return true
  }
  return false
}

const missingPages = []
const missingApis = []
const stale = []
const stalePatterns = [/USD 80/i, /\$19\b/, /\$49\b/, /Usuario Invitado/i, /Sarah Mitchell/i, /James Chen/i, /mockStudents/i, /versi[oó]n local abierta/i, /profesores nativos/i, /certificados oficiales/i, /soporte 24\/7/i]

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8')
  for (const match of text.matchAll(/href\s*=\s*["'](\/[^"]*?)["']/g)) {
    const href = match[1]
    if (href.startsWith('/#')) continue
    if (!matchesRoute(href, pageRoutes)) missingPages.push(`${path.relative(root,file)} -> ${href}`)
  }
  for (const match of text.matchAll(/fetch\(\s*["'`](\/api\/[A-Za-z0-9_\-/\[\].${}]+)["'`]/g)) {
    const raw = match[1].replace(/\$\{[^}]+\}/g, '123')
    if (!matchesRoute(raw, apiPaths)) missingApis.push(`${path.relative(root,file)} -> ${match[1]}`)
  }
  for (const pattern of stalePatterns) if (pattern.test(text)) stale.push(`${path.relative(root,file)} -> ${pattern}`)
}

const failures = [...new Set(missingPages), ...new Set(missingApis), ...new Set(stale)]
console.log(`Pages discovered: ${pageRoutes.size}`)
console.log(`API routes discovered: ${apiPaths.size}`)
if (failures.length) {
  console.error('\nRelease check FAILED:')
  failures.forEach((item) => console.error(`- ${item}`))
  process.exit(1)
}
console.log('Release check PASS: internal routes, API references and stale demo markers look clean.')
