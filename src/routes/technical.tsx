import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Code2, Clock, Play, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/technical")({
  head: () => ({
    meta: [
      { title: "Technical Test — Placiora" },
      { name: "description", content: "Practice technical problems with an integrated editor and instant feedback." },
      { property: "og:title", content: "Technical Test — Placiora" },
      { property: "og:description", content: "Practice technical problems." },
    ],
  }),
  component: Technical,
});

function Technical() {
  return (
    <AppShell title="Technical Test">
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Code2 className="h-3.5 w-3.5 text-primary" /> Arrays · Medium</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> 42:11</span>
          </div>
          <h2 className="mt-4 text-xl font-semibold">Two Sum</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Given an array of integers <code className="text-primary">nums</code> and an integer <code className="text-primary">target</code>, return the indices of the two numbers such that they add up to <code className="text-primary">target</code>.
          </p>

          <div className="mt-5 space-y-3">
            <Example input="nums = [2,7,11,15], target = 9" output="[0,1]" />
            <Example input="nums = [3,2,4], target = 6" output="[1,2]" />
          </div>

          <div className="mt-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Constraints</div>
            <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>2 ≤ nums.length ≤ 10⁴</li>
              <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
              <li>Only one valid answer exists.</li>
            </ul>
          </div>
        </div>

        <div className="glass rounded-3xl p-4 flex flex-col">
          <div className="flex items-center justify-between px-2 py-1">
            <select className="glass rounded-lg px-3 py-1.5 text-xs bg-transparent outline-none">
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
            </select>
            <div className="flex gap-2">
              <button className="btn-ghost rounded-lg px-3 py-1.5 text-xs inline-flex items-center gap-1"><Play className="h-3.5 w-3.5" /> Run</button>
              <button className="btn-cyan rounded-lg px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Submit</button>
            </div>
          </div>
          <pre className="mt-3 flex-1 rounded-2xl bg-[color:var(--navy-deep)] p-4 text-xs leading-relaxed overflow-auto font-mono text-foreground/90">
{`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`}
          </pre>
          <div className="mt-3 rounded-2xl bg-white/5 p-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Console</div>
            <div className="mt-2 text-xs font-mono text-primary">✓ 2/2 sample tests passed · 0.3ms</div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Example({ input, output }: { input: string; output: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 text-xs font-mono">
      <div><span className="text-muted-foreground">Input:</span> {input}</div>
      <div className="mt-1"><span className="text-muted-foreground">Output:</span> <span className="text-primary">{output}</span></div>
    </div>
  );
}
