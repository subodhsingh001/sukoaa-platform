import {learningModules} from './learning/modules';

export type SiteLink = {label: string; href: string};
export const primaryLinks: SiteLink[] = [
  {label: 'Tools', href: '/tools'},
  {label: 'Practice', href: '/practice'},
  {label: 'Project Studio', href: '/studio'},
];
export const learningLinks: SiteLink[] = [
  {label: 'System design tutorials', href: '/learn/system-design'},
  {label: 'Interview preparation', href: '/interview-prep'},
  {label: 'GenAI interview preparation', href: '/interview-prep/genai'},
  {label: 'Frontend interview preparation', href: '/interview-prep/frontend'},
  {label: 'Play & Learn', href: '/play'},
  {label: 'Daily coding challenge', href: '/play/daily'},
  ...learningModules.map(m => ({label: m.name + (m.id === 'nodejs' ? ' (experimental)' : ''), href: m.lab})),
];
export const resourceLinks: SiteLink[] = [
 {label:'File and data tools',href:'/tools/data-workbench'},
 {label:'CSV cleaner',href:'/tools/csv-cleaner'},
 {label:'PDF page organizer',href:'/tools/pdf-organizer'},
  {label: 'Demo API', href: '/demo-api'},
  {label: 'Photo & PDF tools', href: '/tools/portal-ready'},
  {label: 'Online notepad', href: '/tools/notepad'},
  {label: 'JSON to TypeScript', href: '/tools/json-to-typescript'},
  {label: 'Downloads', href: '/downloads'},
  {label: 'Browser', href: '/browser'},
  {label: 'Extensions', href: '/extensions'},
  {label: 'Installation guide', href: '/publishing'},
  {label: 'About', href: '/about'},
  {label: 'Contact', href: '/contact'},
  {label: 'Privacy', href: '/privacy'},
  {label: 'Security', href: '/security'},
];
export const footerGroups: {label: string; links: SiteLink[]}[] = [
  {label: 'Compilers', links: [
    {label: 'JavaScript', href: '/tools/javascript'},
    {label: 'Python', href: '/tools/python'},
    {label: 'TypeScript', href: '/tools/typescript'},
    {label: 'React', href: '/tools/react'},
    {label: 'PostgreSQL', href: '/labs/postgresql'},
    {label: 'All tools', href: '/tools'},
  ]},
  {label: 'Practice', links: [
    {label: 'Coding exercises', href: '/practice'},
    {label: 'Play & Learn', href: '/play'},
    {label: 'Daily challenge', href: '/play/daily'},
    {label: 'Interview preparation', href: '/interview-prep'},
    {label: 'JavaScript exercises', href: '/practice/javascript'},
    {label: 'Python exercises', href: '/practice/python'},
  ]},
  {label: 'Resources', links: [
    {label: 'Demo API', href: '/demo-api'},
    {label: 'Online notepad', href: '/tools/notepad'},
    {label: 'Photo & PDF tools', href: '/tools/portal-ready'},
    {label: 'Tool schema generator', href: '/tools/tool-schema-generator'},
    {label: 'Downloads', href: '/downloads'},
    {label: 'Installation guide', href: '/publishing'},
  ]},
  {label: 'Company', links: [
    {label: 'About', href: '/about'},
    {label: 'Contact', href: '/contact'},
    {label: 'Privacy', href: '/privacy'},
    {label: 'Security', href: '/security'},
    {label: 'Sukoaa Browser', href: '/browser'},
    {label: 'Extensions', href: '/extensions'},
  ]},
];
