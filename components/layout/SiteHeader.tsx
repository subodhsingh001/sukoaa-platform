'use client';

import {useEffect, useRef, type MouseEventHandler, type ReactNode} from 'react';
import {ChevronDown, Menu} from 'lucide-react';
import {AccountNav} from '@/components/AccountSession';
import {SukoaaLogo} from '@/components/SukoaaLogo';
import {CommandPalette} from '@/components/marketing/CommandPalette';
import {learningLinks, primaryLinks, resourceLinks, type SiteLink} from '@/lib/navigation';

type ContextLink = SiteLink & {onClick?: MouseEventHandler<HTMLAnchorElement>};
type Props = {
  variant?: 'document' | 'editor';
  className?: string;
  children?: ReactNode;
  contextLinks?: ContextLink[];
};

function LinkList({links}: {links: ContextLink[]}) {
  return <>{links.map(link => <a key={link.href} href={link.href} onClick={link.onClick}>{link.label}</a>)}</>;
}

export function SiteHeader({variant = 'document', className = '', children, contextLinks = []}: Props) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    function close(event: PointerEvent) {
      root.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(menu => {
        if (!menu.contains(event.target as Node)) menu.open = false;
      });
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      const active = document.activeElement;
      root.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(menu => {
        menu.open = false;
        if (active && menu.contains(active)) menu.querySelector('summary')?.focus();
      });
    }
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape);};
  }, []);
  return <header ref={root} className={`site-header site-header--${variant} ${className}`}>
    <a className="site-skip" href="#main-content">Skip to content</a>
    <a className="site-brand" href="/" aria-label="Sukoaa home"><SukoaaLogo height={42}/></a>
    <nav className="site-primary" aria-label="Primary navigation"><LinkList links={primaryLinks}/></nav>
    {contextLinks.length > 0 && <nav className="site-context" aria-label="Workspace navigation"><LinkList links={contextLinks}/></nav>}
    <div className="site-header-actions">
      <details className="site-menu site-learn"><summary>Learn <ChevronDown size={15} aria-hidden="true"/></summary><nav className="site-menu-panel" aria-label="Learning navigation"><LinkList links={learningLinks}/></nav></details>
      <details className="site-menu site-resources"><summary>Resources <ChevronDown size={15} aria-hidden="true"/></summary><nav className="site-menu-panel" aria-label="Resource navigation"><LinkList links={resourceLinks}/></nav></details>
      <CommandPalette/>
      {children && <div className="site-header-context">{children}</div>}
      <AccountNav/>
      <details className="site-menu site-mobile-menu"><summary aria-label="Open navigation"><Menu size={20} aria-hidden="true"/></summary><nav className="site-menu-panel" aria-label="Mobile navigation">
        <div className="site-menu-group"><span>Navigation</span><LinkList links={[...primaryLinks, ...contextLinks]}/></div>
        <div className="site-menu-group"><span>Learn</span><LinkList links={learningLinks}/></div>
        <div className="site-menu-group"><span>Resources</span><LinkList links={resourceLinks}/></div>
      </nav></details>
    </div>
  </header>;
}
