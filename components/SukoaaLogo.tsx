type Props = {variant?: 'wordmark' | 'reverse' | 'mark' | 'icon'; height?: number; className?: string; decorative?: boolean};
/** Local vector branding. Keep public/brand and its font license together. */
export function SukoaaLogo({variant = 'wordmark', height = 34, className = '', decorative = false}: Props) {
 const file = variant === 'icon' ? 'sukoaa-app-icon.svg' : variant === 'mark' ? 'sukoaa-mark.svg' : variant === 'reverse' ? 'sukoaa-wordmark-reverse.svg' : 'sukoaa-wordmark.svg';
 return <img className={'sukoaa-logo ' + className} src={'/brand/' + file} alt={decorative ? '' : 'Sukoaa'} width={variant === 'mark' || variant === 'icon' ? height : Math.round(height * 566 / 128)} height={height} style={{height, width:'auto', display:'inline-block', flexShrink:0, verticalAlign:'middle'}} />;
}
