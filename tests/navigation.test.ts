import test from 'node:test';
import assert from 'node:assert/strict';
import {footerGroups, learningLinks, primaryLinks, resourceLinks} from '../lib/navigation';
import {publicPaths} from '../lib/marketing/site';
import {learningModules} from '../lib/learning/modules';

test('shared footer uses four labelled groups with at most six existing destinations each', () => {
  assert.deepEqual(footerGroups.map(group => group.label), ['Compilers', 'Practice', 'Resources', 'Company']);
  for (const group of footerGroups) {
    assert.ok(group.links.length > 0 && group.links.length <= 6);
    assert.equal(new Set(group.links.map(link => link.href)).size, group.links.length);
    for (const link of group.links) assert.ok(publicPaths.includes(link.href), link.href);
  }
});
test('shared navigation preserves primary workspaces, learning labs and company destinations', () => {
  const links = [...primaryLinks, ...learningLinks, ...resourceLinks, ...footerGroups.flatMap(group => group.links)];
  const hrefs = new Set(links.map(link => link.href));
  for (const href of ['/tools', '/practice', '/studio', '/browser', '/extensions', '/downloads', '/interview-prep', '/play', '/demo-api', '/tools/portal-ready', '/privacy', '/security', '/contact', '/about', '/publishing']) assert.ok(hrefs.has(href), href);
  for (const module of learningModules) assert.ok(learningLinks.some(link => link.href === module.lab));
  assert.match(learningLinks.find(link => link.href === '/labs/nodejs')!.label, /experimental/);
});
