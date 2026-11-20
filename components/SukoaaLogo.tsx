type Props = {variant?: 'wordmark' | 'reverse' | 'mark' | 'icon' | 'tagline'; height?: number; className?: string; decorative?: boolean};

/** Viewports display the transparent artwork; the compact lockup omits its small date line. */
export function SukoaaLogo({variant='wordmark',height=42,className='',decorative=false}:Props){
 const compact=variant==='mark'||variant==='icon';
 const full=variant==='tagline';
 const ratio=compact?1:full?1150/350:190/42;
 const width=Math.round(height*ratio);
 const image=<image href="/brand/logo-transparent-v1.png" width="1536" height="1024"/>;
 return <svg xmlns="http://www.w3.org/2000/svg" viewBox={compact?'200 320 330 330':full?'194 310 1150 350':'0 0 190 42'} role={decorative?undefined:'img'} aria-label={decorative?undefined:full?'Sukoaa · Since 2026':'Sukoaa'} aria-hidden={decorative||undefined} className={'sukoaa-logo '+className} width={width} height={height} style={{height,width,display:'inline-block',flexShrink:0,verticalAlign:'middle',overflow:'hidden',background:'transparent',borderRadius:4}}>
  {compact||full?image:<><svg x="0" y="0" width="42" height="42" viewBox="200 320 330 330">{image}</svg><svg x="51" y="10" width="139" height="22" viewBox="560 390 775 125">{image}</svg></>}
 </svg>;
}
