import {json} from '@/lib/platform/http';
// No AI SDK, no provider requests, and no secret provisioning in this release.
export async function POST(){return json({error:'AI agents are disabled in this release.',code:'AI_DISABLED'},503)}
