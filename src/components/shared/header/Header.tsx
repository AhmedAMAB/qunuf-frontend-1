'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNormalizedPath } from '@/hooks/useNormalizedPath';
import { Link } from '@/i18n/navigation';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import LocaleSwitcher from '../LocaleSwitcher';
import { useTranslations } from 'next-intl';
import Logo from '../Logo';
import SecondaryButton from '../buttons/SecondaryButton';

export default function Header() {
  const { normalizedPath } = useNormalizedPath();
  const t = useTranslations('header');

  const [isPinned, setIsPinned] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useOutsideClick([menuRef, toggleRef], () => setMenuOpen(false));

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setIsPinned(y > 16);
      if (Math.abs(y - lastY) > 8) {
        setIsHidden(y > lastY && y > 80);
        lastY = y;
      }
    };
    const onResize = () => setIsPinned(window.scrollY > 16);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setMenuOpen(false);
  }, []);
  useEffect(() => {
    if (menuOpen) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, onKeyDown]);

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.realEstate'), href: '/properties' },
    { label: t('nav.blog'), href: '/blog' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
    { label: t('nav.dashboard'), href: '/dashboard' },
  ];

  // Typography upgrades via classes
  const linkBase = 'relative inline-flex items-center font-medium tracking-[0.01em] text-[15px] md:text-[16px] xl:text-[17px] ' + 'transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2';
  const linkActive = 'text-slate-900 after:absolute after:-bottom-1 after:start-0 after:h-[2px] after:w-full after:bg-secondary after:rounded-full';
  const linkIdle = 'text-slate-900 hover:text-slate-700';

  return (
    <header id='main-header' ref={headerRef} className={['fixed left-0 top-0 md:!top-4 z-50 w-full transition-transform duration-300 will-change-transform', isHidden ? '-translate-y-[100px]' : 'translate-y-0'].join(' ')} aria-label={t('aria.mainNav', { default: 'Main navigation' })}>
      <div
        className={[
          'mx-auto flex w-full items-center justify-between gap-4 px-5 lg:px-8 md:py-4 py-3',
          'xl:max-w-[1208px] xl:rounded-2xl',
          'transition-all duration-300',
          // More transparent, stronger blur + hairline border
          isPinned ? 'rtl:ml-auto ltr:mr-auto max-w-5xl rounded-2xl border border-white/20 bg-white shadow-xl shadow-slate-900/5 ring-1 ring-black/5 backdrop-blur supports-[backdrop-filter]:bg-white/80' : 'rtl:ml-auto ltr:mr-auto max-w-5xl rounded-2xl border border-white/20 bg-white/70 shadow-lg shadow-slate-900/5 ring-1 ring-black/5 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80',
        ].join(' ')}>
        {/* Logo */}
        <div className='shrink-0'>
          <Logo />
        </div>

        {/* Desktop nav */}
        <nav className='navbar me-auto ms-6 hidden md:flex items-center gap-5 lg:gap-7' aria-label={t('aria.primary', { default: 'Primary' })}>
          {navLinks.map(({ label, href }) => {
            const active = normalizedPath === href;
            return (
              <Link key={href} href={href} className={[linkBase, active ? linkActive : linkIdle, 'leading-6'].join(' ')} aria-current={active ? 'page' : undefined}>
                <span className='pb-1'>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-2'>
          <SecondaryButton href='/sign-in' className='bg-secondary hover:bg-secondary-hover text-white focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 text-[14px] md:text-[15px] font-semibold'>
            {t('nav.login')}
          </SecondaryButton>
          <LocaleSwitcher />

          {/* Mobile toggle */}
          <button ref={toggleRef} id='menu-toggle' aria-controls='mobile-menu' aria-expanded={menuOpen} onClick={() => setMenuOpen(prev => !prev)} className='md:hidden rounded-md p-2 text-slate-800/90 hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 transition'>
            <svg xmlns='http://www.w3.org/2000/svg' className={['h-6 w-6 transition-transform duration-300 ease-in-out', menuOpen ? 'rotate-90' : 'rotate-0'].join(' ')} fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
              {menuOpen ? <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' /> : <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer + backdrop */}
      <div id='mobile-menu' className={['md:hidden fixed inset-x-0 top-0 z-40', 'transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none', menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'].join(' ')} aria-hidden={!menuOpen}>
        {/* Backdrop */}
        <div className={['fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]', 'transition-opacity duration-300 motion-reduce:transition-none', menuOpen ? 'opacity-100' : 'opacity-0'].join(' ')} onClick={() => setMenuOpen(false)} />
        {/* Drawer panel */}
        <div ref={menuRef} className={['fixed inset-x-0 top-0 origin-top rounded-b-2xl', 'bg-white shadow-xl ring-1 ring-black/5', 'pt-[calc(env(safe-area-inset-top)+12px)] pb-4', 'transition-transform duration-300 ease-out motion-reduce:transition-none', menuOpen ? 'translate-y-0' : '-translate-y-4'].join(' ')}>
          <div className='flex items-center justify-between px-4'>
            <Logo />
            <button onClick={() => setMenuOpen(false)} className='rounded-md p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2' aria-label={t('aria.closeMenu', { default: 'Close menu' })}>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          <nav className='mt-2 divide-y divide-slate-100 text-[#1f2937]' aria-label={t('aria.primaryMobile', { default: 'Primary mobile' })}>
            {navLinks.map(({ label, href }) => {
              const active = normalizedPath === href;
              return (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={['block px-4 py-3 text-[16px] font-medium tracking-[0.01em] transition-colors', active ? 'text-secondary' : 'text-slate-700 hover:text-slate-900'].join(' ')} aria-current={active ? 'page' : undefined}>
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className='px-4 pt-3'>
            <SecondaryButton href='/sign-in' className='w-full bg-secondary hover:bg-secondary-hover text-white focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 text-[15px] font-semibold'>
              {t('nav.login')}
            </SecondaryButton>
          </div>

          <div className='h-[env(safe-area-inset-bottom)]' />
        </div>
      </div>
    </header>
  );
}
