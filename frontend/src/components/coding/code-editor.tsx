"use client";

import Editor from "@monaco-editor/react";
import { Check, CircleAlert } from "lucide-react";
import { useState } from "react";
import type { CodeExecutionResult } from "@/lib/types";

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
  const editorLanguage = language === "C++" ? "cpp" : language.toLowerCase();

  return (
    <div className="h-[280px] rounded-xl border border-slate-700 bg-[#0f172a]">
      <Editor
        height="100%"
        defaultLanguage={editorLanguage}
        language={editorLanguage}
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

export function CodeOutput({ result }: { result: CodeExecutionResult | null }) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/80 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        {result?.succeeded
          ? <Check className="h-4 w-4 text-emerald-400" />
          : <CircleAlert className="h-4 w-4 text-amber-400" />}
        {result ? result.status.replaceAll("_", " ") : "Execution output"}
      </div>
      <p className="text-xs text-slate-400">
        {"Java: use class prog with a main method. Python and C++ need a runnable entry point."}
      </p>
      {!result && <p className="text-sm text-slate-400">Run your code to see its output.</p>}
      {result?.compileOutput && <OutputBlock label="Compiler output" value={result.compileOutput} />}
      {result?.compileError && <OutputBlock label="Compiler errors" value={result.compileError} error />}
      {result?.output && <OutputBlock label="Program output" value={result.output} />}
      {result?.errorOutput && <OutputBlock label="Runtime errors" value={result.errorOutput} error />}
      {result && !result.output && !result.errorOutput && !result.compileOutput && !result.compileError && (
        <p className="text-sm text-slate-400">Program completed without output.</p>
      )}
    </div>
  );
}

function OutputBlock({ label, value, error = false }: { label: string; value: string; error?: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`text-xs font-medium ${error ? "text-red-300" : "text-slate-400"}`}>{label}</div>
      <pre className={`max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-sm ${error ? "text-red-200" : "text-slate-200"}`}>
        {value}
      </pre>
    </div>
  );
}
