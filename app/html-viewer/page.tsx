"use client";

import { useState } from "react";
import { Eye, Code, Copy, Check } from "lucide-react";

export default function HTMLViewer() {
  const [html, setHtml] = useState(
    '<div class="p-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl shadow-2xl text-white text-center">\n  <h1 class="text-4xl font-bold mb-4">Hello World!</h1>\n  <p class="text-lg opacity-90">This HTML viewer now supports Tailwind CSS classes!</p>\n  <button class="mt-6 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Click Me</button>\n</div>'
  );
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"split" | "preview">("split");

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            HTML Viewer
          </h1>
          <p className="text-gray-400">
            Paste your HTML code and see it rendered instantly
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView("split")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              view === "split"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Code size={18} />
            Split View
          </button>
          <button
            onClick={() => setView("preview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              view === "preview"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <Eye size={18} />
            Preview Only
          </button>
          <button
            onClick={handleCopy}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy HTML"}
          </button>
        </div>

        <div
          className={`grid gap-6 ${
            view === "split" ? "lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {view === "split" && (
            <div className="flex flex-col">
              <div className="bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
                <span className="text-sm font-medium text-gray-300">
                  HTML Code
                </span>
              </div>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="flex-1 bg-gray-900 text-gray-100 p-4 rounded-b-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[500px]"
                placeholder="Paste your HTML code here..."
                spellCheck={false}
              />
            </div>
          )}

          <div className="flex flex-col">
            <div className="bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
              <span className="text-sm font-medium text-gray-300">Preview</span>
            </div>
            <div className="flex-1 bg-white rounded-b-lg overflow-auto min-h-[500px]">
              <link
                href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
                rel="stylesheet"
              />
              <div className="p-4" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">Tips:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>
              •{" "}
              <strong className="text-gray-300">
                Tailwind CSS classes are fully supported!
              </strong>{" "}
              (e.g.,{" "}
              <code className="text-blue-400">
                class="bg-blue-500 text-white p-4"
              </code>
              )
            </li>
            <li>
              • You can include custom CSS within{" "}
              <code className="text-blue-400">&lt;style&gt;</code> tags
            </li>
            <li>
              • JavaScript within{" "}
              <code className="text-blue-400">&lt;script&gt;</code> tags will
              execute
            </li>
            <li>
              • Toggle between split view and preview-only mode using the
              buttons above
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
