/**
 * 剧情卡片设计预览页 — 同时展示「弹窗」与「独立页」两种样式。
 * 访问 /story-card-preview
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PhoneMockup } from "@/components/PhoneMockup";
import { StoryCardModal, StoryCardPage, type StoryCardData } from "@/components/StoryCard";

export const Route = createFileRoute("/story-card-preview")({
  component: PreviewPage,
  ssr: false,
  head: () => ({ meta: [{ title: "剧情卡片样式预览" }] }),
});

const SAMPLE: StoryCardData = {
  chapter: "第二章 · 三",
  title: "梅园初遇",
  scene: "盛京 · 永宁侯府 · 寒梅小筑 · 卯时三刻",
  summary:
    "重生归来的温棠刻意避开正院请安，独自踱至寒梅小筑。她记得，正是在这一日，裴容会与她不期而遇——前世他递出的那枝梅，是她整个错误人生的开端。",
  memories: [
    { time: "前世·三月", text: "在此处接过裴容递来的红梅，自此心动。" },
    { time: "今晨", text: "于母亲灵前立誓，此生绝不再嫁裴家。" },
    { time: "昨夜", text: "得知陈嬷嬷暗中传递皇后赏赐，心生戒备。" },
  ],
  relation: {
    who: "裴容",
    change: "−2 信任",
    reason: "重生后第一次见他，刻意冷淡以打破前世惯性。",
  },
};

function PreviewPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showFullPage, setShowFullPage] = useState(false);

  if (showFullPage) {
    return (
      <PhoneMockup>
        <StoryCardPage
          data={SAMPLE}
          onContinue={() => setShowFullPage(false)}
          onBack={() => setShowFullPage(false)}
        />
      </PhoneMockup>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[oklch(0.96_0.01_55)] p-8">
      <div className="mx-auto max-w-5xl">
        <h1
          className="text-3xl text-[oklch(0.22_0.015_30)]"
          style={{ fontFamily: "'Ma Shan Zheng', serif" }}
        >
          剧情记忆卡 · 样式预览
        </h1>
        <p className="mt-2 text-sm text-[oklch(0.5_0.02_40)]">
          每个节点前后出现的「剧情上下文卡」，承载故事背景、当前记忆、关系流转三块信息。
          下方两种样式可点击查看。
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* 弹窗 */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">样式 A · 阻断式弹窗</h2>
              <span className="text-xs text-muted-foreground">推荐用于节点切换</span>
            </div>
            <p className="text-sm text-muted-foreground">
              覆盖在对话之上，水墨遮罩 + 模糊背景，强制用户阅读后点击「进入此节」继续。
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 rounded-xl bg-[oklch(0.42_0.11_22)] px-5 py-2.5 text-sm text-white shadow-md hover:brightness-110"
            >
              预览弹窗
            </button>
          </div>

          {/* 整页 */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">样式 B · 独立整页过场</h2>
              <span className="text-xs text-muted-foreground">推荐用于章节切换</span>
            </div>
            <p className="text-sm text-muted-foreground">
              占据整屏，仿宣纸卡片 + 四角点缀，作为章节之间的过场仪式感更强。
            </p>
            <button
              onClick={() => setShowFullPage(true)}
              className="mt-4 rounded-xl bg-[oklch(0.42_0.11_22)] px-5 py-2.5 text-sm text-white shadow-md hover:brightness-110"
            >
              预览整页
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-xl bg-[oklch(0.93_0.012_55)] p-5 text-sm text-[oklch(0.42_0.015_30)]">
          <strong>使用方式：</strong>
          <pre className="mt-2 overflow-x-auto rounded-md bg-[oklch(0.22_0.015_30)] p-3 text-[12px] text-[oklch(0.97_0.01_60)]">
{`import { StoryCardModal, StoryCardPage } from "@/components/StoryCard";

// 节点开始前：
<StoryCardModal open={showCard} data={nodeCard} onContinue={() => setShowCard(false)} />

// 章节过场：
<StoryCardPage data={chapterCard} onContinue={goNextChapter} />`}
          </pre>
        </div>
      </div>

      <StoryCardModal
        open={modalOpen}
        data={SAMPLE}
        onContinue={() => setModalOpen(false)}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
