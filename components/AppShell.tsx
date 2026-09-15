'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Boxes, FileArchive, Home, LibraryBig, Menu, Palette, Plus, Settings, Sparkles, Store, X } from 'lucide-react';
import { useState } from 'react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/books', label: 'My Books', icon: BookOpen },
  { href: '/library', label: 'Page Library', icon: LibraryBig },
  { href: '/templates', label: 'Templates', icon: Boxes },
  { href: '/exports', label: 'Exports', icon: FileArchive },
  { href: '/published', label: 'Published', icon: Store },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Palette size={22}/></div><div><strong>Coloring Book</strong><span>Studio</span></div></div>
      <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X/></button>
      <Link href="/books/new" className="new-book"><Plus size={18}/> New Book</Link>
      <nav>{nav.map(({href,label,icon:Icon}) => <Link key={href} href={href} onClick={() => setOpen(false)} className={pathname === href || pathname.startsWith(href + '/') ? 'active' : ''}><Icon size={19}/><span>{label}</span></Link>)}</nav>
      <div className="studio-tip"><Sparkles size={18}/><strong>Create something wonderful</strong><p>Your next coloring book starts with one idea.</p></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu/></button><div><span className="eyebrow">CREATIVE PUBLISHING WORKSPACE</span></div><div className="avatar">KS</div></header>
      <div className="page-wrap">{children}</div>
    </main>
    {open && <button className="scrim" onClick={() => setOpen(false)} aria-label="Close menu"/>}
  </div>;
}
