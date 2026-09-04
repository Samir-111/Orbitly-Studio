'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { projectsApi, getAdminToken } from '../../../services/api';
import { Project } from '../../../types';
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertCircle,
  X,
} from 'lucide-react';

/**
 * Admin Projects & Case Studies Management Page
 * Handles CRUD operations for studio portfolio case studies.
 */
export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    thumbnail: '',
    shortDescription: '',
    description: '',
    tagsString: '',
    client: '',
    year: '2025',
    deliverablesString: '',
    challenge: '',
    solution: '',
    results: '',
    isPublished: true,
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await projectsApi.getAll(true);
      setProjects(res.data || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load projects.');
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
    loadProjects();
  }, [router]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      shortDescription: '',
      description: '',
      tagsString: 'UI/UX Design, Web Development',
      client: '',
      year: new Date().getFullYear().toString(),
      deliverablesString: 'Design System, Web Application',
      challenge: '',
      solution: '',
      results: '',
      isPublished: true,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      thumbnail: project.thumbnail,
      shortDescription: project.shortDescription,
      description: project.description,
      tagsString: project.tags?.join(', ') || '',
      client: project.client || '',
      year: project.year || '2025',
      deliverablesString: project.deliverables?.join(', ') || '',
      challenge: project.challenge || '',
      solution: project.solution || '',
      results: project.results || '',
      isPublished: project.isPublished,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Auto-generate slug when title changes (if creating)
  const handleTitleChange = (val: string) => {
    const updated: any = { title: val };
    if (!editingProject) {
      updated.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  // Save Project (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);

      const payload: Partial<Project> = {
        title: formData.title,
        slug: formData.slug,
        thumbnail: formData.thumbnail,
        shortDescription: formData.shortDescription,
        description: formData.description,
        tags: formData.tagsString.split(',').map((t) => t.trim()).filter(Boolean),
        client: formData.client,
        year: formData.year,
        deliverables: formData.deliverablesString.split(',').map((d) => d.trim()).filter(Boolean),
        challenge: formData.challenge,
        solution: formData.solution,
        results: formData.results,
        isPublished: formData.isPublished,
      };

      if (editingProject) {
        await projectsApi.update(editingProject._id, payload);
        setSuccessMessage(`Project '${formData.title}' updated successfully.`);
      } else {
        await projectsApi.create(payload);
        setSuccessMessage(`Project '${formData.title}' created successfully.`);
      }

      setIsModalOpen(false);
      loadProjects();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed.');
    }
  };

  // Toggle publish status directly
  const handleTogglePublish = async (project: Project) => {
    try {
      await projectsApi.update(project._id, { isPublished: !project.isPublished });
      setProjects((prev) =>
        prev.map((p) => (p._id === project._id ? { ...p, isPublished: !p.isPublished } : p))
      );
      setSuccessMessage(
        `Project status changed to ${!project.isPublished ? 'Published' : 'Draft'}.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update status.');
    }
  };

  // Delete project
  const handleDelete = async (id: string) => {
    try {
      await projectsApi.delete(id);
      setDeleteConfirmId(null);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setSuccessMessage('Project removed successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete project.');
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 min-w-0">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Briefcase className="w-6 h-6 text-brand-400" />
                Case Studies & Projects
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Create, update, and manage published studio portfolio case studies.
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-md shadow-brand-600/25"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
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

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search projects by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Projects Table */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-surface-elevated/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-4">Project</th>
                    <th className="py-3.5 px-4">Client / Year</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Tags</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 animate-pulse">
                        Loading studio projects...
                      </td>
                    </tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        No projects match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr key={project._id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Title & Slug */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3 max-w-md">
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-12 h-9 rounded-lg object-cover bg-surface-elevated flex-shrink-0"
                            />
                            <div className="overflow-hidden">
                              <p className="font-bold text-white truncate text-sm">
                                {project.title}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono truncate">
                                /{project.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Client / Year */}
                        <td className="py-4 px-4 whitespace-nowrap text-slate-400">
                          <span className="text-white font-medium">{project.client || '—'}</span>
                          <span className="text-[11px] text-slate-500 block">{project.year || '2025'}</span>
                        </td>

                        {/* Status Toggle Pill */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePublish(project)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                              project.isPublished
                                ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 hover:bg-accent-emerald/20'
                                : 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20 hover:bg-accent-amber/20'
                            }`}
                            title="Click to toggle publish status"
                          >
                            {project.isPublished ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Published</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span>Draft</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Tags */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {project.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded bg-surface border border-white/5 text-[10px] text-slate-400"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags?.length > 2 && (
                              <span className="text-[10px] text-slate-500">+{project.tags.length - 2}</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/projects/${project.slug}`}
                              target="_blank"
                              className="p-2 rounded-lg bg-surface hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                              title="View Live Case Study Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleOpenEdit(project)}
                              className="p-2 rounded-lg bg-surface hover:bg-white/10 text-slate-400 hover:text-brand-400 transition-colors"
                              title="Edit Project"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(project._id)}
                              className="p-2 rounded-lg bg-surface hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete Project"
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

        {/* Create / Edit Project Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto border border-white/10">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  {editingProject ? 'Edit Project Case Study' : 'Create New Project Case Study'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Apex Health — Next-Gen Telemedicine"
                      className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. apex-health-platform"
                      className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Thumbnail URL */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Thumbnail Image URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* Year */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Project Year</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2025"
                      className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Client */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Client / Company Name</label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="e.g. Apex Health Technologies"
                      className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tagsString}
                      onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                      placeholder="UI/UX Design, Web Development, Mobile App"
                      className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Short Summary (for Card) *</label>
                  <input
                    type="text"
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 sentence overview of the project and outcome..."
                    className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Full Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Project Overview & Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed narrative of what Orbitly Studio architected, engineered, and designed..."
                    className="w-full bg-surface border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>

                {/* Deliverables */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Deliverables (comma separated)</label>
                  <input
                    type="text"
                    value={formData.deliverablesString}
                    onChange={(e) => setFormData({ ...formData, deliverablesString: e.target.value })}
                    placeholder="Design System, iOS App, Web Console, Cloud Architecture"
                    className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Case Study Details: Challenge & Solution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">The Challenge</label>
                    <textarea
                      rows={2}
                      value={formData.challenge}
                      onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                      placeholder="Core problem and engineering barriers faced..."
                      className="w-full bg-surface border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">The Solution</label>
                    <textarea
                      rows={2}
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      placeholder="Technical and design strategy implemented..."
                      className="w-full bg-surface border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Key Business Results & Metrics</label>
                  <input
                    type="text"
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    placeholder="e.g. 62% reduction in drop-offs, $35M Series B closed, 4.9 App Store rating"
                    className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-white/10">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-surface-elevated border-white/20"
                  />
                  <label htmlFor="isPublished" className="text-xs font-medium text-slate-200 cursor-pointer">
                    Publish immediately (Uncheck to save as draft hidden from public visitors)
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-surface border border-white/10 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/25"
                  >
                    {editingProject ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </form>
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
              <h3 className="text-base font-bold text-white">Delete this project?</h3>
              <p className="text-xs text-slate-400">
                This action cannot be undone. The project case study will be permanently deleted from the database.
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
