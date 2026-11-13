type Props = {variant?: 'wordmark' | 'reverse' | 'mark' | 'icon' | 'tagline'; height?: number; className?: string; decorative?: boolean};
/** Display the approved original artwork through a viewport; do not redraw it. */
export function SukoaaLogo({variant='wordmark',height=34,className='',decorative=false}:Props){
 const compact=variant==='mark'||variant==='icon';
 const box=compact?'180 370 150 200':variant==='tagline'?'190 375 940 250':'190 375 940 190';
 const ratio=compact?150/200:variant==='tagline'?940/250:940/190;
 return <svg xmlns="http://www.w3.org/2000/svg" viewBox={box} role={decorative?undefined:'img'} aria-label={decorative?undefined:variant==='tagline'?'Sukoaa · Next Big Thing':'Sukoaa'} aria-hidden={decorative||undefined} className={'sukoaa-logo '+className} width={Math.round(height*ratio)} height={height} style={{height,width:Math.round(height*ratio),display:'inline-block',flexShrink:0,verticalAlign:'middle',overflow:'hidden'}}><image href="/brand/proposed-logo.png" width="1320" height="1000"/></svg>;
}
