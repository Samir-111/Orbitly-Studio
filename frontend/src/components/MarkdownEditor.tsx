'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Edit3, Heading, Bold, List, Code, Link as LinkIcon } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  label = 'Content (Markdown)',
  placeholder = 'Write in markdown formatting...',
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertHelper = (prefix: string, suffix: string = '') => {
    onChange(`${value}\n${prefix}sample text${suffix}`);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
        {/* Toggle Write / Preview */}
        <div className="flex items-center gap-1 bg-surface rounded-lg p-0.5 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'write'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="rounded-xl border border-white/10 bg-surface/80 overflow-hidden focus-within:border-brand-500 transition-colors">
        {/* Helper Toolbar in Write Mode */}
        {activeTab === 'write' && (
          <div className="flex items-center gap-1 px-3 py-2 border-b border-white/5 bg-surface-elevated/40 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => insertHelper('### ')}
              className="p-1.5 hover:bg-white/5 rounded text-slate-300 hover:text-white transition-colors"
              title="Add Heading"
            >
              <Heading className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertHelper('**', '**')}
              className="p-1.5 hover:bg-white/5 rounded text-slate-300 hover:text-white transition-colors"
              title="Bold Text"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertHelper('- ')}
              className="p-1.5 hover:bg-white/5 rounded text-slate-300 hover:text-white transition-colors"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertHelper('```typescript\n', '\n```')}
              className="p-1.5 hover:bg-white/5 rounded text-slate-300 hover:text-white transition-colors"
              title="Code Block"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertHelper('[Link Text](', ')')}
              className="p-1.5 hover:bg-white/5 rounded text-slate-300 hover:text-white transition-colors"
              title="Insert Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-500 ml-auto font-mono">Markdown supported</span>
          </div>
        )}

        {/* Text Area or Markdown Preview */}
        {activeTab === 'write' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
            placeholder={placeholder}
            className="w-full bg-transparent p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono resize-y"
          />
        ) : (
          <div className="p-6 min-h-[250px] max-h-[500px] overflow-y-auto prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
            {value ? (
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-4 mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold text-brand-400 mt-3 mb-1">{children}</h3>,
                  p: ({ children }) => <p className="text-slate-300 text-sm leading-relaxed mb-3">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 text-slate-300 mb-3">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 text-slate-300 mb-3">{children}</ol>,
                  code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-surface-elevated text-brand-300 font-mono text-xs">{children}</code>,
                  pre: ({ children }) => <pre className="p-4 rounded-xl bg-[#070A12] border border-white/10 overflow-x-auto text-xs font-mono text-slate-300 my-3">{children}</pre>,
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-slate-500 italic text-center py-8">No content to preview yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
