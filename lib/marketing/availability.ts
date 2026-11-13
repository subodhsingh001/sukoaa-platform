// Publish a page here only after its execution or installation has been verified.
// This explicit release policy is independent of whether credentials happen to exist.
export const unavailableToolSlugs = ['c', 'cpp', 'rust', 'csharp', 'java'] as const;
export const unlistedPaths: readonly string[] = [
  ...unavailableToolSlugs.map(slug => '/tools/' + slug),
  '/extensions/quick-replies',
  '/extensions/web-pdf-studio',
];
export function isPubliclyReady(path: string) { return !unlistedPaths.includes(path); }
export function isUnavailableTool(slug: string) { return (unavailableToolSlugs as readonly string[]).includes(slug); }
