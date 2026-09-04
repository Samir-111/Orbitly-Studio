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
  Sparkles,
  Eye,
  Mail,
  X,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';

/**
 * Admin Dashboard Page
 * Gives the studio admin an overview of live metrics, recent client inquiries,
 * case studies, and editorial blog articles.
 */
export default function AdminDashboardPage() {
  const router = useRouter();

  // State for data fetched from backend APIs
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected inquiry for opening the details modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Check auth and fetch dashboard data on load
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch projects, blogs, and inquiries concurrently
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

  // Derived metric counts for summary cards
  const publishedProjectsCount = projects.filter((p) => p.isPublished).length;
  const draftProjectsCount = projects.filter((p) => !p.isPublished).length;

  const publishedBlogCount = blogPosts.filter((b) => b.isPublished).length;
  const draftBlogCount = blogPosts.filter((b) => !b.isPublished).length;
  const featuredBlogCount = blogPosts.filter((b) => b.featured).length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  // Assign soft avatar accent colors based on row index
  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-brand-600/25 text-brand-300 border-brand-500/30',
      'bg-indigo-600/25 text-indigo-300 border-indigo-500/30',
      'bg-emerald-600/25 text-emerald-300 border-emerald-500/30',
      'bg-purple-600/25 text-purple-300 border-purple-500/30',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#070A13] text-[#F5F5F7] flex flex-col md:flex-row font-sans">
      {/* Fixed Left Navigation Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-6 lg:p-8 min-w-0">
        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
          {/* Top Header: Title, Description and Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Studio Overview
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview of published work, journal articles, and prospective client inquiries.
              </p>
            </div>

            {/* Action Buttons: Add Project & Write Article */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <Link
                href="/admin/projects"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#5B48DF] hover:bg-[#4E3BCB] transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </Link>
              <Link
                href="/admin/blog"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-[#0D1220] border border-[#20263A] hover:border-slate-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write Article</span>
              </Link>
            </div>
          </div>

          {/* 4 Summary Stat Cards (Compact & Balanced Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Case Studies */}
            <div className="p-4 rounded-xl bg-[#0D1220] border border-[#20263A] space-y-2 hover:border-[#2E3650] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Case Studies
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#131A2E] border border-[#20263A] flex items-center justify-center text-brand-400">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight block">
                  {projects.length}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  <span className="text-emerald-400 font-semibold">{publishedProjectsCount}</span> published · {draftProjectsCount} draft{draftProjectsCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Card 2: Journal Articles */}
            <div className="p-4 rounded-xl bg-[#0D1220] border border-[#20263A] space-y-2 hover:border-[#2E3650] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Journal Articles
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#131A2E] border border-[#20263A] flex items-center justify-center text-brand-400">
                  <FileText className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight block">
                  {blogPosts.length}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  <span className="text-emerald-400 font-semibold">{publishedBlogCount}</span> published · {draftBlogCount} draft{draftBlogCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Card 3: Client Inquiries */}
            <div className="p-4 rounded-xl bg-[#0D1220] border border-[#20263A] space-y-2 hover:border-[#2E3650] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Client Inquiries
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#131A2E] border border-[#20263A] flex items-center justify-center text-brand-400">
                  <Inbox className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight block">
                  {inquiries.length}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  <span className="text-brand-300 font-semibold">{newInquiriesCount}</span> new brief{newInquiriesCount !== 1 ? 's' : ''} to review
                </p>
              </div>
            </div>

            {/* Card 4: Featured Content */}
            <div className="p-4 rounded-xl bg-[#0D1220] border border-[#20263A] space-y-2 hover:border-[#2E3650] transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Featured Content
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#131A2E] border border-[#20263A] flex items-center justify-center text-brand-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight block">
                  {featuredBlogCount}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Highlighted on homepage</p>
              </div>
            </div>
          </div>

          {/* Section: Recent Inquiries (Sleek Horizontal Rows) */}
          <div className="p-5 rounded-xl bg-[#0D1220] border border-[#20263A] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-brand-400" />
                  <span>Recent Inquiries</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Prospective clients and project briefs submitted through the contact form.
                </p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
              >
                View all inquiries ({inquiries.length}) →
              </Link>
            </div>

            {/* Inquiries List or Loading / Empty States */}
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                Loading inquiries...
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-[#131A2E]/30 rounded-lg border border-[#20263A]/40">
                No inquiries received yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {inquiries.slice(0, 3).map((item, index) => (
                  <div
                    key={item._id}
                    className="py-3 px-3.5 rounded-lg bg-[#111728]/70 border border-[#20263A] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-brand-500/30 transition-colors"
                  >
                    {/* Left Column: Avatar + Client Name & Service */}
                    <div className="flex items-center gap-2.5 min-w-[200px]">
                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(
                          index
                        )}`}
                      >
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white truncate">{item.name}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-semibold capitalize ${
                              item.status === 'new'
                                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                                : item.status === 'contacted'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{item.service}</p>
                      </div>
                    </div>

                    {/* Middle Column: Short Message Quote */}
                    <div className="flex-1 max-w-xl">
                      <p className="text-xs text-slate-300 line-clamp-1 leading-relaxed">
                        &ldquo;{item.message}&rdquo;
                      </p>
                    </div>

                    {/* Right Column: Budget, Date, and "View Details" action */}
                    <div className="flex items-center justify-between md:justify-end gap-5 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#20263A]">
                      <div className="text-left md:text-right space-y-0.5">
                        <p className="text-xs font-bold text-white font-mono">{item.budget}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedInquiry(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-[#131A2E] hover:bg-brand-600 border border-[#20263A] hover:border-brand-500 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-400" />
                        <span>View Details</span>
                        <span className="text-[10px] ml-0.5">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Grid: Recent Projects & Recent Blog Articles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Card: Recent Projects */}
            <div className="p-5 rounded-xl bg-[#0D1220] border border-[#20263A] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#20263A]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-400" />
                    <span>Recent Projects</span>
                  </h3>
                  <Link
                    href="/admin/projects"
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    Manage all →
                  </Link>
                </div>

                {loading ? (
                  <div className="py-6 text-center text-xs text-slate-500 animate-pulse">
                    Loading projects...
                  </div>
                ) : projects.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">No projects added yet.</div>
                ) : (
                  <div className="space-y-2.5">
                    {projects.slice(0, 2).map((project) => (
                      <div
                        key={project._id}
                        className="p-2.5 rounded-lg bg-[#111728]/70 border border-[#20263A] flex items-center justify-between gap-3 hover:border-brand-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {project.thumbnail ? (
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-10 h-10 rounded-lg object-cover bg-surface flex-shrink-0 border border-[#20263A]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#131A2E] border border-[#20263A] flex items-center justify-center text-brand-400 flex-shrink-0">
                              <Briefcase className="w-4 h-4" />
                            </div>
                          )}
                          <div className="overflow-hidden space-y-0.5">
                            <p className="text-xs font-bold text-white truncate">{project.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">/{project.slug}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                              project.isPublished
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                            }`}
                          >
                            {project.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <Link
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="View live case study"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Centered Link to Projects */}
              <div className="pt-2 text-center border-t border-[#20263A]">
                <Link
                  href="/admin/projects"
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors inline-block"
                >
                  View all projects →
                </Link>
              </div>
            </div>

            {/* Right Card: Recent Blog Articles */}
            <div className="p-5 rounded-xl bg-[#0D1220] border border-[#20263A] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#20263A]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-400" />
                    <span>Recent Blog Articles</span>
                  </h3>
                  <Link
                    href="/admin/blog"
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    Manage all →
                  </Link>
                </div>

                {loading ? (
                  <div className="py-6 text-center text-xs text-slate-500 animate-pulse">
                    Loading articles...
                  </div>
                ) : blogPosts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">No articles created yet.</div>
                ) : (
                  <div className="space-y-2.5">
                    {blogPosts.slice(0, 2).map((post) => (
                      <div
                        key={post._id}
                        className="p-2.5 rounded-lg bg-[#111728]/70 border border-[#20263A] flex items-center justify-between gap-3 hover:border-brand-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {post.thumbnail ? (
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="w-10 h-10 rounded-lg object-cover bg-surface flex-shrink-0 border border-[#20263A]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#131A2E] border border-[#20263A] flex items-center justify-center text-brand-400 flex-shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}
                          <div className="overflow-hidden space-y-0.5">
                            <p className="text-xs font-bold text-white truncate">{post.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">/{post.slug}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                              post.isPublished
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                            }`}
                          >
                            {post.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="View live article"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Centered Link to Blog */}
              <div className="pt-2 text-center border-t border-[#20263A]">
                <Link
                  href="/admin/blog"
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors inline-block"
                >
                  View all articles →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Inquiry Full Details & Quick Reply */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 bg-[#080B14]/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="w-full max-w-lg rounded-xl bg-[#0D1220] border border-[#20263A] p-5 sm:p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#20263A]">
                <div>
                  <h3 className="text-sm font-bold text-white">Client Inquiry Details</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Received on{' '}
                    {new Date(selectedInquiry.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131A2E] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-[#131A2E] border border-[#20263A] text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-semibold">
                    Client Name
                  </span>
                  <span className="text-xs font-semibold text-white block mt-0.5">
                    {selectedInquiry.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-semibold">
                    Work Email
                  </span>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-xs font-medium text-brand-300 hover:underline block mt-0.5 truncate"
                  >
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-semibold">
                    Service Need
                  </span>
                  <span className="text-xs font-medium text-white block mt-0.5">
                    {selectedInquiry.service}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-semibold">
                    Estimated Budget
                  </span>
                  <span className="text-xs font-medium text-emerald-400 block mt-0.5 font-mono">
                    {selectedInquiry.budget}
                  </span>
                </div>
              </div>

              {/* Client Project Message */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Project Summary & Requirements
                </label>
                <div className="p-3.5 rounded-lg bg-[#131A2E]/60 border border-[#20263A] text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Modal Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#20263A]">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Orbitly Studio: Project Inquiry Follow-up`}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                  <Link
                    href="/admin/inquiries"
                    className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#131A2E] border border-[#20263A] hover:border-brand-500/40 transition-colors flex items-center gap-1"
                  >
                    <span>Manage in Inquiries</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
