"use client";

import Editor from "@monaco-editor/react";
import { Check, X } from "lucide-react";
import { useState } from "react";

export function LanguageSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const languages = ["Java", "Python", "C++"];

  return (
    <div className="flex gap-2">
      {languages.map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => onChange(language)}
          className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
            value === language ? "border-indigo-500 bg-indigo-500/10 text-indigo-200" : "border-slate-700 bg-slate-900 text-slate-300"
          }`}
        >
          {language}
        </button>
      ))}
    </div>
  );
}

export function CodeEditor({ language, code, onChange }: { language: string; code: string; onChange: (value: string) => void }) {
  const [mounted, setMounted] = useState(false);

  return (
    <div className="h-[280px] rounded-xl border border-slate-700 bg-[#0f172a]">
      <Editor
        height="100%"
        defaultLanguage={language.toLowerCase()}
        language={language.toLowerCase()}
        value={code}
        onMount={() => setMounted(true)}
        onChange={(value) => onChange(value ?? "")}
        theme="vs-dark"
        loading={mounted ? undefined : "Loading editor..."}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          roundedSelection: false,
          padding: { top: 16 },
        }}
      />
    </div>
  );
}

export function TestResults({ results }: { results: { passed: boolean; label: string }[] }) {
  const passedCount = results.filter((item) => item.passed).length;

  return (
    <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/80 p-4">
      <div className="text-sm font-semibold text-slate-100">Test Results</div>
      <div className="space-y-2">
        {results.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-slate-200">
            {item.passed ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-red-400" />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-700 pt-3 text-sm text-slate-300">
        {passedCount} / {results.length} passed
      </div>
      <div className="text-sm text-slate-300">Runtime: 42 ms</div>
    </div>
  );
}
