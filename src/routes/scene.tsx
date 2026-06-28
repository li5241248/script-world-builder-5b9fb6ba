// 页面:剧情场景对话(AI 实时叙事 / 选择 / 输入行动)  路由:/scene
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, MoreHorizontal, Send, Sparkles, Mic, BookOpen, Feather, Lightbulb, Asterisk, Clock, X, UserPlus, Check, ScrollText, History, Gauge, Heart, Eye as EyeIcon, MessageCircle, Swords, Brain, Crown, MapPin } from "lucide-react";
import { PhoneMockup } from "@/components/PhoneMockup";
import sceneBg from "@/assets/scene-cijitang.png";
import actorAvatar from "@/assets/actor-avatar.png";
import { CHARACTERS, getCharacter } from "@/lib/characters";
import { StoryCardModal, type StoryCardData } from "@/components/StoryCard";

/* ─── Shared paper-tone tokens ─── */
const FONT_TITLE = { fontFamily: "'Ma Shan Zheng', serif" } as const;
const FONT_BODY = { fontFamily: "'Noto Serif SC', serif" } as const;
const FONT_LABEL = { fontFamily: "'ZCOOL XiaoWei', serif" } as const;

const PAPER_CARD =
  "rounded-2xl border border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] shadow-[0_8px_28px_-12px_oklch(0.22_0.015_30/0.5)]";
const INK = "text-[oklch(0.22_0.015_30)]";
const INK_SOFT = "text-[oklch(0.42_0.015_30)]";
const MUTED = "text-[oklch(0.5_0.02_40)]";
const ROUGE = "text-[oklch(0.48_0.12_20)]";

/* 标签条（仿 StoryCard SectionLabel） */
function SectionLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[oklch(0.48_0.12_20)]">
      <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
      <span style={FONT_LABEL}>{children}</span>
      <div className="h-px flex-1 bg-gradient-to-r from-[oklch(0.48_0.12_20/0.4)] to-transparent" />
    </div>
  );
}

/* 顶部小圆按钮（深底 → 改为 paper 风格 chip） */
function HeaderChip({ children, onClick, ariaLabel }: { children: React.ReactNode; onClick?: () => void; ariaLabel?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] text-[oklch(0.22_0.015_30)] shadow-[0_4px_14px_-6px_oklch(0.22_0.015_30/0.6)] backdrop-blur active:scale-95"
    >
      {children}
    </button>
  );
}

const ACT_INTRO: StoryCardData = {
  chapter: "第二幕 · 幕前",
  title: "暗 流 涌 动",
  scene: "庄府 · 正堂 · 周氏入府次日",
  summary:
    "母丧未远，姨娘携庶妹昂然入府。寒雁知道，这一幕的真正**较量**不在堂前的茶水寒暄，而在那双盯着**掌家钥匙**的眼睛里。",
  memories: [
    { time: "前夜", text: "梦回十三岁，母亲灵前血书未冷。" },
    { time: "今晨", text: "周氏一句『以后就是你母亲』，定下今日基调。" },
    { time: "昨日", text: "庄思言把账册悄悄藏进了书房第三格。" },
  ],
  relations: [
    { who: "周姨娘", relation: "试探期", reason: "前世她笑里藏刀，此世我笑得比她更早。" },
    { who: "庄思言", relation: "暗盟", reason: "幼妹未涉深水，仍是可拉拢的同盟。" },
  ],
};


const ACT_OUTRO: StoryCardData = {
  chapter: "第二幕 · 幕后",
  title: "钥 已 易 主",
  scene: "庄府 · 偏厅 · 申时",
  summary:
    "一席话毕，父亲沉吟未决，周氏面色微变。这一幕你赢下了**第一回合**——却也让她看清，你不再是前世那个任人拿捏的孩子。",
  memories: [
    { time: "方才", text: "在父亲面前，你第一次说出『母亲』二字时停顿了半息。" },
    { time: "此刻", text: "掌家钥匙仍在父亲手中，但他的目光已开始游移。" },
  ],
  relations: [
    { who: "周姨娘", relation: "戒备", reason: "她意识到这个继女比传闻中难缠，开始重新部署。" },
    { who: "父亲", relation: "动摇", reason: "他第一次正视你眼底的锋芒，开始重新衡量。" },
  ],
};


export const Route = createFileRoute("/scene")({
  component: ScenePage,
  head: () => ({
    meta: [
      { title: "第一幕 · 重生之贵女难求" },
      { name: "description", content: "入梦画堂，开启你的角色对话。" },
    ],
  }),
});

