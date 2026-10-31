import {isLanguage} from './config';import {HttpError,text} from './http';
export function projectInput(input:Record<string,unknown>){
 if(!isLanguage(input.language))throw new HttpError(400,'Unsupported project language.','VALIDATION_ERROR');
 const name=text(input.name,'Project name',100,1).trim();if(!name)throw new HttpError(400,'Project name cannot be empty.');
 return {name,language:input.language,source:text(input.source,'Source',50000),stdin:text(input.stdin??'','Standard input',5000)};
}
