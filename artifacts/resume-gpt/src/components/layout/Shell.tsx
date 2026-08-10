import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, FileText, Sparkles, Target, Briefcase,
  FileCode2, LineChart, Settings, Sun, Moon, Workflow, Monitor,
  Check, ChevronRight, Zap, X, Menu, Search, Bell,
  Home, FolderOpen, BookOpen, Award, Globe, Cpu,
  Users, BarChart3, Layers, GraduationCap, PanelLeftClose,
  PanelLeftOpen, Command, Keyboard, HelpCircle, LogOut,
  UserCircle, ChevronDown, Gauge, WandSparkles, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AppProvider } from '@/store';
import {
  getThemeMode, setThemeMode, subscribeToThemeChanges, type ThemeMode,
} from '@/lib/theme';
import { useClerk, useUser } from '@clerk/react';

/* ═══════════════════════════════════════════════════════════════════════
   NAV STRUCTURE
═══════════════════════════════════════════════════════════════════════ */
type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeType?: 'ai' | 'new' | 'beta';
  section?: string;
};

const navSections: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'Workspace',
    items: [
      { title: 'Home',           href: '/dashboard',    icon: LayoutDashboard },
      { title: 'Resume Studio',  href: '/resume',       icon: WandSparkles,   badge: 'AI', badgeType: 'ai' },
      { title: 'Create Resume',  href: '/create',       icon: Workflow,       badge: 'AI', badgeType: 'ai' },
      { title: 'Analyze Job',    href: '/analyzer',     icon: Sparkles,       badge: 'New', badgeType: 'new' },
      { title: 'Job Match',      href: '/match',        icon: Target },
    ],
  },
  {
    label: 'Tools',
    items: [
      { title: 'Cover Letter',   href: '/cover-letter', icon: FileCode2 },
      { title: 'Portfolio',      href: '/portfolio',    icon: Globe, badge: 'New', badgeType: 'new' },
      { title: 'Interview Coach',href: '/interview',    icon: Briefcase },
      { title: 'Analytics',      href: '/analytics',    icon: BarChart3 },
    ],
  },
  {
    label: 'Account',
    items: [
      { title: 'Settings',       href: '/settings',     icon: Settings },
    ],
  },
  {
    label: 'System',
    items: [
      { title: 'Admin',          href: '/admin',        icon: ShieldCheck },
    ],
  },
];

/* Flat list for command palette */
const allNavItems: NavItem[] = navSections.flatMap(s => s.items);

