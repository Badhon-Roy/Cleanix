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
  Heading1,
  Heading2,
  Palette,
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

  const [activeFormats, setActiveFormats] = useState({
    h2: false,
    h3: false,
    bold: false,
    italic: false,
    underline: false,
  });

  const checkActiveFormats = () => {
    if (showHtmlCode) return;
    try {
      const isBold = document.queryCommandState("bold");
      const isItalic = document.queryCommandState("italic");
      const isUnderline = document.queryCommandState("underline");

      const selection = window.getSelection();
      let isH2 = false;
      let isH3 = false;

      if (selection && selection.rangeCount > 0) {
        let node: Node | null = selection.getRangeAt(0).startContainer;
        while (node && node !== editorRef.current) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = (node as Element).tagName.toLowerCase();
            if (tagName === "h2") isH2 = true;
            if (tagName === "h3") isH3 = true;
          }
          node = node.parentNode;
        }
      }

      setActiveFormats({
        h2: isH2,
        h3: isH3,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
      });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      checkActiveFormats();
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [showHtmlCode]);

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
      checkActiveFormats();
    }
  };

  const execCmd = (command: string, valueArg: string | undefined = undefined) => {
    if (showHtmlCode) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, valueArg);
    handleInput();
    setTimeout(checkActiveFormats, 30);
  };

  const applyHeading2 = () => {
    if (showHtmlCode) return;
    if (editorRef.current) editorRef.current.focus();

    if (activeFormats.h2) {
      document.execCommand("formatBlock", false, "<p>");
    } else {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const selectedText = selection.toString();
      if (selectedText && selectedText.trim().length > 0) {
        document.execCommand(
          "insertHTML",
          false,
          `<h2 class="text-2xl font-black text-[#001837] my-3">${selectedText}</h2>`
        );
      } else {
        document.execCommand("formatBlock", false, "<h2>");
      }
    }
    handleInput();
    setTimeout(checkActiveFormats, 30);
  };

  const applyHeading3 = () => {
    if (showHtmlCode) return;
    if (editorRef.current) editorRef.current.focus();

    if (activeFormats.h3) {
      document.execCommand("formatBlock", false, "<p>");
    } else {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const selectedText = selection.toString();
      if (selectedText && selectedText.trim().length > 0) {
        document.execCommand(
          "insertHTML",
          false,
          `<h3 class="text-xl font-bold text-[#001837] my-2">${selectedText}</h3>`
        );
      } else {
        document.execCommand("formatBlock", false, "<h3>");
      }
    }
    handleInput();
    setTimeout(checkActiveFormats, 30);
  };

  const applyHighlightBlue = () => {
    if (showHtmlCode) return;
    if (editorRef.current) editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString();
    if (selectedText && selectedText.trim().length > 0) {
      document.execCommand(
        "insertHTML",
        false,
        `<span class="text-[#007eff] font-bold">${selectedText}</span>`
      );
    } else {
      document.execCommand("foreColor", false, "#007eff");
      document.execCommand("bold", false);
    }
    handleInput();
    setTimeout(checkActiveFormats, 30);
  };

  const applyTextColor = (color: string) => {
    if (showHtmlCode) return;
    if (editorRef.current) editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString();
    if (selectedText && selectedText.trim().length > 0) {
      document.execCommand(
        "insertHTML",
        false,
        `<span style="color: ${color}; font-weight: 600;">${selectedText}</span>`
      );
    } else {
      document.execCommand("foreColor", false, color);
    }
    handleInput();
    setTimeout(checkActiveFormats, 30);
  };

  const applyLink = () => {
    if (showHtmlCode) return;
    if (editorRef.current) editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString();
    const url = prompt(
      "Enter link URL (e.g. https://cleanix.bd or /contact):",
      "https://"
    );
    if (url) {
      if (selectedText && selectedText.trim().length > 0) {
        document.execCommand(
          "insertHTML",
          false,
          `<a href="${url}" class="text-[#007eff] underline font-bold" target="_blank" rel="noopener noreferrer">${selectedText}</a>`
        );
      } else {
        document.execCommand("createLink", false, url);
      }
      handleInput();
      setTimeout(checkActiveFormats, 30);
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="font-extrabold text-[#11233F] text-xs sm:text-sm">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowHtmlCode(!showHtmlCode)}
          className="text-[11px] font-bold text-[#007eff] bg-[#007eff]/10 hover:bg-[#007eff]/20 border border-[#007eff]/30 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {showHtmlCode ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
          <span>{showHtmlCode ? "Back to Visual WYSIWYG" : "<> View / Edit HTML Tags"}</span>
        </button>
      </div>

      {/* CKEditor Style Formatting Toolbar */}
      <div className="bg-slate-100 border border-slate-200 rounded-t-2xl px-3 py-2 flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={applyHeading2}
          className={`p-1.5 rounded-lg border text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFormats.h2
              ? "bg-[#007eff] text-white border-[#007eff] shadow-sm"
              : "bg-white hover:bg-slate-200 text-[#001837] border-slate-200"
          }`}
          title="Title Heading (H2)"
        >
          <Heading1 className={`w-3.5 h-3.5 ${activeFormats.h2 ? "text-white" : "text-[#007eff]"}`} />
          <span>Title</span>
        </button>

        <button
          type="button"
          onClick={applyHeading3}
          className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFormats.h3
              ? "bg-[#007eff] text-white border-[#007eff] shadow-sm"
              : "bg-white hover:bg-slate-200 text-slate-800 border-slate-200"
          }`}
          title="Sub Title Heading (H3)"
        >
          <Heading2 className={`w-3.5 h-3.5 ${activeFormats.h3 ? "text-white" : "text-slate-700"}`} />
          <span>Sub Title</span>
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => execCmd("bold")}
          className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            activeFormats.bold
              ? "bg-[#007eff] text-white border-[#007eff] shadow-sm"
              : "bg-white hover:bg-slate-200 text-slate-800 border-slate-200"
          }`}
          title="Bold text"
        >
          <Bold className={`w-3.5 h-3.5 ${activeFormats.bold ? "text-white" : "text-slate-800"}`} />
          <span className="hidden sm:inline">Bold</span>
        </button>

        <button
          type="button"
          onClick={() => execCmd("italic")}
          className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            activeFormats.italic
              ? "bg-[#007eff] text-white border-[#007eff] shadow-sm"
              : "bg-white hover:bg-slate-200 text-slate-800 border-slate-200"
          }`}
          title="Italic text"
        >
          <Italic className={`w-3.5 h-3.5 ${activeFormats.italic ? "text-white" : "text-slate-800"}`} />
          <span className="hidden sm:inline">Italic</span>
        </button>

        <button
          type="button"
          onClick={() => execCmd("underline")}
          className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            activeFormats.underline
              ? "bg-[#007eff] text-white border-[#007eff] shadow-sm"
              : "bg-white hover:bg-slate-200 text-slate-800 border-slate-200"
          }`}
          title="Underline text"
        >
          <Underline className={`w-3.5 h-3.5 ${activeFormats.underline ? "text-white" : "text-slate-800"}`} />
          <span className="hidden sm:inline">Underline</span>
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        {/* Text Color Picker & Swatches */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
          <Palette className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
          <input
            type="color"
            title="Choose Custom Text Color"
            onChange={(e) => applyTextColor(e.target.value)}
            className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
          />
          <button
            type="button"
            onClick={() => applyTextColor("#007eff")}
            className="w-3.5 h-3.5 rounded-full bg-[#007eff] border border-white shadow-2xs cursor-pointer hover:scale-125 transition-transform"
            title="Primary Blue"
          />
          <button
            type="button"
            onClick={() => applyTextColor("#ef4444")}
            className="w-3.5 h-3.5 rounded-full bg-[#ef4444] border border-white shadow-2xs cursor-pointer hover:scale-125 transition-transform"
            title="Red"
          />
          <button
            type="button"
            onClick={() => applyTextColor("#10b981")}
            className="w-3.5 h-3.5 rounded-full bg-[#10b981] border border-white shadow-2xs cursor-pointer hover:scale-125 transition-transform"
            title="Green"
          />
          <button
            type="button"
            onClick={() => applyTextColor("#f97316")}
            className="w-3.5 h-3.5 rounded-full bg-[#f97316] border border-white shadow-2xs cursor-pointer hover:scale-125 transition-transform"
            title="Orange"
          />
          <button
            type="button"
            onClick={() => applyTextColor("#001837")}
            className="w-3.5 h-3.5 rounded-full bg-[#001837] border border-white shadow-2xs cursor-pointer hover:scale-125 transition-transform"
            title="Dark Navy"
          />
        </div>

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
          className="w-full bg-white border border-slate-200 rounded-b-2xl p-4 text-[#11233F] font-medium text-sm sm:text-[15px] focus:outline-none focus:border-[#007eff] transition-all leading-relaxed whitespace-pre-wrap cursor-text [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-[#001837] [&_h1]:my-3 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#001837] [&_h2]:my-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#001837] [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-[#007eff] [&_a]:underline"
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
