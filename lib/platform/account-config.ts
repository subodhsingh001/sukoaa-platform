import {configured} from './config';
import {redisConfigured} from './redis';
export {appOrigin} from './config';
import {appOrigin} from './config';
export function accountSetup(){
 const missing:string[]=[];
 if(!configured())missing.push('Supabase account connection');
 if(process.env.NODE_ENV==='production'&&!appOrigin())missing.push('Website origin');
 if(process.env.NODE_ENV==='production'&&!redisConfigured())missing.push('Redis protection');
 return {ready:missing.length===0,missing};
}
