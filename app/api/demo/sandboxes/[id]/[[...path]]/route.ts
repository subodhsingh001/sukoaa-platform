import {sandboxRequest} from '@/lib/demo-api/sandboxes';
export const dynamic='force-dynamic';type Context={params:Promise<{id:string;path?:string[]}>};async function handle(r:Request,c:Context){const {id,path}=await c.params;return sandboxRequest(r,id,path||[]);}export {handle as GET,handle as POST,handle as PUT,handle as PATCH,handle as DELETE,handle as OPTIONS};
