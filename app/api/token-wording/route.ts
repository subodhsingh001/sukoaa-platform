import {body, HttpError, json, route} from '@/lib/platform/http';
import {assertLocalWordingRequest, generateWording, validateWordingInput} from '@/lib/token-wording';

export const runtime = 'nodejs';
// Local development only: a shared per-process budget, no Redis or database required.
let active = false;
let windowStart = 0;
let attempts = 0;
export async function POST(req: Request) {
  return route(async () => {
    assertLocalWordingRequest(req);
    const text = validateWordingInput(await body(req, 40000));
    const key = process.env.GEMINI_API_KEY?.trim() || '';
    const model = process.env.GEMINI_WORDING_MODEL?.trim() || '';
    if (!key || !/^gemini-[a-z0-9.-]+$/.test(model)) throw new HttpError(503, 'Set GEMINI_API_KEY and GEMINI_WORDING_MODEL in .env.local, then restart the development server.');
    const now = Date.now();
    if (now - windowStart >= 3600000) {windowStart = now; attempts = 0;}
    if (active) throw new HttpError(429, 'A wording request is already running. Wait for it to finish.', 'LOCAL_LIMIT', 30);
    if (attempts >= 10) throw new HttpError(429, 'Local trial limit reached: 10 attempts per hour. Token counting still works.', 'LOCAL_LIMIT', Math.ceil((windowStart + 3600000 - now) / 1000));
    active = true;
    attempts++;
    try {return json(await generateWording(text, {key, model, signal: req.signal}));}
    finally {active = false;}
  });
}
