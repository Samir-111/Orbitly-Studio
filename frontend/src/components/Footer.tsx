import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05080F] border-t border-white/5 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/5">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan p-[1px]">
                <div className="w-full h-full bg-[#0B101E] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                ORBITLY<span className="text-brand-400 font-normal text-sm tracking-widest uppercase">Studio</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              We engineer world-class digital products, intuitive user experiences, and bulletproof software for ambitious tech companies worldwide.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface border border-white/5 hover:text-white hover:border-brand-500/30 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface border border-white/5 hover:text-white hover:border-brand-500/30 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-surface border border-white/5 hover:text-white hover:border-brand-500/30 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Studio Navigation</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/#services" className="hover:text-brand-400 transition-colors">Our Capabilities</Link></li>
              <li><Link href="/#work" className="hover:text-brand-400 transition-colors">Selected Case Studies</Link></li>
              <li><Link href="/#blog" className="hover:text-brand-400 transition-colors">Insights & Architecture</Link></li>
              <li><Link href="/#about" className="hover:text-brand-400 transition-colors">Why Founders Choose Us</Link></li>
              <li><Link href="/#contact" className="hover:text-brand-400 transition-colors">Start a Project</Link></li>
            </ul>
          </div>

          {/* Contact / Portal */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Contact & Studio</h4>
            <p className="text-sm text-slate-400">
              hello@orbitly.studio<br />
              San Francisco, CA & Remote Worldwide
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

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Orbitly Studio Inc. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>Crafted with precision & modern engineering standards</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
