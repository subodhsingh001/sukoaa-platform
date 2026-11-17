import {ImageResponse} from 'next/og';
export const dynamic='force-dynamic';
const clean=(v:string|null,max:number)=>(v||'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,max);
export async function GET(req:Request){
 const q=new URL(req.url).searchParams,title=clean(q.get('title'),90)||'Sukoaa',path=clean(q.get('path'),80);
 const group=path.startsWith('/labs/')?'ONLINE COMPILER':path.startsWith('/tools/')?'FREE ONLINE TOOL':path.startsWith('/play')?'PLAY & LEARN':path.startsWith('/practice')?'CODING PRACTICE':path.startsWith('/demo-api')?'FREE DEMO API':'SUKOAA';
 return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'64px 72px',background:'linear-gradient(135deg,#16241d 0%,#20362c 100%)',color:'#e6efe0'}}>
  <div style={{display:'flex',alignItems:'center',gap:16}}><div style={{width:48,height:48,borderRadius:12,background:'#d8eea2',color:'#17301f',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:800}}>S</div><div style={{fontSize:30,fontWeight:700}}>Sukoaa</div></div>
  <div style={{display:'flex',flexDirection:'column',gap:20}}><div style={{fontSize:24,letterSpacing:4,color:'#d8eea2',fontWeight:700}}>{group}</div><div style={{fontSize:title.length>55?58:70,fontWeight:800,lineHeight:1.12,letterSpacing:-1}}>{title}</div></div>
  <div style={{display:'flex',justifyContent:'space-between',fontSize:26,color:'#a3b8aa'}}><div>Run it in your browser. No install.</div><div>sukoaa.com</div></div>
 </div>,{width:1200,height:630,headers:{'Cache-Control':'public, max-age=86400, s-maxage=604800'}});
}