type Msg =
  | { kind: "narration"; text: string }
  | { kind: "dialog"; charId: string; text: string }
  | { kind: "action"; charId: string; text: string }
  | { kind: "prompt"; text: string }
  | { kind: "me"; text: string; mode: "say" | "do" }
  | { kind: "reward"; affinities: { charId: string; delta: number }[]; unlock?: string }
  | { kind: "notice"; text: string };

const INITIAL: Msg[] = [
  {
    kind: "narration",
    text: "母亲新丧，庄寒雁一觉醒来，竟回到了十三岁那年。窗外阴云未散，府里却已是另一番热闹——周氏带着庄语山，正抬着箱笼，浩浩荡荡地踏进庄府大门。",
  },
  { kind: "dialog", charId: "zhouyi", text: "雁姐儿，姨娘以后就是你母亲了，往后咱们一家人，可要好好亲香。" },
  { kind: "dialog", charId: "zhuangsy", text: "寒雁，你母亲走了，府里以后由周氏打理，你这做姐姐的，要懂事。" },
  { kind: "prompt", text: "听到这番话，你心里……" },
];

const ACTORS: Record<string, string> = {
  zhuangsy: "@玄夜听雪",
  moshen: "@少年执灯人",
  yushan: "@玉折",
  zhouyi: "@凤栖梧",
  hanyan: "@沐雨",
};

const IS_HUMAN: Record<string, boolean> = {
  hanyan: true,
  zhuangsy: true,
  moshen: true,
};

function ActorTag({ human }: { human: boolean }) {
  if (human) return null;
  return (
    <span className="mt-1 inline-flex items-center justify-center rounded-full border border-[oklch(0.48_0.12_20/0.35)] bg-[oklch(0.985_0.006_60)] px-1.5 py-[1px] text-[8px] leading-none tracking-wider text-[oklch(0.48_0.12_20)]">
      AI
    </span>
  );
}

