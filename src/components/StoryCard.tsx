/**
 * StoryCard — 节点前后出现的「剧情记忆卡」
 *
 * 两个变体：
 *  - <StoryCardModal />  阻断式弹窗（覆盖在对话之上，需用户确认进入）
 *  - <StoryCardPage />   独立整页（用于章节切换的过场页）
 *
 * 内容契约（StoryCardData）：
 *  - chapter: 章节编号 / 标识，如 "第二章 · 二"
 *  - title:   场景标题
 *  - scene:   时间 · 地点
 *  - summary: 1–2 句剧情背景
 *  - memories: 当前记忆条目
 *  - relation:   关系流转（与谁、如何变化、为何变化）
 */
import { useEffect } from "react";
import { X, BookOpen, MapPin, Heart, ScrollText } from "lucide-react";

export type StoryCardData = {
  chapter: string;
  title: string;
  scene: string;
  summary: string;
  memories: { time: string; text: string }[];
  relation: { who: string; change: string; reason: string };
};

/* ────────────────────── 共用内部部件 ────────────────────── */

function Seal({ text }: { text: string }) {
  return (
    <div
      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] text-[11px] font-semibold leading-tight tracking-widest text-[oklch(0.97_0.01_60)] shadow-[0_4px_12px_-4px_oklch(0.42_0.11_22/0.55)]"
      style={{ background: "var(--gradient-rouge)", fontFamily: "'Ma Shan Zheng', serif" }}
    >
      <span className="writing-vertical text-center">{text}</span>
    </div>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[oklch(0.48_0.12_20)]">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
      <span style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>{children}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-[oklch(0.48_0.12_20/0.4)] to-transparent" />
    </div>
  );
}

