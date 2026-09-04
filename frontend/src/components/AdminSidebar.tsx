'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  Briefcase,
  FileText,
  Inbox,
  Globe,
  LogOut,
  Sparkles,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { authApi, getStoredAdminUser } from '../services/api';

/**
 * Admin Sidebar Navigation Component
 * Provides sticky navigation across all studio admin management routes:
 * Dashboard, Projects, Blog Articles, Client Inquiries, and Studio Settings.
 */
export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const adminUser = getStoredAdminUser();

  // Clear stored session and redirect to login page
  const handleLogout = () => {
    authApi.logout();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { label: 'Projects', href: '/admin/projects', icon: Briefcase },
    { label: 'Blog Articles', href: '/admin/blog', icon: FileText },
    { label: 'Client Inquiries', href: '/admin/inquiries', icon: Inbox },
    { label: 'Studio Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#080B14] border-r border-[#20263A] flex flex-col justify-between p-5 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-30">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="space-y-3">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#F5F5F7] block">
                ORBITLY
              </span>
              <span className="text-[10px] uppercase tracking-wider text-brand-400 font-semibold block">
                STUDIO
              </span>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Studio Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1">
            STUDIO MANAGEMENT
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-500/20 text-white border border-brand-500/30 shadow-sm'
                    : 'text-[#9CA3B5] hover:text-[#F5F5F7] hover:bg-[#0D1220]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-[#9CA3B5]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Actions */}
      <div className="space-y-3 pt-6 border-t border-[#20263A]">
        {/* Live Site Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#9CA3B5] hover:text-[#F5F5F7] hover:bg-[#0D1220] transition-colors"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            Live Website
          </span>
          <span className="text-[10px] bg-[#131A2E] border border-[#20263A] px-2 py-0.5 rounded text-[#9CA3B5]">↗</span>
        </Link>

        {/* User Card */}
        <div className="bg-[#0D1220] rounded-xl p-2.5 border border-[#20263A] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
              {adminUser?.name?.[0] || 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-[#F5F5F7] truncate">
                {adminUser?.name || 'Samir Khorgade'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {adminUser?.role || 'Admin'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
