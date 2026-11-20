'use client';
import {useEffect, useRef} from 'react';
import {ChevronUp} from 'lucide-react';
import {footerGroups} from '@/lib/navigation';
import {SukoaaLogo} from '@/components/SukoaaLogo';

function FooterLinks() {
  return <div className="site-footer-columns">{footerGroups.map(group => <nav key={group.label} aria-label={`${group.label} footer links`}><h2>{group.label}</h2>{group.links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>)}</div>;
}
export function SiteFooter({compact = false}: {compact?: boolean}) {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (!compact) return;
    function close(event: PointerEvent) {if (menu.current && !menu.current.contains(event.target as Node)) menu.current.open = false;}
    function escape(event: KeyboardEvent) {if (event.key === 'Escape' && menu.current?.open) {menu.current.open = false; menu.current.querySelector('summary')?.focus();}}
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', escape);
    return () => {document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape);};
  }, [compact]);
  if (compact) return <footer className="site-footer-compact"><details ref={menu}><summary>Site links <ChevronUp size={14} aria-hidden="true"/></summary><div className="site-footer-popover"><FooterLinks/><p>© {new Date().getFullYear()} Sukoaa</p></div></details></footer>;
  return <footer className="site-footer"><div className="site-footer-inner"><div className="site-footer-brand"><a href="/" aria-label="Sukoaa home"><SukoaaLogo height={38}/></a><p>Free browser-based coding tools.</p></div><FooterLinks/><p className="site-copyright">© {new Date().getFullYear()} Sukoaa</p></div></footer>;
}
