import raw from './lessons.json';
import type {GenLesson} from './types';
export const genLessons=raw as GenLesson[];
export const genSummaries=genLessons.map(({id,title,simple,order,group,minutes})=>({id,title,simple,order,group,minutes}));
export const genHref=(id:string)=>'/learn/gen-ai/'+id;
export const genPaths=['/learn/gen-ai',...genLessons.map(l=>genHref(l.id))];
