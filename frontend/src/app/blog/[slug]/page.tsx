'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { blogApi } from '../../../services/api';
import { BlogPost } from '../../../types';
import { ArrowLeft, Clock, Calendar, Sparkles, AlertCircle, RefreshCw, User, Share2 } from 'lucide-react';

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const res = await blogApi.getBySlug(slug);
      setPost(res.data);
    } catch (err: any) {
      setError(err.message || 'Article not found or unpublished.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Back Navigation */}
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Studio Insights</span>
          </Link>

          {/* Loading State */}
          {loading && (
            <div className="space-y-8 animate-pulse">
              <div className="h-10 bg-surface-elevated rounded-lg w-4/5" />
              <div className="aspect-[16/9] bg-surface-elevated rounded-2xl" />
              <div className="space-y-4">
                <div className="h-4 bg-surface-elevated rounded w-full" />
                <div className="h-4 bg-surface-elevated rounded w-5/6" />
                <div className="h-4 bg-surface-elevated rounded w-3/4" />
              </div>
            </div>
          )}

          {/* Error / 404 State */}
          {!loading && error && (
            <div className="py-20 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Article Not Found</h1>
                <p className="text-sm text-slate-400">
                  {error} It may be an unpublished draft or the link may be incorrect.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={fetchPost}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-surface border border-white/10 text-slate-300 hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" />
                  Retry
                </button>
                <Link
                  href="/#blog"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500"
                >
                  Browse Blog
                </Link>
              </div>
            </div>
          )}

          {/* Post Content */}
          {!loading && post && (
            <article className="space-y-10">
              {/* Header */}
              <div className="space-y-6">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center gap-3">
                  {post.featured && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-600 text-white">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-surface border border-white/10 text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Article Title */}
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {post.title}
                </h1>

                {/* Author & Read Time Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-white/5 text-xs sm:text-sm text-slate-400">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold">
                      {post.author?.[0] || 'O'}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{post.author}</p>
                      <p className="text-xs text-slate-500">Orbitly Engineering Team</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-400" />
                      {post.readTime || '4 min read'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-brand-400" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div className="aspect-[16/9] rounded-3xl overflow-hidden glass-panel">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Excerpt Lead Paragraph */}
              <div className="p-6 rounded-2xl bg-surface/80 border-l-4 border-brand-500 text-slate-300 text-base sm:text-lg italic leading-relaxed">
                {post.excerpt}
              </div>

              {/* Main Markdown Body */}
              <div className="prose prose-invert max-w-none text-slate-300 text-base sm:text-lg leading-relaxed space-y-6 pt-4">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-bold text-white mt-8 mb-3 text-gradient">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg sm:text-xl font-semibold text-brand-400 mt-6 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-slate-300 leading-relaxed mb-4">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-6">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 text-slate-300 mb-6">{children}</ol>,
                    li: ({ children }) => <li className="text-slate-300">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    code: ({ children }) => <code className="px-2 py-0.5 rounded bg-surface-elevated text-brand-300 font-mono text-sm">{children}</code>,
                    pre: ({ children }) => <pre className="p-5 rounded-2xl bg-[#070A12] border border-white/10 overflow-x-auto text-sm font-mono text-slate-200 my-6 shadow-xl">{children}</pre>,
                    blockquote: ({ children }) => <blockquote className="p-4 rounded-xl bg-surface-elevated/40 border-l-4 border-brand-400 italic text-slate-300 my-4">{children}</blockquote>,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Author Bio Footer Box */}
              <div className="mt-12 p-8 rounded-3xl glass-panel flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-xl flex-shrink-0">
                  {post.author?.[0] || 'O'}
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base font-bold text-white">Written by {post.author}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Part of the Orbitly Studio technical team. We share practical insights from designing, architecting, and deploying high-scale digital products for hypergrowth startups.
                  </p>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
