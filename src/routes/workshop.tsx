import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ChevronLeft, Upload, Sparkles, FileText, Wand2 } from "lucide-react";
import { PhoneMockup } from "@/components/PhoneMockup";

export const Route = createFileRoute("/workshop")({
  component: WorkshopPage,
  head: () => ({
    meta: [{ title: "互动文游创作工作台" }],
  }),
});

function Workshop() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result ?? ""));
    reader.readAsText(f);
  };

  const canSubmit = text.trim().length > 20;

  return (
    <div className="relative h-full overflow-y-auto bg-[#fbf7ef] pb-10 no-scrollbar">
      <header className="sticky top-0 z-20 bg-[#fbf7ef]/90 px-5 pb-3 pt-12 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate({ to: "/hub" })}
            className="-ml-1 grid h-8 w-8 place-items-center"
            aria-label="返回"
          >
            <ChevronLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <h1 className="font-brush text-2xl text-neutral-900">创作工作台</h1>
        </div>
      </header>

      <section className="px-5 pt-2">
        <div className="rounded-2xl border border-black/5 bg-white p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: "var(--rouge)" }} />
            <span className="text-[12px] font-medium text-neutral-900">把你的小说变成互动文游</span>
          </div>
          <p className="mt-2 text-[12px] leading-5 text-neutral-500">
            上传小说文本，或直接粘贴正文。AI 会自动解析人物、场景与剧情，将其改编为可代入的互动文游。
          </p>
        </div>
      </section>

      <section className="mt-4 px-5">
        <button
          onClick={() => fileRef.current?.click()}
          className="flex w-full items-center justify-between rounded-2xl border border-dashed border-black/15 bg-white px-4 py-4 text-left transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-black/[0.05]">
              {fileName ? <FileText className="h-4 w-4 text-neutral-700" /> : <Upload className="h-4 w-4 text-neutral-700" />}
            </div>
            <div>
              <div className="text-[13px] font-medium text-neutral-900">
                {fileName ?? "上传小说文本"}
              </div>
              <div className="text-[11px] text-neutral-500">
                支持 .txt / .md 文本文件
              </div>
            </div>
          </div>
          <span className="text-[11px] text-neutral-400">选择文件</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.md,text/plain"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </section>

      <section className="mt-4 px-5">
        <label className="mb-2 block text-[12px] text-neutral-500">或直接粘贴正文</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在此粘贴小说正文，至少 20 个字……"
          className="h-56 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-[13px] leading-6 text-neutral-800 outline-none placeholder:text-neutral-300 focus:border-black/30"
        />
        <div className="mt-1 text-right text-[10px] text-neutral-400">{text.length} 字</div>
      </section>

      <section className="mt-4 px-5">
        <button
          disabled={!canSubmit}
          onClick={() => navigate({ to: "/adapt" })}
          className="group flex w-full items-center justify-between overflow-hidden rounded-2xl px-5 py-4 text-white shadow-[0_18px_40px_-12px_rgba(232,107,90,0.5)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          style={{ background: "var(--gradient-rouge)" }}
        >
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <span className="text-[14px] font-semibold">开始 AI 改编</span>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] backdrop-blur-md">
            下一步 →
          </span>
        </button>
        {!canSubmit && (
          <p className="mt-2 text-center text-[11px] text-neutral-400">请先上传或粘贴小说文本</p>
        )}
      </section>
    </div>
  );
}

function WorkshopPage() {
  return (
    <PhoneMockup>
      <Workshop />
    </PhoneMockup>
  );
}
