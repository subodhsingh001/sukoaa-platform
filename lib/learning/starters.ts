import files from './starters.json';
import {findModule,type Technology} from './modules';
export const starterFiles=files as Record<Technology,Record<string,string>>;
export function getStarter(id:string){if(!findModule(id)||!Object.hasOwn(starterFiles,id))return undefined;return starterFiles[id as Technology];}
