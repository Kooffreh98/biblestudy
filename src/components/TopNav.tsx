'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  BookOpen,
  Search,
  AlignLeft,
  GitCompare,
  Home,
  Menu,
  X,
  Heart,
  Highlighter,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Bible Reader', href: '/bible-reader', icon: BookOpen },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Concordance', href: '/concordance', icon: AlignLeft },
  { label: 'Compare', href: '/translation-comparison', icon: GitCompare },
  { label: 'Favorites', href: '/favorites', icon: Heart },
  { label: 'Highlights', href: '/highlights', icon: Highlighter },
];

export default function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-card border-b border-border shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <AppLogo size={36} />
            <span className="font-sans font-700 text-xl text-primary tracking-tight hidden sm:block">
              BibleStudy
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems?.map((item) => {
              const Icon = item?.icon;
              const isActive = pathname === item?.href;
              return (
                <Link
                  key={`nav-${item?.href}`}
                  href={item?.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/10 text-primary nav-link-active' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon size={15} />
                  {item?.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Quick search pill */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 border border-border"
            >
              <Search size={13} />
              <span>Quick search…</span>
              <span className="font-mono text-xs bg-border px-1.5 py-0.5 rounded">⌘K</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 w-72 h-full bg-card border-r border-border shadow-xl fade-in flex flex-col">
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <div className="flex items-center gap-2">
                <AppLogo size={32} />
                <span className="font-sans font-semibold text-lg text-primary">BibleStudy</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
              {navItems?.map((item) => {
                const Icon = item?.icon;
                const isActive = pathname === item?.href;
                return (
                  <Link
                    key={`mobile-nav-${item?.href}`}
                    href={item?.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon size={17} />
                    {item?.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 py-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Open & free — no account required
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}