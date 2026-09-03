'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, ArrowUpRight, Lock } from 'lucide-react';
import { getAdminToken } from '../services/api';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasAdminToken, setHasAdminToken] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    setHasAdminToken(!!getAdminToken());
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', href: '/#services' },
    { label: 'Work', href: '/#work' },
    { label: 'Blog', href: '/#blog' },
    { label: 'Why Us', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080C15]/80 backdrop-blur-md border-b border-white/5 py-4 shadow-xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan p-[1px] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0B101E] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400 group-hover:text-accent-cyan transition-colors" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
            ORBITLY<span className="text-brand-400 font-normal text-sm tracking-widest uppercase">Studio</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 bg-surface/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={hasAdminToken ? '/admin/dashboard' : '/admin/login'}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors border border-white/5 hover:border-white/10 rounded-lg bg-surface/40"
            title="Admin Dashboard Portal"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{hasAdminToken ? 'Admin Panel' : 'Admin'}</span>
          </Link>
          <Link
            href="/#contact"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-500/35 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-surface border border-white/10 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0F1D] border-b border-white/10 px-6 py-6 animate-fadeIn">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-white py-2 border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link
                href={hasAdminToken ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-slate-300 bg-surface rounded-xl border border-white/10"
              >
                <Lock className="w-4 h-4" />
                <span>{hasAdminToken ? 'Admin Dashboard' : 'Admin Login'}</span>
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-brand-600"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
