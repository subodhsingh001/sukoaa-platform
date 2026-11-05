export const AI_ENABLED = false; // Deliberately disabled. No provider SDK or secret is used.
export const configured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
export function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured');
  if (!url.startsWith('https://') && process.env.NODE_ENV === 'production') throw new Error('Supabase HTTPS required');
  return { url, key };
}
export const languages = ['javascript','typescript','html','react','python','sql','json','go','nextjs'] as const;
export type Language = typeof languages[number];
export type Project = {id:string; name:string; language:Language; source:string; stdin:string; updated_at:string};
export const isLanguage=(x:unknown):x is Language=>typeof x==='string'&&(languages as readonly string[]).includes(x);

export function appOrigin():string|undefined{
 const raw=process.env.APP_ORIGIN?.trim();if(!raw)return;
 try{const url=new URL(raw);if(url.username||url.password||url.search||url.hash||!['','/'].includes(url.pathname))return;if(url.protocol!=='https:'&&(process.env.NODE_ENV==='production'||url.protocol!=='http:'))return;return url.origin}catch{return}
}