function CardBody({ data, compact = false }: { data: StoryCardData; compact?: boolean }) {
  return (
    <div className="relative">
      {/* 顶部章节条 */}
      <div className="flex items-start gap-3">
        <Seal text="温棠记" />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] tracking-[0.3em] text-[oklch(0.5_0.02_40)]">
            {data.chapter}
          </div>
          <h2
            className="mt-1 truncate text-2xl text-[oklch(0.22_0.015_30)]"
            style={{ fontFamily: "'Ma Shan Zheng', serif", letterSpacing: "0.04em" }}
          >
            {data.title}
          </h2>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[oklch(0.5_0.02_40)]">
            <MapPin className="h-3 w-3" strokeWidth={1.6} />
            <span>{data.scene}</span>
          </div>
        </div>
      </div>

      {/* 分隔 */}
      <div className="my-4 flex items-center gap-2">
        <div className="h-px flex-1 bg-[oklch(0.88_0.012_50)]" />
        <div className="h-1.5 w-1.5 rotate-45 bg-[oklch(0.72_0.08_75)]" />
        <div className="h-px flex-1 bg-[oklch(0.88_0.012_50)]" />
      </div>

      {/* 1. 故事背景 */}
      <div className={compact ? "space-y-2.5" : "space-y-3"}>
        <SectionLabel icon={BookOpen}>故事背景</SectionLabel>
        <p
          className="text-[15px] leading-7 text-[oklch(0.32_0.015_30)] first-letter:text-[26px] first-letter:font-semibold first-letter:text-[oklch(0.48_0.12_20)]"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          {data.summary}
        </p>
      </div>

      {/* 2. 当前记忆 */}
      <div className={`mt-${compact ? 4 : 6} space-y-2.5`}>
        <SectionLabel icon={ScrollText}>当前记忆</SectionLabel>
        <ul className="space-y-2 pl-1">
          {data.memories.map((m, i) => (
            <li key={i} className="flex gap-3 text-[13.5px] leading-6">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[oklch(0.48_0.12_20)]" />
              <span className="shrink-0 text-[11px] tracking-wider text-[oklch(0.5_0.02_40)] tabular-nums">
                {m.time}
              </span>
              <span className="text-[oklch(0.32_0.015_30)]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                {m.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. 关系流转（全宽，不左右分栏） */}
      <div className={`mt-${compact ? 4 : 6} rounded-lg border border-[oklch(0.88_0.012_50)] bg-[oklch(0.95_0.012_55/0.6)] p-3.5`}>
        <SectionLabel icon={Heart}>关系流转</SectionLabel>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm text-[oklch(0.5_0.02_40)]">与{data.relation.who}</span>
          <span
            className="text-lg text-[oklch(0.48_0.12_20)]"
            style={{ fontFamily: "'Ma Shan Zheng', serif" }}
          >
            {data.relation.change}
          </span>
        </div>
        <p
          className="mt-1 text-[13px] leading-6 text-[oklch(0.42_0.015_30)]"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          {data.relation.reason}
        </p>
      </div>
    </div>
  );
}

/* ────────────────────── 变体一：阻断式弹窗 ────────────────────── */

export function StoryCardModal({
  open,
  data,
  onContinue,
  onClose,
  ctaLabel = "进入此节",
}: {
  open: boolean;
  data: StoryCardData;
  onContinue: () => void;
  onClose?: () => void;
  ctaLabel?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* 水墨遮罩 */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 30%, oklch(0.22 0.015 30 / 0.55), oklch(0.12 0.02 30 / 0.85))",
          backdropFilter: "blur(6px)",
        }}
        onClick={onClose}
      />
      {/* 卡片 */}
      <div
        className="relative z-10 mx-4 w-full max-w-[360px] animate-scale-in overflow-hidden rounded-2xl border border-[oklch(0.88_0.012_50)] bg-[var(--paper)] p-5 shadow-[var(--shadow-card)]"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 0% 0%, oklch(0.95 0.02 60 / 0.6), transparent 50%), radial-gradient(120% 80% at 100% 100%, oklch(0.88 0.04 20 / 0.25), transparent 60%)",
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full p-1 text-[oklch(0.5_0.02_40)] transition hover:bg-[oklch(0.88_0.012_50/0.6)] hover:text-[oklch(0.22_0.015_30)]"
            aria-label="关闭"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-[oklch(0.48_0.12_20)]">
          <BookOpen className="h-3 w-3" />
          剧情记忆 · 阅读后继续
        </div>

        <CardBody data={data} compact />

        <button
          onClick={onContinue}
          className="mt-6 w-full rounded-xl py-3 text-sm font-medium tracking-[0.3em] text-[oklch(0.97_0.01_60)] shadow-[0_8px_24px_-8px_oklch(0.42_0.11_22/0.55)] transition hover:brightness-110"
          style={{ background: "var(--gradient-rouge)" }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

/* ────────────────────── 变体二：独立整页过场 ────────────────────── */

export function StoryCardPage({
  data,
  onContinue,
  onBack,
  ctaLabel = "继续故事",
}: {
  data: StoryCardData;
  onContinue: () => void;
  onBack?: () => void;
  ctaLabel?: string;
}) {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-y-auto"
      style={{
        background:
          "radial-gradient(140% 80% at 50% 0%, oklch(0.95 0.025 60), oklch(0.93 0.018 55) 60%, oklch(0.88 0.025 30) 100%)",
      }}
    >
      {/* 上下水墨装饰条 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[oklch(0.22_0.015_30/0.18)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[oklch(0.22_0.015_30/0.12)] to-transparent" />

      {/* 顶部导航 */}
      <div className="relative z-10 flex items-center justify-between px-5 py-4">
        <button
          onClick={onBack}
          className="text-[12px] tracking-[0.3em] text-[oklch(0.5_0.02_40)] transition hover:text-[oklch(0.22_0.015_30)]"
        >
          ← 返回
        </button>
        <div className="text-[10px] uppercase tracking-[0.4em] text-[oklch(0.48_0.12_20)]">
          剧情过场
        </div>
        <div className="w-10" />
      </div>

      {/* 卡片容器 */}
      <div className="relative z-10 flex flex-1 flex-col px-5 pb-6">
        <div
          className="relative flex-1 rounded-[18px] border border-[oklch(0.88_0.012_50)] bg-[var(--paper)] p-6 shadow-[var(--shadow-card)]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, oklch(0.99 0.006 60) 0%, oklch(0.96 0.014 55) 100%)",
          }}
        >
          {/* 四角点缀 */}
          {[
            "left-2 top-2 border-l border-t",
            "right-2 top-2 border-r border-t",
            "left-2 bottom-2 border-l border-b",
            "right-2 bottom-2 border-r border-b",
          ].map((cls) => (
            <span
              key={cls}
              className={`pointer-events-none absolute h-3 w-3 border-[oklch(0.48_0.12_20/0.5)] ${cls}`}
            />
          ))}

          <CardBody data={data} />
        </div>

        <button
          onClick={onContinue}
          className="mt-5 w-full rounded-xl py-3.5 text-sm font-medium tracking-[0.4em] text-[oklch(0.97_0.01_60)] shadow-[0_10px_30px_-10px_oklch(0.42_0.11_22/0.6)] transition hover:brightness-110"
          style={{ background: "var(--gradient-rouge)" }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
