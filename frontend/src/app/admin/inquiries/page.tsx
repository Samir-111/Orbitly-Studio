'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { inquiriesApi, getAdminToken } from '../../../services/api';
import { Inquiry } from '../../../types';
import {
  Inbox,
  Search,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react';

/**
 * Admin Client Inquiries Page
 * Allows the studio admin to view, search, filter, update status, and manage
 * prospective client project briefs submitted through the public contact form.
 */
export default function AdminInquiriesPage() {
  const router = useRouter();

  // Inquiries data and loading state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Search query and filter by inquiry status ('all' | 'new' | 'contacted' | 'archived')
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Feedback notifications
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Detail Modal State
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const res = await inquiriesApi.getAll();
      setInquiries(res.data || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadInquiries();
  }, [router]);

  // Update Status Handler
  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'contacted' | 'archived') => {
    try {
      await inquiriesApi.updateStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
      if (viewingInquiry && viewingInquiry._id === id) {
        setViewingInquiry({ ...viewingInquiry, status: newStatus });
      }
      setSuccessMessage(`Lead marked as '${newStatus}'.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update status.');
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    try {
      await inquiriesApi.delete(id);
      setDeleteConfirmId(null);
      setViewingInquiry(null);
      setInquiries((prev) => prev.filter((item) => item._id !== id));
      setSuccessMessage('Lead deleted successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete lead.');
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 min-w-0">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Inbox className="w-6 h-6 text-brand-400" />
                Client Inquiries
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Project briefs and incoming messages submitted through the website.
              </p>
            </div>
          </div>

          {/* Toast Alerts */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search inquiries by name, email, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0D1220] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 bg-[#0D1220] p-1 rounded-xl border border-white/10 text-xs self-start sm:self-auto">
              {['all', 'new', 'contacted', 'archived'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="p-1 rounded-2xl bg-[#0B0F19] border border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0D1220] text-[11px] font-medium uppercase tracking-wider text-slate-400 border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-4">Client / Contact</th>
                    <th className="py-3.5 px-4">Service & Budget</th>
                    <th className="py-3.5 px-4">Project Brief</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 animate-pulse">
                        Loading inquiries...
                      </td>
                    </tr>
                  ) : filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No client inquiries found.
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((item) => (
                      <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Name & Email */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <p className="font-semibold text-white text-sm">{item.name}</p>
                          <a
                            href={`mailto:${item.email}`}
                            className="text-slate-400 hover:text-brand-400 flex items-center gap-1 mt-0.5"
                          >
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{item.email}</span>
                          </a>
                        </td>

                        {/* Service & Budget */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-medium text-brand-300 block">{item.service}</span>
                          <span className="text-[11px] text-slate-400 block font-mono mt-0.5">
                            {item.budget}
                          </span>
                        </td>

                        {/* Message Preview */}
                        <td className="py-4 px-4 max-w-xs">
                          <p className="line-clamp-2 text-slate-300 text-xs leading-relaxed">
                            {item.message}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleUpdateStatus(
                                item._id,
                                e.target.value as 'new' | 'contacted' | 'archived'
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0D1220] border focus:outline-none cursor-pointer transition-colors ${
                              item.status === 'new'
                                ? 'text-brand-300 border-brand-500/30'
                                : item.status === 'contacted'
                                ? 'text-emerald-400 border-emerald-500/30'
                                : 'text-slate-400 border-white/10'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingInquiry(item)}
                              className="p-1.5 rounded-lg bg-surface hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                              title="View Full Brief"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(item._id)}
                              className="p-1.5 rounded-lg bg-surface hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* View Inquiry Details Modal */}
        {viewingInquiry && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl bg-[#0D1220] border border-white/10 p-6 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white">Client Inquiry Details</h3>
                  <p className="text-xs text-slate-400">
                    Received on{' '}
                    {new Date(viewingInquiry.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setViewingInquiry(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Client Info Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-surface border border-white/5">
                  <div>
                    <span className="text-slate-400 font-medium uppercase tracking-wider block text-[10px]">
                      Client Name
                    </span>
                    <span className="text-sm font-semibold text-white block mt-0.5">
                      {viewingInquiry.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium uppercase tracking-wider block text-[10px]">
                      Work Email
                    </span>
                    <a
                      href={`mailto:${viewingInquiry.email}`}
                      className="text-xs font-medium text-brand-300 hover:underline block mt-0.5 truncate"
                    >
                      {viewingInquiry.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium uppercase tracking-wider block text-[10px]">
                      Service Need
                    </span>
                    <span className="text-xs font-medium text-slate-200 block mt-0.5">
                      {viewingInquiry.service}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium uppercase tracking-wider block text-[10px]">
                      Estimated Budget
                    </span>
                    <span className="text-xs font-medium text-emerald-400 block mt-0.5">
                      {viewingInquiry.budget}
                    </span>
                  </div>
                </div>

                {/* Requirements Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Project Summary & Requirements
                  </label>
                  <div className="p-4 rounded-xl bg-surface/80 border border-white/5 text-slate-200 text-xs leading-relaxed whitespace-pre-line">
                    {viewingInquiry.message}
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-white/5">
                  <span className="text-slate-400 text-xs">Status:</span>
                  <div className="flex items-center gap-1.5">
                    {(['new', 'contacted', 'archived'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(viewingInquiry._id, st)}
                        className={`px-3 py-1 rounded-lg capitalize text-xs font-medium transition-colors ${
                          viewingInquiry.status === st
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-surface-elevated text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <a
                  href={`mailto:${viewingInquiry.email}?subject=Orbitly Studio: Project Inquiry Follow-up`}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => setViewingInquiry(null)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0D1220] max-w-sm w-full rounded-2xl p-6 space-y-4 text-center border border-rose-500/20 shadow-2xl">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Delete inquiry?</h3>
              <p className="text-xs text-slate-400">
                This will permanently delete this client inquiry from your records.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-surface border border-white/10 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