export function Scene() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const [pickedPromptIdx, setPickedPromptIdx] = useState<number | null>(null);
  const [panelCharId, setPanelCharId] = useState<string | null>(null);
  const [recapOpen, setRecapOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [actIntroOpen, setActIntroOpen] = useState(true);
  const [actOutroOpen, setActOutroOpen] = useState(false);

  useEffect(() => {
    if (messages.some((m) => m.kind === "reward")) {
      const t = setTimeout(() => setActOutroOpen(true), 1800);
      return () => clearTimeout(t);
    }
  }, [messages]);

  const mode = "multi" as "solo" | "multi";
  const ACT_SECONDS = 20 * 60;
  const [remaining, setRemaining] = useState(ACT_SECONDS);
  useEffect(() => {
    if (mode === "solo") return;
    const t = setInterval(() => setRemaining((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [mode]);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const lowTime = mode !== "solo" && remaining <= 60;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const detectMode = (raw: string): { mode: "say" | "do"; text: string } => {
    const t = raw.trim();
    const m = t.match(/^（([\s\S]+)）$/);
    if (m) return { mode: "do", text: m[1].trim() };
    return { mode: "say", text: t };
  };

  const insertActionMarkers = () => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    const before = input.slice(0, start);
    const selected = input.slice(start, end);
    const after = input.slice(end);
    const next = `${before}（${selected}）${after}`;
    setInput(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = before.length + 1 + selected.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const send = () => {
    const { mode, text } = detectMode(input);
    if (!text) return;
    if (text === "结局" || text === "结局。") { setInput(""); navigate({ to: "/ending" }); return; }
    if (text === "小游戏" || text === "小游戏。") { setInput(""); navigate({ to: "/minigame" }); return; }
    if (text === "真人扮演") {
      setInput("");
      setMessages((prev) => [...prev, { kind: "notice", text: "下 面 进 入 真 人 扮 演 环 节 · 皇 上 / 温 棠" }]);
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          { kind: "action", charId: "zhuangsy", text: "缓步上前，指尖挑起她的下颌，眸光深沉。" },
          { kind: "dialog", charId: "zhuangsy", text: "抬起头来，让朕好好看看你。" },
        ]);
      }, 700);
      return;
    }
    setMessages((prev) => {
      const filtered = pickedPromptIdx !== null ? prev.filter((_, i) => i !== pickedPromptIdx) : prev;
      return [...filtered, { kind: "me", text, mode }];
    });
    setInput("");
    setPickedPromptIdx(null);
    setTimeout(() => {
      setMessages((m) => [...m, { kind: "dialog", charId: "zhuangsy", text: "嗯……你倒是比朕想的更沉得住气。" }]);
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          { kind: "reward", affinities: [{ charId: "zhuangsy", delta: 10 }, { charId: "moshen", delta: 15 }], unlock: "采桑宫温居" },
        ]);
      }, 700);
    }, 900);
  };

  const pickHint = (promptIndex: number, text: string) => {
    const wrapped = /^（[\s\S]+）/.test(text) ? text : `（${text}）`;
    setInput(wrapped);
    setPickedPromptIdx(promptIndex);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(wrapped.length, wrapped.length);
    });
  };

  return (
    <div className="relative h-full overflow-hidden bg-neutral-900 text-white">
      <img src={sceneBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {/* 加深一些，让 paper 模块更突出 */}
      <div className="absolute inset-0 bg-black/35" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.18 0.02 30 / 0.55) 0%, oklch(0.18 0.02 30 / 0) 18%, oklch(0.18 0.02 30 / 0) 60%, oklch(0.15 0.02 30 / 0.75) 100%)",
        }}
      />

      {/* header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-3">
        <HeaderChip onClick={() => navigate({ to: "/lobby" })} ariaLabel="返回">
          <ChevronLeft size={18} />
        </HeaderChip>
        <div className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 text-center">
          <div
            className="text-[11px] tracking-[0.3em] text-[oklch(0.97_0.01_60)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
            style={FONT_LABEL}
          >
            第二幕
          </div>
          <div
            className="text-[20px] tracking-[0.2em] text-[oklch(0.97_0.01_60)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
            style={FONT_TITLE}
          >
            暗 流 涌 动
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <HeaderChip onClick={() => setStatsOpen(true)} ariaLabel="玩家数值">
            <Gauge size={16} />
          </HeaderChip>
          <HeaderChip onClick={() => setRecapOpen(true)} ariaLabel="剧情回溯">
            <History size={16} />
          </HeaderChip>
          <HeaderChip ariaLabel="更多">
            <MoreHorizontal size={18} />
          </HeaderChip>
        </div>
      </div>

      {/* 时间 + 幕进度 — paper pill */}
      <div className="relative z-10 mx-4 mb-2 flex items-center justify-center">
        <div
          className={`flex items-center gap-2.5 rounded-full border border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] px-3 py-1 text-[11px] shadow-[0_4px_14px_-6px_oklch(0.22_0.015_30/0.5)] ${INK_SOFT}`}
          title="单人无时间限制；双人 / 多人每幕 ≤ 20 分钟"
          style={FONT_LABEL}
        >
          <span className={`flex items-center gap-1.5 ${lowTime ? "text-[oklch(0.48_0.12_20)]" : ""}`}>
            <Clock size={11} />
            {mode === "solo" ? (
              <span>本幕剩余　不限时</span>
            ) : (
              <span>
                本幕剩余 <span className="font-mono tabular-nums">{mm}:{ss}</span>
              </span>
            )}
          </span>
          <span className="h-3 w-px bg-[oklch(0.88_0.012_50)]" />
          <span className="flex items-center gap-1.5">
            <BookOpen size={11} className="opacity-80" />
            <span className="flex items-center gap-[3px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-1 rounded-full ${i === 0 ? "bg-[oklch(0.48_0.12_20)]" : "bg-[oklch(0.88_0.012_50)]"}`}
                />
              ))}
            </span>
            <span className="font-mono tabular-nums">1/6</span>
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto px-4 pb-32"
        style={{ height: "calc(100% - 200px)" }}
      >
        <div className="space-y-5 py-2">
          {messages.map((m, i) => (
            <Bubble
              key={i}
              m={m}
              picked={pickedPromptIdx === i}
              onPickHint={(text) => pickHint(i, text)}
              onAvatarClick={(id) => setPanelCharId(id)}
            />
          ))}
        </div>
      </div>

      {/* 小游戏入口 */}
      <div className="absolute bottom-20 left-3 z-20 flex items-center gap-2">
        <button
          onClick={() => navigate({ to: "/minigame" })}
          className={`flex items-center gap-1.5 rounded-full border border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] px-2.5 py-1 text-[11px] shadow-[0_4px_14px_-6px_oklch(0.22_0.015_30/0.5)] ${ROUGE} active:scale-95`}
          style={FONT_LABEL}
        >
          <Sparkles size={11} />
          <span>小游戏</span>
        </button>
        <button
          onClick={() => navigate({ to: "/minigame2" })}
          className={`flex items-center gap-1.5 rounded-full border border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] px-2.5 py-1 text-[11px] shadow-[0_4px_14px_-6px_oklch(0.22_0.015_30/0.5)] ${ROUGE} active:scale-95`}
          style={FONT_LABEL}
        >
          <Sparkles size={11} />
          <span>小游戏2</span>
        </button>
      </div>

      {/* 输入栏 — paper 风格 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 border-t border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] px-3 pb-6 pt-3"
        style={{ backgroundImage: "linear-gradient(180deg, oklch(0.99 0.006 60) 0%, oklch(0.95 0.012 55) 100%)" }}
      >
        <div className="flex items-center gap-2 w-full min-w-0">
          <button
            aria-label="语音输入"
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[oklch(0.88_0.012_50)] bg-[oklch(0.95_0.012_55)] ${INK_SOFT} active:scale-95`}
          >
            <Mic size={17} />
          </button>

          <div className="flex flex-1 min-w-0 items-center gap-2 rounded-full border border-[oklch(0.88_0.012_50)] bg-[oklch(0.99_0.006_60)] px-3 py-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="以庄寒雁的身份开口，或点（）输入动作"
              className={`flex-1 min-w-0 bg-transparent text-[13px] outline-none placeholder:text-[oklch(0.55_0.02_40)] ${INK}`}
              style={FONT_BODY}
            />
            <button
              onClick={insertActionMarkers}
              aria-label="输入动作"
              title="输入动作（包在（）之间）"
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${MUTED} hover:text-[oklch(0.22_0.015_30)] active:scale-95`}
            >
              <Asterisk size={15} />
            </button>
          </div>
          <button
            onClick={send}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[oklch(0.97_0.01_60)] shadow-[0_4px_14px_-4px_oklch(0.42_0.11_22/0.6)] active:scale-95"
            style={{ background: "var(--gradient-rouge)" }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {panelCharId && <CharacterPanel charId={panelCharId} onClose={() => setPanelCharId(null)} />}
      {recapOpen && <RecapPanel onClose={() => setRecapOpen(false)} />}
      {statsOpen && <StatsPanel onClose={() => setStatsOpen(false)} />}

      <StoryCardModal
        open={actIntroOpen}
        data={ACT_INTRO}
        onContinue={() => setActIntroOpen(false)}
        ctaLabel="入幕"
      />

      <StoryCardModal
        open={actOutroOpen}
        data={ACT_OUTRO}
        onContinue={() => {
          setActOutroOpen(false);
          navigate({ to: "/lobby" });
        }}
        onClose={() => setActOutroOpen(false)}
        ctaLabel="进入下一幕"
      />

      <button
        onClick={() => setActOutroOpen(true)}
        className={`absolute bottom-20 right-3 z-20 rounded-full border border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] px-2.5 py-1 text-[11px] shadow-[0_4px_14px_-6px_oklch(0.22_0.015_30/0.5)] ${ROUGE} active:scale-95`}
        style={FONT_LABEL}
      >
        结束本幕
      </button>
    </div>
  );
}

/* ────────────────── 消息气泡 ────────────────── */

function Bubble({
  m,
  picked,
  onPickHint,
  onAvatarClick,
}: {
  m: Msg;
  picked?: boolean;
  onPickHint?: (text: string) => void;
  onAvatarClick?: (id: string) => void;
}) {
  if (m.kind === "narration") {
    return (
      <div className="mx-auto max-w-[92%]">
        <div className={`${PAPER_CARD} px-5 py-4`}>
          <div className="mb-2 flex items-center gap-2">
            <ScrollText className={`h-3.5 w-3.5 ${ROUGE}`} strokeWidth={1.6} />
            <span className={`text-[10px] uppercase tracking-[0.32em] ${ROUGE}`} style={FONT_LABEL}>
              旁 白
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[oklch(0.48_0.12_20/0.35)] to-transparent" />
          </div>
          <p className={`text-[13.5px] leading-7 ${INK_SOFT}`} style={FONT_BODY}>
            {m.text}
          </p>
        </div>
      </div>
    );
  }

  if (m.kind === "me") {
    const me = getCharacter("hanyan")!;
    return (
      <div className="flex justify-end gap-2">
        <div className="max-w-[78%]">
          {m.mode === "do" ? (
            <div
              className="rounded-2xl rounded-tr-md border border-[oklch(0.48_0.12_20/0.4)] bg-[oklch(0.95_0.012_55)] px-4 py-2.5 text-[13px] italic text-[oklch(0.42_0.015_30)] shadow-[0_4px_14px_-6px_oklch(0.22_0.015_30/0.5)]"
              style={FONT_BODY}
            >
              （{m.text}）
            </div>
          ) : (
            <div
              className="rounded-2xl rounded-tr-md px-4 py-2.5 text-[14px] leading-relaxed text-[oklch(0.97_0.01_60)] shadow-[0_6px_18px_-6px_oklch(0.42_0.11_22/0.6)]"
              style={{ background: "var(--gradient-rouge)", ...FONT_BODY }}
            >
              {m.text}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <img
            src={me.img}
            alt={me.name}
            className="h-9 w-9 flex-shrink-0 rounded-full object-cover ring-1 ring-[oklch(0.88_0.012_50)]"
          />
          <ActorTag human={IS_HUMAN[me.id] ?? false} />
        </div>
      </div>
    );
  }

  if (m.kind === "prompt") {
    const [open, setOpen] = useState(false);
    const hints = [
      "（欣然应允）臣妾愿悉心照料琰儿。",
      "（犹豫试探）陛下，琰儿乃皇子，臣妾恐难当此任。",
      "（婉言拒绝）臣妾只想盼着瑜儿回心转意。",
    ];
    return (
      <div className="my-3 animate-fade-up">
        <div className={`${PAPER_CARD} px-5 py-4`}>
          <SectionLabel icon={Feather}>剧 情 提 示</SectionLabel>
          <div className="mt-3 flex items-center gap-3">
            <p className={`flex-1 text-[14px] leading-snug ${INK}`} style={FONT_BODY}>
              {m.text}
            </p>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="灵感提示"
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[oklch(0.48_0.12_20/0.35)] bg-[oklch(0.95_0.012_55)] ${ROUGE} active:scale-95`}
            >
              <Lightbulb size={15} />
            </button>
          </div>
        </div>
        {open && !picked && (
          <div className="mt-3 space-y-2 animate-fade-up">
            {hints.map((title) => (
              <button
                key={title}
                onClick={() => onPickHint?.(title)}
                className={`block w-full rounded-xl border border-[oklch(0.88_0.012_50)] bg-[oklch(0.99_0.006_60)] px-4 py-2.5 text-left text-[14px] ${INK} shadow-[0_4px_14px_-6px_oklch(0.22_0.015_30/0.4)] transition active:scale-[0.99] hover:border-[oklch(0.48_0.12_20/0.4)]`}
                style={FONT_BODY}
              >
                {title}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (m.kind === "reward") {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
      const t = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(t);
    }, []);
    if (!visible) return null;
    return (
      <div className="my-2 flex justify-center animate-fade-up">
        <div className={`${PAPER_CARD} max-w-[92%] px-5 py-3 text-center`}>
          <div className="mb-2 flex items-center justify-center gap-2">
            <Heart size={11} className={ROUGE} />
            <span className={`text-[10px] tracking-[0.32em] ${ROUGE}`} style={FONT_LABEL}>
              情 缘 流 转
            </span>
            <Heart size={11} className={ROUGE} />
          </div>
          <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12.5px] ${INK}`} style={FONT_BODY}>
            {m.affinities.map((a) => {
              const ch = getCharacter(a.charId);
              return (
                <span key={a.charId} className="inline-flex items-center gap-1">
                  {ch && <img src={ch.img} alt={ch.name} className="h-4 w-4 rounded-full object-cover" />}
                  <span>{ch?.name ?? a.charId}</span>
                  <span className={`font-mono tabular-nums ${ROUGE}`}>亲密度 +{a.delta}</span>
                </span>
              );
            })}
          </div>
          {m.unlock && (
            <div className={`mt-1.5 text-[11px] ${INK_SOFT}`} style={FONT_BODY}>
              解锁剧情 <span className={`${ROUGE}`} style={FONT_TITLE}>「{m.unlock}」</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (m.kind === "notice") {
    return (
      <div className="my-3 flex justify-center animate-fade-up">
        <div
          className={`rounded-full border border-[oklch(0.48_0.12_20/0.35)] bg-[oklch(0.985_0.006_60)] px-4 py-1.5 text-[11px] tracking-[0.2em] ${ROUGE} shadow-[0_4px_14px_-6px_oklch(0.22_0.015_30/0.5)]`}
          style={FONT_LABEL}
        >
          {m.text}
        </div>
      </div>
    );
  }

  const c = getCharacter(m.charId) ?? CHARACTERS[0];
  const avatarBtn = (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onAvatarClick?.(c.id)}
        className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-[oklch(0.88_0.012_50)] active:scale-95"
        aria-label={`查看 ${c.name}`}
      >
        <img src={c.img} alt={c.name} className="h-full w-full object-cover" />
      </button>
      <ActorTag human={IS_HUMAN[c.id] ?? false} />
    </div>
  );

  if (m.kind === "action") {
    return (
      <div className="flex gap-2">
        {avatarBtn}
        <div className="max-w-[78%]">
          <div
            className="rounded-2xl rounded-tl-md border border-dashed border-[oklch(0.48_0.12_20/0.45)] bg-[oklch(0.95_0.012_55)] px-4 py-2.5 text-[13px] italic text-[oklch(0.42_0.015_30)] shadow-[0_4px_14px_-6px_oklch(0.22_0.015_30/0.45)]"
            style={FONT_BODY}
          >
            （{m.text}）
          </div>
        </div>
      </div>
    );
  }

  // dialog (角色)
  return (
    <div className="flex gap-2">
      {avatarBtn}
      <div className="max-w-[80%]">
        <div className={`mb-1 text-[10px] tracking-[0.18em] ${MUTED}`} style={FONT_LABEL}>
          {c.name}
        </div>
        <div
          className={`rounded-2xl rounded-tl-md border border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] px-4 py-2.5 text-[14px] leading-relaxed ${INK} shadow-[0_6px_18px_-8px_oklch(0.22_0.015_30/0.55)]`}
          style={FONT_BODY}
        >
          {m.text}
        </div>
      </div>
    </div>
  );
}

/* ────────────────── 角色面板 ────────────────── */

function CharacterPanel({ charId, onClose }: { charId: string; onClose: () => void }) {
  const c = getCharacter(charId);
  const [followed, setFollowed] = useState(false);
  if (!c) return null;
  const actor = ACTORS[charId] ?? "@匿名玩家";
  return (
    <div className="absolute inset-0 z-30 bg-[oklch(0.95_0.012_55)] animate-fade-in">
      <button
        onClick={onClose}
        className={`absolute left-4 top-12 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] ${INK} shadow-[0_4px_14px_-6px_oklch(0.22_0.015_30/0.5)] active:scale-95`}
        aria-label="关闭"
      >
        <X size={18} />
      </button>

      <div className="absolute inset-0 overflow-y-auto">
        <div className="relative h-72 w-full">
          <img src={c.img} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.22 0.015 30 / 0.15) 0%, oklch(0.22 0.015 30 / 0) 40%, oklch(0.95 0.012 55) 100%)" }} />
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="text-[28px] tracking-[0.2em] text-[oklch(0.97_0.01_60)] drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]" style={FONT_TITLE}>
              {c.name}
            </div>
            <div className="mt-1 text-[11px] tracking-[0.3em] text-[oklch(0.97_0.01_60)] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" style={FONT_LABEL}>
              {c.role}
            </div>
          </div>
        </div>

        <div className="px-5 pb-10">
          {/* 扮演者 */}
          <div className={`${PAPER_CARD} -mt-4 flex items-center justify-between px-4 py-3 relative z-10`}>
            <div className="flex items-center gap-2.5">
              <img src={actorAvatar} alt={actor} className="h-10 w-10 rounded-full object-cover ring-1 ring-[oklch(0.88_0.012_50)]" />
              <div>
                <div className={`text-[14px] font-medium ${INK}`} style={FONT_BODY}>{actor}</div>
                <div className={`text-[10px] ${MUTED}`} style={FONT_LABEL}>知乎 · 扮演者</div>
              </div>
            </div>
            <button
              onClick={() => setFollowed((v) => !v)}
              className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-[12px] font-medium transition active:scale-95 ${
                followed
                  ? `border border-[oklch(0.88_0.012_50)] bg-[oklch(0.95_0.012_55)] ${INK_SOFT}`
                  : "text-[oklch(0.97_0.01_60)] shadow-[0_4px_14px_-4px_oklch(0.42_0.11_22/0.6)]"
              }`}
              style={followed ? undefined : { background: "var(--gradient-rouge)" }}
            >
              {followed ? (<><Check size={13} /> 已添加</>) : (<><UserPlus size={13} /> 添加好友</>)}
            </button>
          </div>

          {c.motto && (
            <div className={`${PAPER_CARD} mt-4 px-5 py-4 text-center`}>
              <p className={`text-[15px] leading-relaxed ${ROUGE}`} style={FONT_TITLE}>{c.motto}</p>
            </div>
          )}

          <div className={`${PAPER_CARD} mt-4 px-5 py-4`}>
            <SectionLabel icon={BookOpen}>人 物 简 介</SectionLabel>
            <p className={`mt-3 text-[13.5px] leading-7 ${INK_SOFT}`} style={FONT_BODY}>{c.desc}</p>
          </div>

          <div className={`${PAPER_CARD} mt-4 px-5 py-4`}>
            <SectionLabel icon={Feather}>人 物 卡 </SectionLabel>
            <div className="mt-3 grid grid-cols-1 gap-2 text-[13px]">
              <PanelField label="身份" value={c.identity} />
              <PanelField label="性格" value={c.personality} />
              <PanelField label="所长" value={c.skill} />
              <PanelField label="秘事" value={c.secret} />
            </div>
          </div>

          <div className={`${PAPER_CARD} mt-4 px-5 py-4`}>
            <SectionLabel icon={ScrollText}>人 物 小 传</SectionLabel>
            <p className={`mt-3 text-[13.5px] leading-7 ${INK_SOFT}`} style={FONT_BODY}>{c.story}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-[oklch(0.88_0.012_50)] bg-[oklch(0.95_0.012_55/0.6)] px-3 py-2">
      <span className={`w-10 flex-shrink-0 text-[11px] tracking-widest ${ROUGE}`} style={FONT_LABEL}>{label}</span>
      <span className={INK} style={FONT_BODY}>{value}</span>
    </div>
  );
}

/* ────────────────── 剧情回溯 ────────────────── */

const RECAP: { act: string; title: string; summary: string; highlights: string[] }[] = [
  { act: "序幕", title: "初入采桑宫", summary: "温棠入宫十年，被遗忘在采桑宫偏殿，与嬷嬷相依度日。", highlights: ["结识嬷嬷", "得三皇子裴琰偶然探望"] },
  { act: "第一幕", title: "雪夜承宠", summary: "陛下夜翻牌子，问温棠是否愿抚育三皇子琰儿。", highlights: ["得宠 +1", "与裴荣初次试探"] },
];

function RecapPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-30 animate-fade-in">
      <button
        onClick={onClose}
        aria-label="关闭"
        className="absolute inset-0 bg-[oklch(0.22_0.015_30/0.55)] backdrop-blur-sm"
      />
      <div
        className="absolute inset-x-0 bottom-0 max-h-[78%] overflow-hidden rounded-t-3xl border-t border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] shadow-[0_-12px_40px_-12px_oklch(0.22_0.015_30/0.6)] animate-slide-in-up"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-md text-[oklch(0.97_0.01_60)]`} style={{ background: "var(--gradient-rouge)" }}>
              <History size={16} />
            </div>
            <div>
              <div className={`text-[10px] tracking-[0.32em] ${ROUGE}`} style={FONT_LABEL}>剧 情 回 溯</div>
              <div className={`text-[18px] tracking-[0.15em] ${INK}`} style={FONT_TITLE}>画 堂 春</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-[oklch(0.88_0.012_50)] ${INK_SOFT} active:scale-95`}
          >
            <X size={15} />
          </button>
        </div>
        <div className="my-1 flex items-center gap-2 px-5">
          <div className="h-px flex-1 bg-[oklch(0.88_0.012_50)]" />
          <div className="h-1.5 w-1.5 rotate-45 bg-[oklch(0.72_0.08_75)]" />
          <div className="h-px flex-1 bg-[oklch(0.88_0.012_50)]" />
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
          <ol className="relative space-y-5 border-l border-[oklch(0.48_0.12_20/0.3)] pl-5">
            {RECAP.map((r, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[26px] top-1 flex h-3 w-3 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-[oklch(0.48_0.12_20/0.18)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.48_0.12_20)]" />
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-[10px] tracking-[0.3em] ${ROUGE}`} style={FONT_LABEL}>{r.act}</span>
                  <span className={`text-[16px] ${INK}`} style={FONT_TITLE}>{r.title}</span>
                </div>
                <p className={`mt-1.5 text-[13px] leading-7 ${INK_SOFT}`} style={FONT_BODY}>{r.summary}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.highlights.map((h) => (
                    <span
                      key={h}
                      className={`rounded-full border border-[oklch(0.48_0.12_20/0.25)] bg-[oklch(0.95_0.012_55)] px-2 py-0.5 text-[10.5px] ${ROUGE}`}
                      style={FONT_LABEL}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </li>
            ))}
            <li className="relative opacity-60">
              <span className="absolute -left-[26px] top-1 flex h-3 w-3 items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.08_75)]" />
              </span>
              <div className={`text-[12px] italic ${MUTED}`} style={FONT_BODY}>未来剧情待你书写……</div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── 玩家数值 ────────────────── */

const AFFINITY: { id: string; value: number }[] = [
  { id: "zhouyi", value: 120 },
  { id: "zhuangsy", value: 360 },
  { id: "yushan", value: 80 },
  { id: "moshen", value: 540 },
];

const SKILLS: { key: string; label: string; value: number; icon: typeof EyeIcon }[] = [
  { key: "observe", label: "观察力", value: 78, icon: EyeIcon },
  { key: "speech", label: "口才", value: 65, icon: MessageCircle },
  { key: "force", label: "武力", value: 32, icon: Swords },
  { key: "wits", label: "智谋", value: 84, icon: Brain },
  { key: "prestige", label: "威望", value: 47, icon: Crown },
];

function StatsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-30 animate-fade-in">
      <button
        onClick={onClose}
        aria-label="关闭"
        className="absolute inset-0 bg-[oklch(0.22_0.015_30/0.55)] backdrop-blur-sm"
      />
      <div
        className="absolute inset-x-0 bottom-0 max-h-[82%] overflow-hidden rounded-t-3xl border-t border-[oklch(0.88_0.012_50)] bg-[oklch(0.985_0.006_60)] shadow-[0_-12px_40px_-12px_oklch(0.22_0.015_30/0.6)] animate-slide-in-up"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-md text-[oklch(0.97_0.01_60)]`} style={{ background: "var(--gradient-rouge)" }}>
              <Gauge size={16} />
            </div>
            <div>
              <div className={`text-[10px] tracking-[0.32em] ${ROUGE}`} style={FONT_LABEL}>玩 家 数 值</div>
              <div className={`text-[18px] tracking-[0.15em] ${INK}`} style={FONT_TITLE}>庄 寒 雁</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-full border border-[oklch(0.88_0.012_50)] ${INK_SOFT} active:scale-95`}
          >
            <X size={15} />
          </button>
        </div>
        <div className="my-1 flex items-center gap-2 px-5">
          <div className="h-px flex-1 bg-[oklch(0.88_0.012_50)]" />
          <div className="h-1.5 w-1.5 rotate-45 bg-[oklch(0.72_0.08_75)]" />
          <div className="h-px flex-1 bg-[oklch(0.88_0.012_50)]" />
        </div>

        <div className="max-h-[68vh] overflow-y-auto px-5 py-5 space-y-5">
          {/* 好感度 */}
          <section className={`${PAPER_CARD} px-4 py-4`}>
            <div className="mb-3 flex items-center gap-2">
              <SectionLabel icon={Heart}>好 感 度</SectionLabel>
              <div className={`text-[10px] ${MUTED}`} style={FONT_LABEL}>0 ~ 1000</div>
            </div>
            <div className="space-y-3">
              {AFFINITY.map((a) => {
                const ch = getCharacter(a.id);
                const pct = Math.min(100, (a.value / 1000) * 100);
                return (
                  <div key={a.id} className="flex items-center gap-3">
                    <img
                      src={ch?.img}
                      alt={ch?.name}
                      className="h-9 w-9 flex-shrink-0 rounded-full object-cover ring-1 ring-[oklch(0.88_0.012_50)]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-baseline justify-between">
                        <div className={`text-[13px] ${INK}`} style={FONT_BODY}>{ch?.name ?? a.id}</div>
                        <div className={`font-mono text-[11px] ${ROUGE}`}>
                          {a.value}<span className={MUTED}> / 1000</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.88_0.012_50)]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: "var(--gradient-rouge)" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 技能点 */}
          <section className={`${PAPER_CARD} px-4 py-4`}>
            <div className="mb-3 flex items-center gap-2">
              <SectionLabel icon={Sparkles}>技 能 点</SectionLabel>
              <div className={`text-[10px] ${MUTED}`} style={FONT_LABEL}>0 ~ 100</div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {SKILLS.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.key}
                    className="flex items-center gap-3 rounded-xl border border-[oklch(0.88_0.012_50)] bg-[oklch(0.95_0.012_55/0.6)] px-3 py-2.5"
                  >
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[oklch(0.985_0.006_60)] ${ROUGE} ring-1 ring-[oklch(0.48_0.12_20/0.25)]`}>
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-baseline justify-between">
                        <div className={`text-[13px] ${INK}`} style={FONT_BODY}>{s.label}</div>
                        <div className={`font-mono text-[11px] ${ROUGE}`}>{s.value}</div>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.88_0.012_50)]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${s.value}%`, background: "var(--gradient-rouge)" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ScenePage() {
  return (
    <PhoneMockup>
      <Scene />
    </PhoneMockup>
  );
}
