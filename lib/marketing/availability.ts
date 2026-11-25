import {browserReleaseUrl} from './browser-release';
// Publish a page here only after its execution or installation has been verified.
// This explicit release policy is independent of whether credentials happen to exist.
export const unavailableToolSlugs = ['c', 'cpp', 'rust', 'csharp', 'java'] as const;
export const unlistedPaths: readonly string[] = [
  '/play/progress',
  '/labs/nodejs',
  ...unavailableToolSlugs.map(slug => '/tools/' + slug),
  '/extensions/quick-replies',
  '/extensions/web-pdf-studio',
];
// /browser is a placeholder until a release is published. Set BROWSER_RELEASE_URL (a GitHub release page)
// to make it indexable and to list it in the sitemap again.
export function isPubliclyReady(path: string) {
  if (path === '/browser') return !!browserReleaseUrl();
  return !unlistedPaths.includes(path);
}
export function isUnavailableTool(slug: string) { return (unavailableToolSlugs as readonly string[]).includes(slug); }
