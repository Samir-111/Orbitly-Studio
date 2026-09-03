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

export default function AdminInquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Inbox className="w-6 h-6 text-brand-400" />
                Customer Inquiries & Project Briefs
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                View requirements submitted by prospective clients through the website contact form.
              </p>
            </div>
          </div>

          {/* Toast Alerts */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 text-xs text-accent-emerald flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
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
                placeholder="Search leads by name, email, service, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 bg-surface p-1 rounded-xl border border-white/10 text-xs self-start sm:self-auto">
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
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-surface-elevated/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-4">Client / Contact</th>
                    <th className="py-3.5 px-4">Service & Budget</th>
                    <th className="py-3.5 px-4">Project Requirements</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 animate-pulse">
                        Loading client inquiries...
                      </td>
                    </tr>
                  ) : filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No customer project inquiries found.
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((item) => (
                      <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Name & Email */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <p className="font-bold text-white text-sm">{item.name}</p>
                          <a
                            href={`mailto:${item.email}`}
                            className="text-slate-400 hover:text-brand-400 flex items-center gap-1 mt-0.5"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{item.email}</span>
                          </a>
                        </td>

                        {/* Service & Budget */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-semibold text-brand-300 block">{item.service}</span>
                          <span className="text-[11px] text-slate-400 block font-mono mt-0.5">
                            Budget: {item.budget}
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
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-surface border focus:outline-none cursor-pointer ${
                              item.status === 'new'
                                ? 'text-accent-cyan border-accent-cyan/30'
                                : item.status === 'contacted'
                                ? 'text-accent-emerald border-accent-emerald/30'
                                : 'text-slate-400 border-white/10'
                            }`}
                          >
                            <option value="new">🟢 New</option>
                            <option value="contacted">🔵 Contacted</option>
                            <option value="archived">⚪ Archived</option>
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
                              className="p-2 rounded-lg bg-surface hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                              title="View Full Inquiry Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(item._id)}
                              className="p-2 rounded-lg bg-surface hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete Lead"
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
            <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Client Project Brief</h3>
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Client Info Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface border border-white/5">
                  <div>
                    <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                      Client Name
                    </span>
                    <span className="text-sm font-bold text-white block mt-0.5">
                      {viewingInquiry.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                      Work Email
                    </span>
                    <a
                      href={`mailto:${viewingInquiry.email}`}
                      className="text-sm font-medium text-brand-400 hover:underline block mt-0.5"
                    >
                      {viewingInquiry.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                      Primary Service
                    </span>
                    <span className="text-xs font-semibold text-slate-200 block mt-0.5">
                      {viewingInquiry.service}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                      Estimated Budget
                    </span>
                    <span className="text-xs font-semibold text-accent-emerald block mt-0.5">
                      {viewingInquiry.budget}
                    </span>
                  </div>
                </div>

                {/* Requirements Message */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Project Requirements & Narrative
                  </label>
                  <div className="p-4 rounded-xl bg-surface/80 border border-white/10 text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                    {viewingInquiry.message}
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-white/5">
                  <span className="text-slate-400 font-medium">Lead Status:</span>
                  <div className="flex items-center gap-2">
                    {(['new', 'contacted', 'archived'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(viewingInquiry._id, st)}
                        className={`px-3 py-1 rounded-lg capitalize font-semibold transition-all ${
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
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <a
                  href={`mailto:${viewingInquiry.email}?subject=Orbitly Studio: Project Inquiry Follow-up`}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 flex items-center gap-1.5 shadow-md shadow-brand-600/25"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => setViewingInquiry(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-surface border border-white/10 text-slate-300 hover:text-white"
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
            <div className="glass-panel max-w-sm w-full rounded-2xl p-6 space-y-4 text-center border border-rose-500/20">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Delete this client inquiry?</h3>
              <p className="text-xs text-slate-400">
                This will permanently delete this client inquiry record from the database.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-white/10 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25"
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
