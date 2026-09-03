'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, ArrowUpRight, Lock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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
          ? 'bg-[#080B14]/90 backdrop-blur-md border-b border-[#20263A] py-4 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Studio Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-surface border border-[#20263A] flex items-center justify-center transition-all group-hover:border-brand-500/40">
            <Sparkles className="w-4 h-4 text-brand-400 transition-colors" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#F5F5F7] flex items-center gap-1.5">
            ORBITLY<span className="text-[#8B7CF6] font-medium text-xs tracking-widest uppercase">Studio</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 bg-surface/80 backdrop-blur-md px-6 py-2 rounded-full border border-[#20263A]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#9CA3B5] hover:text-[#F5F5F7] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions: Admin Link + Primary CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Subtle Secondary Admin Button */}
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#9CA3B5] hover:text-white bg-surface/60 hover:bg-surface border border-[#20263A] hover:border-[#8B7CF6]/40 rounded-lg transition-all"
            title="Studio Admin Portal"
          >
            <Lock className="w-3.5 h-3.5 text-[#8B7CF6]" />
            <span>Admin</span>
          </Link>

          {/* Primary CTA */}
          <Link
            href="/#contact"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-surface border border-[#20263A] text-slate-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1220] border-b border-[#20263A] px-6 py-6 animate-fadeIn">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-white py-2 border-b border-[#20263A]/40"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-slate-300 bg-surface rounded-xl border border-[#20263A] hover:border-[#8B7CF6]/40"
              >
                <Lock className="w-3.5 h-3.5 text-[#8B7CF6]" />
                <span>Admin Login</span>
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600"
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
