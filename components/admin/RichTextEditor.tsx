"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Highlighter,
  Link as LinkIcon,
  List,
  RotateCcw,
  Eye,
} from "lucide-react";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  rows?: number;
  placeholder?: string;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  rows = 5,
  placeholder = "Type your text here...",
}: RichTextEditorProps) {
  const [showHtmlCode, setShowHtmlCode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Sync value into contentEditable div when value changes externally
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, showHtmlCode]);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  };

  const execCmd = (command: string, valueArg: string | undefined = undefined) => {
    if (showHtmlCode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, valueArg);
    handleInput();
  };

  const applyHighlightBlue = () => {
    if (showHtmlCode) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString();
    if (!selectedText) return;

    // Use foreColor command for clean blue color application
    document.execCommand("foreColor", false, "#007eff");
    document.execCommand("bold", false);
    handleInput();
  };

  const applyLink = () => {
    if (showHtmlCode) return;
    const url = prompt("Enter link URL (e.g. https://example.com):", "https://");
    if (url) {
      document.execCommand("createLink", false, url);
      handleInput();
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="font-extrabold text-slate-800 text-xs sm:text-sm">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowHtmlCode(!showHtmlCode)}
          className="text-[11px] font-bold text-[#007eff] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {showHtmlCode ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
          <span>{showHtmlCode ? "Back to Visual WYSIWYG" : "View / Edit HTML Tags"}</span>
        </button>
      </div>

      {/* CKEditor Style Formatting Toolbar */}
      <div className="bg-slate-100 border border-slate-200 rounded-t-2xl px-3 py-2 flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => execCmd("bold")}
          className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          title="Bold text"
        >
          <Bold className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bold</span>
        </button>

        <button
          type="button"
          onClick={() => execCmd("italic")}
          className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          title="Italic text"
        >
          <Italic className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Italic</span>
        </button>

        <button
          type="button"
          onClick={() => execCmd("underline")}
          className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          title="Underline text"
        >
          <Underline className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Underline</span>
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={applyHighlightBlue}
          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#007eff] border border-blue-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          title="Highlight Text in Blue"
        >
          <Highlighter className="w-3.5 h-3.5 text-[#007eff]" />
          <span>Highlight Blue</span>
        </button>

        <button
          type="button"
          onClick={applyLink}
          className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          title="Add Link"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Link</span>
        </button>

        <button
          type="button"
          onClick={() => execCmd("insertUnorderedList")}
          className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          title="Bullet Point List"
        >
          <List className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bullet List</span>
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => execCmd("removeFormat")}
          className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          title="Clean Formatting"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Formatting</span>
        </button>
      </div>

      {/* Editor Main Box */}
      {!showHtmlCode ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          style={{ minHeight: `${rows * 32}px` }}
          className="w-full bg-white border border-slate-200 rounded-b-2xl p-4 text-slate-900 font-medium text-sm sm:text-[15px] focus:outline-none focus:border-[#007eff] transition-all leading-relaxed whitespace-pre-wrap cursor-text"
        />
      ) : (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Raw HTML code editor..."
          className="w-full bg-slate-900 text-emerald-400 border border-slate-700 rounded-b-2xl p-4 font-mono text-xs focus:outline-none focus:border-[#007eff] transition-all leading-relaxed"
        />
      )}
    </div>
  );
}