/* ═══════════════════════════════════════════════════════════════════════
   COMMAND PALETTE
═══════════════════════════════════════════════════════════════════════ */
const commandItems = [
  { label: 'Create Resume', href: '/create', icon: Workflow, category: 'Pages' },
  { label: 'Analyze Job',   href: '/analyzer', icon: Sparkles, category: 'Pages' },
  { label: 'Job Match',     href: '/match', icon: Target, category: 'Pages' },
  { label: 'Resume Studio', href: '/resume', icon: WandSparkles, category: 'Pages' },
  { label: 'Cover Letter',  href: '/cover-letter', icon: FileCode2, category: 'Pages' },
  { label: 'Portfolio',     href: '/portfolio',    icon: Globe, category: 'Pages' },
  { label: 'Interview Coach', href: '/interview', icon: Briefcase, category: 'Pages' },
  { label: 'Analytics',     href: '/analytics', icon: BarChart3, category: 'Pages' },
  { label: 'Settings',      href: '/settings', icon: Settings, category: 'System' },
  { label: 'Admin',         href: '/admin', icon: ShieldCheck, category: 'System' },
  { label: 'Dashboard',     href: '/dashboard', icon: LayoutDashboard, category: 'Pages' },
];

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commandItems.filter(
    item =>
      query === '' ||
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const navigate = (href: string) => {
    setLocation(href);
    onClose();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      navigate(filtered[selected].href);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      <div className="command-backdrop" onClick={onClose} />
      <div
        className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4"
        aria-modal="true"
        role="dialog"
        aria-label="Command palette"
      >
        <div className="command-panel w-full max-w-[560px] overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Search commands and pages…"
              className={cn(
                'flex-1 bg-transparent text-sm text-foreground',
                'placeholder:text-muted-foreground outline-none',
              )}
            />
            <kbd className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[320px] overflow-y-auto py-1.5">
            {filtered.length === 0 ? (
              <div className="empty-state py-8">
                <p className="text-sm text-muted-foreground">No commands found for &ldquo;{query}&rdquo;</p>
              </div>
            ) : (
              <>
                {filtered.map((item, i) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    onMouseEnter={() => setSelected(i)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-sm text-left',
                      'transition-colors duration-100',
                      selected === i
                        ? 'bg-primary/8 text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-lg shrink-0',
                      selected === i ? 'bg-primary/12 text-primary' : 'bg-muted text-muted-foreground',
                    )}>
                      <item.icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex-1 font-medium">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground">{item.category}</span>
                    {selected === i && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><kbd className="font-mono border border-border rounded px-1 py-0.5">↑↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="font-mono border border-border rounded px-1 py-0.5">↵</kbd> open</span>
            <span className="flex items-center gap-1"><kbd className="font-mono border border-border rounded px-1 py-0.5">ESC</kbd> close</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════════════════════════════════════ */
function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeToThemeChanges(setTheme), []);
  useEffect(() => setTheme(getThemeMode()), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const icon =
    theme === 'dark' ? <Sun className="h-4 w-4" /> :
    theme === 'light' ? <Moon className="h-4 w-4" /> :
    <Monitor className="h-4 w-4" />;

  const choose = (mode: ThemeMode) => {
    setThemeMode(mode);
    setTheme(mode);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost" size="icon"
        aria-label={`Theme: ${theme}`}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className={cn(
          'text-muted-foreground hover:text-foreground rounded-lg',
          'hover:bg-muted/60 transition-colors',
          compact && 'h-8 w-8',
        )}
      >
        {icon}
      </Button>

      {open && (
        <div className={cn(
          'absolute z-50 min-w-[140px] rounded-xl border border-border',
          'bg-popover/95 backdrop-blur-xl p-1.5 shadow-xl',
          'animate-scale-in',
          compact ? 'bottom-10 left-0' : 'bottom-12 right-0',
        )}>
          {([
            ['system', <Monitor className="h-3.5 w-3.5" />, 'System'],
            ['light',  <Sun    className="h-3.5 w-3.5" />, 'Light'],
            ['dark',   <Moon   className="h-3.5 w-3.5" />, 'Dark'],
          ] as [ThemeMode, React.ReactNode, string][]).map(([mode, modeIcon, label]) => (
            <button
              key={mode} type="button"
              onClick={() => choose(mode)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm',
                'transition-colors hover:bg-muted/70',
                theme === mode && 'text-primary bg-primary/8 font-medium',
              )}
            >
              {modeIcon} {label}
              {theme === mode && <Check className="ml-auto h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   NAV ITEM
═══════════════════════════════════════════════════════════════════════ */
function NavLink({
  item, isActive, collapsed, onClick,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.title : undefined}
      className={cn(
        'group flex items-center gap-2.5 rounded-lg text-sm font-medium',
        'transition-all duration-150 cursor-pointer select-none outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        collapsed ? 'px-0 py-2.5 justify-center w-10 mx-auto' : 'px-3 py-2',
        isActive
          ? 'nav-item-active nav-item-active-indicator'
          : [
              'text-muted-foreground',
              'hover:bg-sidebar-accent/60 hover:text-foreground',
            ],
      )}
    >
      <Icon className={cn(
        'h-4 w-4 shrink-0 transition-colors duration-150',
        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
      )} />

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge && (
            <span className={cn(
              'text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide',
              item.badgeType === 'ai'
                ? 'bg-primary/12 text-primary border border-primary/20'
                : 'bg-success/12 text-success border border-success/20',
            )}>
              {item.badge}
            </span>
          )}
          {isActive && <ChevronRight className="h-3 w-3 text-primary shrink-0 opacity-60" />}
        </>
      )}
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN SHELL
═══════════════════════════════════════════════════════════════════════ */
export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const basePath = (import.meta.env.BASE_URL || '').replace(/\/$/, '');

  const displayName =
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'Your workspace';

  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'RG';

  /* Ctrl+K to open command palette */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* Close user menu on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <AppProvider>
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}

      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">

        {/* ── Mobile overlay ── */}
        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={closeMobile}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════
            SIDEBAR — Windows 11 Acrylic Navigation
        ════════════════════════════════════════════════════════════════ */}
        <aside className={cn(
          'z-50 flex flex-col transition-all duration-300 ease-out shrink-0',
          'border-r border-sidebar-border/60 acrylic',
          'bg-sidebar/80',
          collapsed ? 'w-[60px]' : 'w-[230px]',
          'md:translate-x-0 md:static fixed inset-y-0 left-0',
          mobileOpen ? 'translate-x-0 shadow-2xl w-[230px]' : '-translate-x-full md:translate-x-0',
        )}>
          {/* ── Logo row ── */}
          <div className={cn(
            'h-14 flex items-center border-b border-sidebar-border/50 shrink-0',
            collapsed && !mobileOpen ? 'justify-center px-0' : 'justify-between px-4',
          )}>
            {(!collapsed || mobileOpen) && (
              <Link href="/dashboard" className="flex items-center gap-2.5 group min-w-0">
                <div className={cn(
                  'relative w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                  'bg-primary text-primary-foreground shadow-md',
                  'transition-transform group-hover:scale-105',
                )}>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm tracking-tight gradient-text truncate">
                  ResumeGPT
                </span>
              </Link>
            )}
            {collapsed && !mobileOpen && (
              <Link href="/dashboard" className="flex items-center justify-center">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  'bg-primary text-primary-foreground shadow-md',
                )}>
                  <Sparkles className="w-4 h-4" />
                </div>
              </Link>
            )}
            {(!collapsed || mobileOpen) && (
              <button
                className="md:flex hidden h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-colors"
                onClick={() => setCollapsed(v => !v)}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
            {mobileOpen && (
              <button
                className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
                onClick={closeMobile}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* ── Expand button when collapsed ── */}
          {collapsed && !mobileOpen && (
            <button
              onClick={() => setCollapsed(false)}
              className="mx-auto mt-2 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-colors"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}

          {/* ── Navigation ── */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-3">
            {navSections.map(section => (
              <div key={section.label}>
                {!collapsed || mobileOpen ? (
                  <p className="nav-section-label mb-1">{section.label}</p>
                ) : (
                  <div className="h-px bg-border/40 mx-1 mb-2" />
                )}
                <div className="space-y-0.5">
                  {section.items.map(item => (
                    <NavLink
                      key={item.href}
                      item={item}
                      isActive={location === item.href}
                      collapsed={collapsed && !mobileOpen}
                      onClick={closeMobile}
                    />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* ── Bottom user area ── */}
          {(!collapsed || mobileOpen) && (
            <div className="p-3 border-t border-sidebar-border/50 shrink-0 space-y-2">
              {/* User row */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left',
                    'hover:bg-sidebar-accent/60 transition-colors',
                    userMenuOpen && 'bg-sidebar-accent/60',
                  )}
                >
                  <div className="relative shrink-0">
                    <div className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center',
                      'bg-primary text-primary-foreground font-bold text-xs shadow-md',
                    )}>
                      {initials}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-sidebar" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{displayName}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {user?.primaryEmailAddress?.emailAddress || 'Secure workspace'}
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    'h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0',
                    userMenuOpen && 'rotate-180',
                  )} />
                </button>

                {userMenuOpen && (
                  <div className={cn(
                    'absolute bottom-full mb-1 left-0 right-0 z-50',
                    'rounded-xl border border-border bg-popover/95 backdrop-blur-xl p-1.5 shadow-xl',
                    'animate-slide-up',
                  )}>
                    <Link href="/settings" onClick={() => setUserMenuOpen(false)} className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm',
                      'hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground',
                    )}>
                      <Settings className="h-3.5 w-3.5" /> Settings
                    </Link>
                    <button
                      onClick={() => signOut({ redirectUrl: basePath || '/' })}
                      className={cn(
                        'flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm',
                        'hover:bg-destructive/8 transition-colors text-muted-foreground hover:text-destructive',
                      )}
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Collapsed user avatar */}
          {collapsed && !mobileOpen && (
            <div className="p-2 border-t border-sidebar-border/50 flex justify-center">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer',
                'bg-primary text-primary-foreground font-bold text-xs shadow-md',
                'hover:ring-2 hover:ring-primary/30 transition-all',
              )}>
                {initials}
              </div>
            </div>
          )}
        </aside>

        {/* ══════════════════════════════════════════════════════════════
            MAIN CONTENT AREA
        ════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Top Command Bar ── */}
          <header className={cn(
            'h-14 shrink-0 flex items-center justify-between',
            'px-4 md:px-5 border-b border-border/60',
            'acrylic bg-background/80 z-30',
          )}>
            {/* Left: mobile toggle + breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-4 w-4" />
              </button>

              {/* Current page title */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-muted-foreground hidden sm:block">ResumeGPT</span>
                <span className="text-muted-foreground/40 hidden sm:block text-xs">/</span>
                <span className="text-sm font-semibold text-foreground truncate">
                  {allNavItems.find(n => n.href === location)?.title ?? 'Workspace'}
                </span>
              </div>
            </div>

            {/* Center: Command search trigger */}
            <button
              onClick={() => setCmdOpen(true)}
              className={cn(
                'hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg',
                'border border-border bg-muted/40 hover:bg-muted/70 transition-colors',
                'text-sm text-muted-foreground cursor-text w-[200px] justify-between',
              )}
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                <span className="text-xs">Search…</span>
              </div>
              <div className="flex items-center gap-0.5">
                <kbd className="text-[9px] font-mono border border-border rounded px-1 py-0.5 bg-background">⌘K</kbd>
              </div>
            </button>

            {/* Right: actions */}
            <div className="flex items-center gap-1">
              {/* Mobile search */}
              <button
                className="sm:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                onClick={() => setCmdOpen(true)}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              <ThemeToggle />

              {/* Help */}
              <Button
                variant="ghost" size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                aria-label="Help"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost" size="icon"
                className="relative h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
              </Button>

              {/* User avatar (desktop) */}
              <div className="hidden md:block h-7 w-7 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center ml-1 shadow-md">
                <span className="flex h-full w-full items-center justify-center">{initials}</span>
              </div>
            </div>
          </header>

          {/* ── Page content ── */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-background">
            {/* Ambient background orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
              <div className="orb orb-primary" style={{ width: 500, height: 500, top: -150, right: -150, opacity: 0.08 }} />
              <div className="orb orb-accent"  style={{ width: 350, height: 350, bottom: -80, left: -80, opacity: 0.06 }} />
            </div>
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
