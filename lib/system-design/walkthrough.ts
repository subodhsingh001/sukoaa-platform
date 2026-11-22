import type {Lesson} from './types';
/** An unavailable node cannot carry a live request path in the teaching diagram. */
export function activePaths(lesson:Lesson,index:number){
 const step=lesson.flow.steps[index];
 if(!step)return [];
 const failed=new Set(step.failed||[]);
 return step.edges.filter(i=>{const edge=lesson.flow.edges[i];return !!edge&&!failed.has(edge[0])&&!failed.has(edge[1])});
}
