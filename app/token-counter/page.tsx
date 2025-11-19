"use client";
import React, { useState, useMemo } from "react";
import { Calculator, DollarSign, Type, FileText } from "lucide-react";

export default function TokenCalculator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [inputPricePer1M, setInputPricePer1M] = useState("3.00");
  const [outputPricePer1M, setOutputPricePer1M] = useState("15.00");

  // Preset models with pricing
  const models = [
    { name: "GPT-4 Turbo", input: 10.0, output: 30.0 },
    { name: "GPT-4", input: 30.0, output: 60.0 },
    { name: "GPT-3.5 Turbo", input: 0.5, output: 1.5 },
    { name: "Claude 3.5 Sonnet", input: 3.0, output: 15.0 },
    { name: "Claude 3 Opus", input: 15.0, output: 75.0 },
    { name: "Claude 3 Haiku", input: 0.25, output: 1.25 },
  ];

  // Estimate token count (approximate: ~4 chars per token for English)
  const estimateTokens = (text: string) => {
    if (!text) return 0;
    // More accurate estimation: count words and characters
    const words = text.trim().split(/\s+/).length;
    const chars = text.length;
    // Average: 1 token ≈ 0.75 words or 4 characters
    return Math.ceil(Math.max(words / 0.75, chars / 4));
  };

  const calculations = useMemo(() => {
    const inputTokens = estimateTokens(inputText);
    const outputTokens = estimateTokens(outputText);
    const inputPrice = parseFloat(inputPricePer1M) || 0;
    const outputPrice = parseFloat(outputPricePer1M) || 0;

    const inputCost = (inputTokens / 1000000) * inputPrice;
    const outputCost = (outputTokens / 1000000) * outputPrice;
    const totalCost = inputCost + outputCost;

    return {
      inputTokens,
      outputTokens,
      inputCost: inputCost.toFixed(6),
      outputCost: outputCost.toFixed(6),
      totalCost: totalCost.toFixed(6),
      totalTokens: inputTokens + outputTokens,
    };
  }, [inputText, outputText, inputPricePer1M, outputPricePer1M]);

  const loadPreset = (model: any) => {
    setInputPricePer1M(model.input.toFixed(2));
    setOutputPricePer1M(model.output.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8 dark:bg-gray-900 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 dark:bg-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              LLM Token Counter & Cost Calculator
            </h1>
          </div>

          {/* Model Presets */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 dark:text-gray-300">
              Model Pricing Presets
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {models.map((model) => (
                <button
                  key={model.name}
                  onClick={() => loadPreset(model)}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors text-sm font-medium dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Inputs */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 ">
                Input Price per 1M Tokens ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={inputPricePer1M}
                onChange={(e) => setInputPricePer1M(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Price per 1M Tokens ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={outputPricePer1M}
                onChange={(e) => setOutputPricePer1M(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Text Input Areas */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Input Text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Input Text (Prompt)
                </label>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {calculations.inputTokens.toLocaleString()} tokens
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your prompt or input text here..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
              />
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Characters: {inputText.length.toLocaleString()} | Words:{" "}
                {inputText
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .length.toLocaleString()}
              </div>
            </div>

            {/* Output Text */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Output Text (Response)
                </label>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {calculations.outputTokens.toLocaleString()} tokens
                </span>
              </div>
              <textarea
                value={outputText}
                onChange={(e) => setOutputText(e.target.value)}
                placeholder="Paste the model's response here..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
              />
              <div className="mt-2 text-xs text-gray-500">
                Characters: {outputText.length.toLocaleString()} | Words:{" "}
                {outputText
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .length.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 dark:from-gray-600 dark:to-slate-800 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Token Count & Cost Summary
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-20 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Input Tokens</div>
                <div className="text-2xl font-bold">
                  {calculations.inputTokens.toLocaleString()}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  ${calculations.inputCost}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Output Tokens</div>
                <div className="text-2xl font-bold">
                  {calculations.outputTokens.toLocaleString()}
                </div>
                <div className="text-xs opacity-75 mt-1">
                  ${calculations.outputCost}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 bg-opacity-20 rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Total Tokens</div>
                <div className="text-2xl font-bold">
                  {calculations.totalTokens.toLocaleString()}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 bg-opacity-30 rounded-lg p-4 border-2 border-white border-opacity-50">
                <div className="text-sm opacity-90 mb-1">Total Cost</div>
                <div className="text-2xl font-bold">
                  ${calculations.totalCost}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Note:</strong> Token counts are estimated using an
              approximation algorithm (~1 token ≈ 4 characters or 0.75 words).
              For exact counts, use the official tokenizer for your specific
              model. Pricing is per million tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
