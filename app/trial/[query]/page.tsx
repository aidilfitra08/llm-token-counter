"use client";
import { useParams } from "next/navigation";
import React, { use } from "react";

// Option A: Static JSON quotes
const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Success is not final; failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  { text: "What we think, we become.", author: "Buddha" },
];

export default async function QuotePage() {
  const { query } = useParams();

  // Option B (commented): Using free quote API
  // const res = await fetch("https://api.quotable.io/random", { cache: "no-store" });
  // const apiData = await res.json();

  // Get random quote from static list
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold capitalize">Quote for: {query}</h1>
        <p className="text-xl italic">“{randomQuote.text}”</p>
        <p className="text-lg text-gray-400">— {randomQuote.author}</p>

        {/* API version example */}
        {/* <p className="text-xl italic">“{apiData.content}”</p>
        <p className="text-lg text-gray-400">— {apiData.author}</p> */}
      </div>
    </div>
  );
}
