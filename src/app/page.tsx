"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const designIntentSchema = z.object({
  application: z.string().min(2, "Required"),
  reynolds: z.string().min(1, "Required"),
  speed: z.string().min(1, "Required"),
  constraints: z.string().optional(),
});

type DesignIntent = z.infer<typeof designIntentSchema>;

type CopilotResult = {
  aerofoil: string;
  parameters: Record<string, string | number>;
  testMatrix: Array<Record<string, string | number>>;
};

export default function Home() {
  const [result, setResult] = useState<CopilotResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DesignIntent>({
    resolver: zodResolver(designIntentSchema),
  });

  async function onSubmit(data: DesignIntent) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to get suggestions");
      const json = await res.json();
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function download(format: "csv" | "json") {
    if (!result) return;
    if (format === "json") {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "winglab-copilot-result.json";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV for test matrix
      const rows = result.testMatrix;
      if (!rows.length) return;
      const header = Object.keys(rows[0]);
      const csv = [header.join(",")].concat(
        rows.map(row => header.map(h => row[h]).join(","))
      ).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "winglab-test-matrix.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              WingLab OS
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              AI copilot for aerofoil selection, iteration, and test planning.<br />
              <span className="text-sm text-zinc-500">Industry-grade, professional, and extensible.</span>
            </p>
          </div>

          <form
            className="w-full max-w-xl bg-white/[0.05] rounded-2xl shadow-xl ring-1 ring-white/[0.1] p-8 space-y-6 text-left"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Application</label>
              <input
                className="w-full rounded px-3 py-2 bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Formula Student rear wing, UAV, wind tunnel test"
                {...register("application")}
              />
              {errors.application && (
                <p className="text-red-400 text-xs mt-1">{errors.application.message}</p>
              )}
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-zinc-300 font-medium mb-1">Reynolds Number</label>
                <input
                  className="w-full rounded px-3 py-2 bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 500000"
                  {...register("reynolds")}
                />
                {errors.reynolds && (
                  <p className="text-red-400 text-xs mt-1">{errors.reynolds.message}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-zinc-300 font-medium mb-1">Speed (m/s)</label>
                <input
                  className="w-full rounded px-3 py-2 bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 60"
                  {...register("speed")}
                />
                {errors.speed && (
                  <p className="text-red-400 text-xs mt-1">{errors.speed.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Constraints (optional)</label>
              <input
                className="w-full rounded px-3 py-2 bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. max thickness, chord, etc."
                {...register("constraints")}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Aerofoil Suggestions"}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </form>

          {result && (
            <div className="w-full max-w-2xl bg-white/[0.07] rounded-2xl shadow-xl ring-1 ring-white/[0.1] p-8 mt-8 text-left">
              <h2 className="text-2xl font-bold text-white mb-4">AI Copilot Results</h2>
              <div className="mb-4">
                <span className="font-semibold text-zinc-300">Aerofoil:</span>
                <span className="ml-2 text-blue-300">{result.aerofoil}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-zinc-300">Parameters:</span>
                <ul className="ml-4 mt-1 text-zinc-200">
                  {Object.entries(result.parameters).map(([k, v]) => (
                    <li key={k}>
                      <span className="font-mono text-blue-200">{k}</span>: {v}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-zinc-300">Test Matrix:</span>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full text-sm text-zinc-100">
                    <thead>
                      <tr>
                        {Object.keys(result.testMatrix[0] || {}).map(h => (
                          <th key={h} className="px-2 py-1 bg-zinc-800 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.testMatrix.map((row, i) => (
                        <tr key={i} className="odd:bg-zinc-900 even:bg-zinc-800">
                          {Object.values(row).map((v, j) => (
                            <td key={j} className="px-2 py-1">{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  className="py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={() => download("csv")}
                >
                  Download Test Matrix (CSV)
                </button>
                <button
                  className="py-2 px-4 rounded bg-zinc-700 hover:bg-zinc-800 text-white font-semibold"
                  onClick={() => download("json")}
                >
                  Download Full Result (JSON)
                </button>
                <button
                  className="py-2 px-4 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold ml-auto"
                  onClick={() => { setResult(null); reset(); }}
                >
                  New Iteration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
