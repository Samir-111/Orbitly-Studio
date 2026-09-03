'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { MarkdownEditor } from '../../../components/MarkdownEditor';
import { blogApi, getAdminToken } from '../../../services/api';
import { BlogPost } from '../../../types';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertCircle,
  Sparkles,
  X,
  Clock,
} from 'lucide-react';

export default function AdminBlogPage() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    thumbnail: '',
    excerpt: '',
    content: '',
    author: 'Orbitly Studio Team',
    readTime: '4 min read',
    tagsString: 'Design Systems, Engineering',
    featured: false,
    isPublished: true,
  });

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const res = await blogApi.getAll(true);
      setBlogPosts(res.data || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load blog posts.');
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
    loadBlogPosts();
  }, [router]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80',
      excerpt: '',
      content: `## Section Heading\n\nWrite your insightful article here using markdown formatting.\n\n### Key Takeaways\n- Point 1\n- Point 2`,
      author: 'Orbitly Studio Team',
      readTime: '4 min read',
      tagsString: 'Design Systems, Engineering',
      featured: false,
      isPublished: true,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      thumbnail: post.thumbnail,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author || 'Orbitly Studio Team',
      readTime: post.readTime || '4 min read',
      tagsString: post.tags?.join(', ') || '',
      featured: post.featured,
      isPublished: post.isPublished,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    const updated: any = { title: val };
    if (!editingPost) {
      updated.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  // Save Blog Post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);

      const payload: Partial<BlogPost> = {
        title: formData.title,
        slug: formData.slug,
        thumbnail: formData.thumbnail,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        readTime: formData.readTime,
        tags: formData.tagsString.split(',').map((t) => t.trim()).filter(Boolean),
        featured: formData.featured,
        isPublished: formData.isPublished,
      };

      if (editingPost) {
        await blogApi.update(editingPost._id, payload);
        setSuccessMessage(`Article '${formData.title}' updated successfully.`);
      } else {
        await blogApi.create(payload);
        setSuccessMessage(`Article '${formData.title}' created successfully.`);
      }

      setIsModalOpen(false);
      loadBlogPosts();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed.');
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (post: BlogPost) => {
    try {
      await blogApi.update(post._id, { isPublished: !post.isPublished });
      setBlogPosts((prev) =>
        prev.map((b) => (b._id === post._id ? { ...b, isPublished: !b.isPublished } : b))
      );
      setSuccessMessage(
        `Article status changed to ${!post.isPublished ? 'Published' : 'Draft'}.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update publication status.');
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (post: BlogPost) => {
    try {
      await blogApi.update(post._id, { featured: !post.featured });
      setBlogPosts((prev) =>
        prev.map((b) => (b._id === post._id ? { ...b, featured: !b.featured } : b))
      );
      setSuccessMessage(
        `Article is now ${!post.featured ? 'marked as Featured' : 'unmarked from Featured'}.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to toggle featured status.');
    }
  };

  // Delete article
  const handleDelete = async (id: string) => {
    try {
      await blogApi.delete(id);
      setDeleteConfirmId(null);
      setBlogPosts((prev) => prev.filter((b) => b._id !== id));
      setSuccessMessage('Blog article deleted successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete blog article.');
    }
  };

  const filteredPosts = blogPosts.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <FileText className="w-6 h-6 text-accent-cyan" />
                Editorial Blog Articles
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Write, publish, feature, and manage markdown articles and engineering insights.
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-md shadow-brand-600/25"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Article</span>
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
              placeholder="Search articles by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Blog Table */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-surface-elevated/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-4">Article</th>
                    <th className="py-3.5 px-4">Author / Read Time</th>
                    <th className="py-3.5 px-4">Featured</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 animate-pulse">
                        Loading blog posts...
                      </td>
                    </tr>
                  ) : filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        No articles match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post._id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Title & Thumbnail */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3 max-w-md">
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="w-12 h-9 rounded-lg object-cover bg-surface-elevated flex-shrink-0"
                            />
                            <div className="overflow-hidden">
                              <p className="font-bold text-white truncate text-sm">
                                {post.title}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono truncate">
                                /{post.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Author & Read Time */}
                        <td className="py-4 px-4 whitespace-nowrap text-slate-400">
                          <span className="text-white font-medium">{post.author}</span>
                          <span className="text-[11px] text-slate-500 block">{post.readTime}</span>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleFeatured(post)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                              post.featured
                                ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                                : 'bg-surface text-slate-500 border border-white/5 hover:text-slate-300'
                            }`}
                            title="Click to toggle featured status"
                          >
                            <Sparkles className={`w-3 h-3 ${post.featured ? 'text-brand-400' : 'text-slate-500'}`} />
                            <span>{post.featured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </td>

                        {/* Status Toggle Pill */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePublish(post)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                              post.isPublished
                                ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 hover:bg-accent-emerald/20'
                                : 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20 hover:bg-accent-amber/20'
                            }`}
                            title="Click to toggle publish status"
                          >
                            {post.isPublished ? (
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

                        {/* Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 rounded-lg bg-surface hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                              title="View Live Article Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleOpenEdit(post)}
                              className="p-2 rounded-lg bg-surface hover:bg-white/10 text-slate-400 hover:text-brand-400 transition-colors"
                              title="Edit Article"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(post._id)}
                              className="p-2 rounded-lg bg-surface hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete Article"
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

        {/* Create / Edit Article Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto border border-white/10">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white">
                  {editingPost ? 'Edit Blog Article' : 'Write New Editorial Article'}
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
                    <label className="text-xs font-semibold text-slate-300">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. How We Built a Real-Time Design System"
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
                      placeholder="e.g. building-realtime-design-system"
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

                  {/* Read Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Read Time</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="5 min read"
                      className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Author */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Author Name</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Sarah Chen, Head of Design"
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
                      placeholder="Design Systems, Engineering, Frontend"
                      className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Excerpt / Lead Summary *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief 1-2 sentence executive summary of the article..."
                    className="w-full bg-surface border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>

                {/* Content with Markdown Editor */}
                <MarkdownEditor
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  label="Article Content (Markdown Supported) *"
                  placeholder="Write the full post using markdown headings, lists, code blocks, and bold text..."
                />

                {/* Flags Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-white/10">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-surface-elevated border-white/20"
                    />
                    <label htmlFor="featured" className="text-xs font-medium text-slate-200 cursor-pointer">
                      Mark as Featured Article (Highlighted priority on landing page)
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-white/10">
                    <input
                      type="checkbox"
                      id="isPublishedPost"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 bg-surface-elevated border-white/20"
                    />
                    <label htmlFor="isPublishedPost" className="text-xs font-medium text-slate-200 cursor-pointer">
                      Publish immediately (Uncheck to save as draft)
                    </label>
                  </div>
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
                    {editingPost ? 'Save Changes' : 'Publish Article'}
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
              <h3 className="text-base font-bold text-white">Delete this article?</h3>
              <p className="text-xs text-slate-400">
                This action cannot be undone. The blog article will be permanently removed from the database.
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
