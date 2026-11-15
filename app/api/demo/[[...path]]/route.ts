import {demoRequest} from '@/lib/demo-api/handler';
export const dynamic='force-dynamic';
type Context={params:Promise<{path?:string[]}>};
async function handle(req:Request,context:Context){return demoRequest(req,(await context.params).path||[]);}
export {handle as GET,handle as HEAD,handle as POST,handle as PUT,handle as PATCH,handle as DELETE,handle as OPTIONS};
