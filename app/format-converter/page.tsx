"use client";
import React, { useState } from "react";
import {
  Upload,
  Download,
  ArrowRight,
  FileText,
  AlertCircle,
} from "lucide-react";
import * as Papa from "papaparse";
import * as YAML from "yaml";
import { decode, encode } from "@toon-format/toon";

export default function FileConverter() {
  const [inputFormat, setInputFormat] = useState("csv");
  const [outputFormat, setOutputFormat] = useState("json");
  const [inputData, setInputData] = useState("");
  const [outputData, setOutputData] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const formats = ["csv", "json", "json-compact", "yaml", "xml", "tsv", "toon"];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputData((event.target?.result as string) || "");
        setError("");
        setOutputData("");
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (text: any) => {
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  };

  const parseTSV = (text: any) => {
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        delimiter: "\t",
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  };

  const parseXML = (text: any) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");

    const xmlToJson = (node: any) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim();
      }

      const obj: any = {};

      if (node.attributes) {
        for (let attr of node.attributes) {
          obj[`@${attr.name}`] = attr.value;
        }
      }

      const children: any = Array.from(node.childNodes);
      const textContent = children
        .filter((child: any) => child.nodeType === Node.TEXT_NODE)
        .map((child: any) => child.textContent.trim())
        .join("");

      if (
        textContent &&
        !children.some((child: any) => child.nodeType === Node.ELEMENT_NODE)
      ) {
        return textContent;
      }

      for (let child of children) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const name = child.nodeName;
          const value = xmlToJson(child);

          if (obj[name]) {
            if (Array.isArray(obj[name])) {
              obj[name].push(value);
            } else {
              obj[name] = [obj[name], value];
            }
          } else {
            obj[name] = value;
          }
        }
      }

      return obj;
    };

    return xmlToJson(xml.documentElement);
  };

  const jsonToXML = (obj: any, rootName = "root") => {
    const toXML: (data: any, name: any) => string = (data: any, name: any) => {
      if (Array.isArray(data)) {
        return data.map((item: any) => toXML(item, name)).join("");
      }

      if (typeof data === "object" && data !== null) {
        let xml = `<${name}>`;
        for (let key in data) {
          xml += toXML(data[key], key);
        }
        xml += `</${name}>`;
        return xml;
      }

      return `<${name}>${data}</${name}>`;
    };

    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXML(obj, rootName)}`;
  };

  const convert = async () => {
    try {
      setError("");
      let data;

      // Parse input
      switch (inputFormat) {
        case "csv":
          data = await parseCSV(inputData);
          break;
        case "tsv":
          data = await parseTSV(inputData);
          break;
        case "json":
        case "json-compact":
          data = JSON.parse(inputData);
          break;
        case "yaml":
          data = YAML.parse(inputData);
          break;
        case "xml":
          data = parseXML(inputData);
          break;
        case "toon":
          data = decode(inputData); // Placeholder for TOON format parsing
          break;
        default:
          throw new Error("Unsupported input format");
      }

      // Convert to output
      let result;
      switch (outputFormat) {
        case "json":
          result = JSON.stringify(data, null, 2);
          break;
        case "json-compact":
          result = JSON.stringify(data);
          break;
        case "yaml":
          result = YAML.stringify(data);
          break;
        case "csv":
          result = Papa.unparse(Array.isArray(data) ? data : [data]);
          break;
        case "tsv":
          result = Papa.unparse(Array.isArray(data) ? data : [data], {
            delimiter: "\t",
          });
          break;
        case "xml":
          result = jsonToXML(data);
          break;
        case "toon":
          result = encode(data);
          break;
        default:
          throw new Error("Unsupported output format");
      }

      setOutputData(result);
    } catch (err: any) {
      setError(`Conversion error: ${err.message}`);
      setOutputData("");
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([outputData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${outputFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (format: string) => {
    if (format === "json-compact") return ".json";
    return `.${format}`;
  };

  // Estimate token count (approximate: ~4 chars per token for English)
  const estimateTokens = (text: string) => {
    if (!text) return 0;
    // More accurate estimation: count words and characters
    const words = text.trim().split(/\s+/).length;
    const chars = text.length;
    // Average: 1 token ≈ 0.75 words or 4 characters
    return Math.ceil(Math.max(words / 0.75, chars / 4));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold  mb-2">File Format Converter</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Convert between CSV, JSON, YAML, XML, and TSV formats
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">From</label>
              <select
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              >
                {formats.map((fmt) => (
                  <option key={fmt} value={fmt} className="dark:bg-gray-700">
                    {fmt.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <ArrowRight className="text-blue-500 mt-6" size={32} />

            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">To</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              >
                {formats.map((fmt) => (
                  <option key={fmt} value={fmt} className="dark:bg-gray-700">
                    {fmt.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <div className="flex flex-col items-center">
                <Upload className="text-gray-400 mb-2" size={32} />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {fileName ||
                    `Click to upload ${inputFormat.toUpperCase()} file`}
                </span>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept={getFileExtension(inputFormat)}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Input Data{" "}
                <span className="text-green-600 dark:text-green-400">
                  (Estimated Tokens: {estimateTokens(inputData)})
                </span>
              </label>
              <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder={`Paste your ${inputFormat.toUpperCase()} data here...`}
                className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Output Data{" "}
                <span className="text-green-600 dark:text-green-400">
                  (Estimated Tokens: {estimateTokens(outputData)})
                </span>
              </label>
              <textarea
                value={outputData}
                readOnly
                placeholder="Converted data will appear here..."
                className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={convert}
              disabled={!inputData}
              className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-500 transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              Convert
            </button>

            <button
              onClick={downloadOutput}
              disabled={!outputData}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed dark:disabled:bg-gray-500 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Supported Conversions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {formats.map((from) =>
              formats
                .filter((to) => to !== from)
                .map((to) => (
                  <div
                    key={`${from}-${to}`}
                    className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
                  >
                    {from.toUpperCase()} → {to.toUpperCase()}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
