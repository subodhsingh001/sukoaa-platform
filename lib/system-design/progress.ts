export type CourseProgress={version:1;completed:string[];notes:Record<string,string>};
export const emptyProgress=():CourseProgress=>({version:1,completed:[],notes:{}});
export function parseProgress(value:unknown,allowed:readonly string[]):CourseProgress {
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Choose a Sukoaa system-design progress backup.');
 const x=value as Partial<CourseProgress>;
 if(x.version!==1||!Array.isArray(x.completed)||x.completed.some(id=>typeof id!=='string')||!x.notes||typeof x.notes!=='object'||Array.isArray(x.notes))throw new Error('This progress file has an unsupported format.');
 const valid=new Set(allowed);const completed=[...new Set(x.completed)].filter(id=>valid.has(id));const notes:Record<string,string>=Object.create(null);
 for(const [id,note] of Object.entries(x.notes)){if(valid.has(id)){if(typeof note!=='string'||note.length>8000)throw new Error('Each lesson note must be text under 8,000 characters.');notes[id]=note;}}
 return {version:1,completed,notes};
}
export function mergeProgress(local:CourseProgress,incoming:CourseProgress):CourseProgress {
 const notes={...incoming.notes};for(const [id,note] of Object.entries(local.notes))if(note.trim())notes[id]=note;
 return {version:1,completed:[...new Set([...local.completed,...incoming.completed])],notes};
}
