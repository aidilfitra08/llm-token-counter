"use client";
import React from "react";

export default function RefreshClient({ tag }: { tag: string }) {
  const [loading, setLoading] = React.useState(false);

  return (
    <button
      onClick={() => {
        setLoading(true);
        window.location.assign(`/trial/${encodeURIComponent(tag)}`);
      }}
      disabled={loading}
      className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white text-sm font-medium transition"
    >
      {loading ? "Loading..." : "Get Another Quote"}
    </button>
  );
}
