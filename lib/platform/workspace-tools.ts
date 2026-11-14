import {toolLinks} from '../tool-order';
import {isLanguage} from './config';
import {templates} from './templates';
export function workspaceTool(value:unknown){
 const tool=toolLinks.find(item=>item.id===value);
 if(!tool)return null;
 if(['react','nextjs','angular','react-native'].includes(tool.id))return {kind:'project' as const,href:tool.href};
 if(!isLanguage(tool.id)||!Object.hasOwn(templates,tool.id))return null;
 return {kind:'snippet' as const,language:tool.id,template:templates[tool.id]};
}
