'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { projectsApi, blogApi, inquiriesApi, getAdminToken } from '../../../services/api';
import { Project, BlogPost, Inquiry } from '../../../types';
import {
  Briefcase,
  FileText,
  Inbox,
  Plus,
  ArrowUpRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [projRes, blogRes, inqRes] = await Promise.all([
          projectsApi.getAll(true),
          blogApi.getAll(true),
          inquiriesApi.getAll().catch(() => ({ data: [] as Inquiry[] })),
        ]);
        setProjects(projRes.data || []);
        setBlogPosts(blogRes.data || []);
        setInquiries(inqRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  const publishedProjectsCount = projects.filter((p) => p.isPublished).length;
  const draftProjectsCount = projects.filter((p) => !p.isPublished).length;

  const publishedBlogCount = blogPosts.filter((b) => b.isPublished).length;
  const draftBlogCount = blogPosts.filter((b) => !b.isPublished).length;
  const featuredBlogCount = blogPosts.filter((b) => b.featured).length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Studio Overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Manage case studies, editorial blog content, and publication statuses.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin/projects"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-md shadow-brand-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </Link>
              <Link
                href="/admin/blog"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-surface border border-white/10 hover:border-white/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Article</span>
              </Link>
            </div>
          </div>

          {/* Metric Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Projects */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Projects
                </span>
                <Briefcase className="w-4 h-4 text-brand-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{projects.length}</span>
                <span className="text-xs text-slate-400">
                  <span className="text-accent-emerald font-semibold">{publishedProjectsCount}</span> published
                </span>
              </div>
            </div>

            {/* Total Blog Articles */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Blog Articles
                </span>
                <FileText className="w-4 h-4 text-accent-cyan" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{blogPosts.length}</span>
                <span className="text-xs text-slate-400">
                  <span className="text-accent-emerald font-semibold">{publishedBlogCount}</span> published
                </span>
              </div>
            </div>

            {/* Customer Inquiries / Leads */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Client Inquiries
                </span>
                <Inbox className="w-4 h-4 text-accent-emerald" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{inquiries.length}</span>
                <span className="text-xs text-slate-400">
                  <span className="text-accent-cyan font-bold">{newInquiriesCount}</span> new requirements
                </span>
              </div>
            </div>

            {/* Featured Posts */}
            <div className="glass-card p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Featured Posts
                </span>
                <Sparkles className="w-4 h-4 text-accent-amber" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{featuredBlogCount}</span>
                <span className="text-xs text-slate-400">Hero Highlights</span>
              </div>
            </div>
          </div>

          {/* Customer Leads Banner / Section */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-accent-emerald" />
                  Recent Customer Inquiries & Briefs
                </h3>
                <p className="text-xs text-slate-400">
                  Prospective clients who submitted their project goals on the website.
                </p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                View All Inquiries ({inquiries.length}) →
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                Loading incoming inquiries...
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-surface/40 rounded-xl">
                No customer inquiries received yet. Try submitting the inquiry form on the website!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inquiries.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    className="p-4 rounded-xl bg-surface/70 border border-white/5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{item.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                            item.status === 'new'
                              ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                              : 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-brand-300 font-medium">{item.service}</p>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        "{item.message}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.budget}</span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Tables Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            {/* Recent Projects Table */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-400" />
                  Recent Projects
                </h3>
                <Link
                  href="/admin/projects"
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300"
                >
                  Manage All →
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">No projects added yet.</div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 4).map((p) => (
                    <div
                      key={p._id}
                      className="p-3 rounded-xl bg-surface/60 border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="overflow-hidden space-y-1">
                        <p className="text-xs font-bold text-white truncate">{p.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono">/{p.slug}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            p.isPublished
                              ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20'
                              : 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20'
                          }`}
                        >
                          {p.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <Link
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          className="p-1 rounded text-slate-400 hover:text-white"
                          title="View Live Page"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Blog Posts Table */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent-cyan" />
                  Recent Blog Articles
                </h3>
                <Link
                  href="/admin/blog"
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300"
                >
                  Manage All →
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                  Loading blog posts...
                </div>
              ) : blogPosts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">No blog posts created yet.</div>
              ) : (
                <div className="space-y-3">
                  {blogPosts.slice(0, 4).map((b) => (
                    <div
                      key={b._id}
                      className="p-3 rounded-xl bg-surface/60 border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="overflow-hidden space-y-1">
                        <div className="flex items-center gap-1.5">
                          {b.featured && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                          )}
                          <p className="text-xs font-bold text-white truncate">{b.title}</p>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">/{b.slug}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            b.isPublished
                              ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20'
                              : 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20'
                          }`}
                        >
                          {b.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          className="p-1 rounded text-slate-400 hover:text-white"
                          title="View Live Page"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
