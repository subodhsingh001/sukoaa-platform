import {genPaths} from '../genai/catalog';
import {interviewPaths} from '../interview/catalog';

// Content revision dates, not build/crawl dates. Update only pages that changed.
const updates: Record<string, string> = Object.fromEntries([
  ['/pg-safe-migrate', '2026-11-25'],
  ...['/', '/about', '/privacy', '/publishing', '/downloads', '/tools',
    '/tools/token-counter', '/tools/json-studio', '/tools/text-compare',
    '/tools/portal-ready', '/tools/portal-ready/custom-photo', '/play/daily',
    ...genPaths.filter(path => path !== '/learn/gen-ai'),
    ...interviewPaths.filter(path => /^\/interview-prep\/(?:genai|frontend)\//.test(path))
  ].map(path => [path, '2026-11-24'])
]);

// Search Console-led presentation updates; lesson data and URLs are unchanged.
for (const path of ['/practice', '/practice/python', '/tools/pdf-organizer',
  '/learn/system-design/microservices', '/learn/system-design/zero-downtime-deployments',
  '/learn/system-design/rate-limiting']) updates[path] = '2026-11-28';

function validDate(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(value + 'T00:00:00.000Z');
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value ? value : undefined;
}

export function contentLastModified(path: string, fallback: string, override = process.env.SITE_LASTMOD, now = new Date()) {
  // An operator-supplied whole-site revision must not backdate a known page edit.
  let known = updates[path] || fallback;
  // dailyActivity() changes at midnight UTC. Other routes never use build time.
  if (path === '/play/daily') {
    const day = now.toISOString().slice(0, 10);
    if (day > known) known = day;
  }
  const configured = validDate(override);
  return new Date((configured && configured > known ? configured : known) + 'T00:00:00.000Z');
}
