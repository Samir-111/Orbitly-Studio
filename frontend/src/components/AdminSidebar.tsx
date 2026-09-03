'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Inbox,
  Globe,
  LogOut,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { authApi, getStoredAdminUser } from '../services/api';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const adminUser = getStoredAdminUser();

  const handleLogout = () => {
    authApi.logout();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: Briefcase },
    { label: 'Blog Articles', href: '/admin/blog', icon: FileText },
    { label: 'Client Inquiries', href: '/admin/inquiries', icon: Inbox },
  ];

  return (
    <aside className="w-64 bg-[#090D17] border-r border-white/5 flex flex-col justify-between p-5 min-h-screen">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="space-y-3">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan p-[1px]">
              <div className="w-full h-full bg-[#0B101E] rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block">
                ORBITLY
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-accent-emerald" />
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 pb-1">
            Studio Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/25 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Actions */}
      <div className="space-y-3 pt-6 border-t border-white/5">
        {/* Live Site Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-surface/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            Live Website
          </span>
          <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400">↗</span>
        </Link>

        {/* User Card */}
        <div className="bg-surface/60 rounded-xl p-3 border border-white/5 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300">
              {adminUser?.name?.[0] || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {adminUser?.email || 'admin@orbitly.studio'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
