'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';
import { settingsApi, StudioSettings } from '../services/api';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<StudioSettings>({
    studioEmail: 'hello@orbitly.studio',
    location: 'San Francisco, CA & Remote Worldwide',
  });

  useEffect(() => {
    settingsApi
      .get()
      .then((res) => {
        if (res?.data) {
          setSettings({
            studioEmail: res.data.studioEmail || 'hello@orbitly.studio',
            location: res.data.location || 'San Francisco, CA & Remote Worldwide',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load footer settings:', err);
      });
  }, []);

  return (
    <footer className="bg-[#05070D] border-t border-[#20263A] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#20263A]/60">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface border border-[#20263A] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-400" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#F5F5F7] flex items-center gap-1.5">
                ORBITLY<span className="text-[#8B7CF6] font-medium text-xs tracking-widest uppercase">Studio</span>
              </span>
            </Link>
            <p className="text-[#9CA3B5] text-sm max-w-sm leading-relaxed font-normal">
              A digital design and product development studio helping startups turn complex ideas into refined, scalable software.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface border border-[#20263A] hover:text-white hover:border-brand-500/40 transition-all">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface border border-[#20263A] hover:text-white hover:border-brand-500/40 transition-all">
                <Github className="w-3.5 h-3.5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface border border-[#20263A] hover:text-white hover:border-brand-500/40 transition-all">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm text-[#9CA3B5]">
              <li><Link href="/#services" className="hover:text-[#F5F5F7] transition-colors">Services</Link></li>
              <li><Link href="/#work" className="hover:text-[#F5F5F7] transition-colors">Selected Work</Link></li>
              <li><Link href="/#blog" className="hover:text-[#F5F5F7] transition-colors">Studio Journal</Link></li>
              <li><Link href="/#about" className="hover:text-[#F5F5F7] transition-colors">Why Us</Link></li>
              <li><Link href="/#contact" className="hover:text-[#F5F5F7] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F5F5F7] uppercase tracking-wider">Studio</h4>
            <p className="text-sm text-[#9CA3B5] leading-relaxed">
              <a href={`mailto:${settings.studioEmail}`} className="hover:text-[#F5F5F7] transition-colors block">
                {settings.studioEmail}
              </a>
              <span>{settings.location}</span>
            </p>
            <div className="pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                <span>Studio Admin Portal</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Orbitly Studio. All rights reserved.</p>
          <p>Crafted with modern product engineering standards</p>
        </div>
      </div>
    </footer>
  );
};
