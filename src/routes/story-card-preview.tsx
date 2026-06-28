// 页面:剧情卡片样式预览(弹窗 / 独立页两种风格)  路由:/story-card-preview
/**
 * 剧情卡片设计预览页 — 展示「弹窗」与「独立页」两种样式。
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
    "重生归来的温棠刻意避开正院请安，独自踱至**寒梅小筑**。她记得，正是在这一日，裴容会与她不期而遇——前世他递出的那枝**红梅**，是她整个错误人生的开端。",
  memories: [
    { time: "前世", text: "在此处接过裴容递来的红梅，自此心动。" },
    { time: "今晨", text: "于母亲灵前立誓，此生绝不再嫁裴家。" },
    { time: "昨夜", text: "得知陈嬷嬷暗中传递皇后赏赐，心生戒备。" },
  ],
  relations: [
    { who: "裴容", relation: "疏离", reason: "重生后第一次见他，刻意冷淡以打破前世惯性。" },
    { who: "皇后", relation: "暗防", reason: "察觉赏赐另有图谋，不再如前世般领情。" },
  ],
};


function SectionTitle({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <div className="h-2 w-2 rotate-45 bg-[oklch(0.48_0.12_20)]" />
      <span
        className="text-[12px] tracking-[0.2em] text-[oklch(0.5_0.02_40)]"
        style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}
      >
        {number}
      </span>
      <div className="h-px w-12 bg-[oklch(0.88_0.012_50)]" />
      <h2
        className="text-lg tracking-wide text-[oklch(0.22_0.015_30)]"
        style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}
      >
        {children}
      </h2>
    </div>
  );
}

function VariantCard({
  number,
  title,
  subtitle,
  description,
  onPreview,
}: {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  onPreview: () => void;
}) {
  return (
    <div className="group flex flex-col">
      <div className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg border border-[oklch(0.88_0.012_50)] bg-[oklch(0.99_0.006_60)] p-6 transition-all duration-500 group-hover:border-[oklch(0.48_0.12_20/0.3)] group-hover:shadow-[var(--shadow-soft)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.95_0.012_55/0.8)] to-transparent" />
        <div className="relative z-10">
          <span
            className="mb-2 block text-3xl text-[oklch(0.48_0.12_20)]"
            style={{ fontFamily: "'Ma Shan Zheng', serif" }}
          >
            {number}
          </span>
          <h3
            className="text-xl text-[oklch(0.22_0.015_30)]"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            {title}
          </h3>
          <p
            className="mt-1 text-xs text-[oklch(0.5_0.02_40)]"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            {subtitle}
          </p>
          <p
            className="mt-3 text-sm leading-relaxed text-[oklch(0.42_0.015_30)]"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            {description}
          </p>
        </div>
      </div>
      <button
        onClick={onPreview}
        className="mt-4 w-full rounded-md border border-[oklch(0.22_0.015_30)] py-3 text-xs tracking-[0.2em] text-[oklch(0.22_0.015_30)] transition-colors hover:bg-[oklch(0.22_0.015_30)] hover:text-[oklch(0.97_0.01_60)]"
        style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}
      >
        预览样式
      </button>
    </div>
  );
}

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
    <div className="flex min-h-screen w-full items-center justify-center bg-[oklch(0.95_0.012_55)] p-6 md:p-10">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[18px] border border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] p-8 shadow-[var(--shadow-card)] md:p-12">
        {/*  faint decorative character */}
        <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 select-none opacity-5">
          <span
            className="text-[160px] leading-none text-[oklch(0.22_0.015_30)]"
            style={{ fontFamily: "'Ma Shan Zheng', serif" }}
          >
            卡
          </span>
        </div>

        {/* Header */}
        <header className="relative mb-14 text-center md:mb-16">
          <h1
            className="relative z-10 text-4xl text-[oklch(0.22_0.015_30)] md:text-6xl"
            style={{ fontFamily: "'Ma Shan Zheng', serif", letterSpacing: "0.04em" }}
          >
            剧情记忆卡
          </h1>
          <div className="mx-auto mt-3 h-px w-20 bg-[oklch(0.48_0.12_20/0.4)]" />
          <p
            className="mt-4 text-xs tracking-[0.3em] text-[oklch(0.5_0.02_40)]"
            style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}
          >
            组件库 · 样式预览
          </p>
        </header>

        {/* Variants */}
        <section className="mb-14 md:mb-16">
          <SectionTitle number="01">组件样式</SectionTitle>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <VariantCard
              number="一"
              title="阻断式弹窗"
              subtitle="StoryCardModal"
              description="覆盖在对话之上，水墨遮罩 + 模糊背景，强制用户阅读后点击「进入此节」继续。"
              onPreview={() => setModalOpen(true)}
            />
            <VariantCard
              number="二"
              title="独立整页过场"
              subtitle="StoryCardPage"
              description="占据整屏，仿宣纸卡片 + 四角点缀，作为章节切换的过场仪式感更强。"
              onPreview={() => setShowFullPage(true)}
            />
          </div>
        </section>

        {/* Usage */}
        <section>
          <SectionTitle number="02">使用方式</SectionTitle>
          <div className="relative overflow-hidden rounded-md bg-[oklch(0.22_0.015_30)] p-5 shadow-[0_10px_30px_-12px_oklch(0.22_0.015_30/0.4)]">
            <div className="mb-4 flex items-center justify-between border-b border-[oklch(0.97_0.01_60/0.1)] pb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[oklch(0.97_0.01_60/0.4)]">
                React / TypeScript
              </span>
              <span
                className="text-[10px] tracking-wider text-[oklch(0.97_0.01_60/0.5)]"
                style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}
              >
                复制到组件中
              </span>
            </div>
            <pre className="overflow-x-auto text-[13px] leading-relaxed text-[oklch(0.97_0.01_60/0.85)] font-mono">
{`import { StoryCardModal, StoryCardPage } from "@/components/StoryCard";

// 节点开始前：
<StoryCardModal
  open={showCard}
  data={nodeCard}
  onContinue={() => setShowCard(false)}
/>

// 章节过场：
<StoryCardPage
  data={chapterCard}
  onContinue={goNextChapter}
/>`}
            </pre>
          </div>
        </section>

        {/* Footer seal */}
        <div className="mt-14 flex justify-center md:mt-16">
          <div className="flex h-10 w-10 items-center justify-center rounded-[3px] border-2 border-[oklch(0.48_0.12_20)]">
            <span
              className="text-xl leading-none text-[oklch(0.48_0.12_20)]"
              style={{ fontFamily: "'Ma Shan Zheng', serif" }}
            >
              印
            </span>
          </div>
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
