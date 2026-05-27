/**
 * /play — 真实联调场景页
 * 接通后端 API，支持：
 * 1. 温棠单人对话
 * 2. 裴容单人对话
 * 3. 温棠+裴容双人对话
 * 
 * URL params:
 *   ?role=wentang (默认)
 *   ?role=peirong
 *   ?mode=solo (默认) | duo
 *   ?partner=peirong (duo模式下第二个角色)
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Send, Sparkles, Mic, Asterisk, Clock, BookOpen, Volume2 } from "lucide-react";
import { PhoneMockup } from "@/components/PhoneMockup";
import sceneBg from "@/assets/scene-huatang.jpg";
import { CHARACTERS, getCharacter } from "@/lib/characters";
import { useGame, type ChatMessage } from "@/hooks/use-game";

type PlaySearch = {
  role?: string;
  mode?: string;
  partner?: string;
};

export const Route = createFileRoute("/play")({
  validateSearch: (s: Record<string, unknown>): PlaySearch => ({
    role: typeof s.role === "string" ? s.role : "wentang",
    mode: typeof s.mode === "string" ? s.mode : "solo",
    partner: typeof s.partner === "string" ? s.partner : "peirong",
  }),
  component: PlayPage,
  ssr: false,
  head: () => ({
    meta: [
      { title: "游戏中 · 画堂春" },
      { name: "description", content: "实时对话 · 画堂春" },
    ],
  }),
});

function Play() {
  const navigate = useNavigate();
  const { role, mode, partner } = Route.useSearch();
  const myRole = role || "wentang";
  const gameMode = mode || "solo";
  const partnerRole = partner || "peirong";

  const {
    phase,
    messages,
    currentNode,
    result,
    loading,
    initSoloGame,
    initDuoGame,
    initJoinGame,
    makeChoice,
    sendMessage,
    endGame,
  } = useGame(myRole, gameMode);

  const [input, setInput] = useState("");
  const [showImmersiveModal, setShowImmersiveModal] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initRef = useRef(false);

  // Auto-start game on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initRef.current) return;
    if (phase === "idle") {
      initRef.current = true;
      const searchParams = new URLSearchParams(window.location.search);
      const joinId = searchParams.get("join");
      if (joinId) {
        initJoinGame(joinId);
      } else if (gameMode === "duo") {
        initDuoGame(partnerRole);
      } else {
        initSoloGame();
      }
    }
  }, [phase, gameMode, partnerRole, initSoloGame, initDuoGame]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Navigate to ending when game ends
  useEffect(() => {
    if (phase === "ended" && result) {
      navigate({ to: "/play-ending", search: { data: JSON.stringify(result) } });
    }
  }, [phase, result, navigate]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
  };

  const insertActionMarkers = () => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    const before = input.slice(0, start);
    const selected = input.slice(start, end);
    const after = input.slice(end);
    setInput(`${before}（${selected}）${after}`);
  };

  const myChar = getCharacter(myRole);
  const roleName = myChar?.name || myRole;

  return (
    <div className="relative h-full overflow-hidden bg-neutral-900 text-white">
      <img src={sceneBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,16,24,0.55) 0%, rgba(20,16,24,0) 18%, rgba(20,16,24,0) 60%, rgba(20,16,24,0.7) 100%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-3">
        <button
          onClick={() => navigate({ to: "/lobby" })}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur active:scale-95"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 text-center">
          <div className="text-[11px] tracking-[0.3em] text-white/80">
            {currentNode?.act_title || "加载中…"}
          </div>
          <div className="font-brush text-[18px] tracking-[0.2em]">
            {currentNode?.scene_name || "雁回时"}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur-md">
            {gameMode === "duo" ? `双人 · ${roleName}` : `单人 · ${roleName}`}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {currentNode && (
        <div className="relative z-10 mx-4 mb-2 flex items-center justify-center">
          <div className="flex items-center gap-2.5 rounded-full bg-black/40 px-3 py-1 text-[11px] text-white/85 backdrop-blur-md">
            <span className="flex items-center gap-1.5">
              <BookOpen size={11} className="opacity-80" />
              进度 {currentNode.progress || 0}%
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto px-4 pb-32"
        style={{ height: "calc(100% - 200px)" }}
      >
        <div className="space-y-4 py-2">
          {loading && messages.length === 0 && (
            <div className="text-center text-[13px] text-white/60 py-10">
              正在创建游戏…
            </div>
          )}
          {messages.map((m, i) => (
            <MessageBubble key={i} m={m} myRole={myRole} onChoice={makeChoice} />
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/55 px-3 pb-6 pt-3 backdrop-blur-xl">
        <div className="flex items-center gap-2 w-full min-w-0">
          <button
            aria-label="语音输入"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white/85 active:scale-95"
          >
            <Mic size={17} />
          </button>
          <div className="flex flex-1 min-w-0 items-center gap-2 rounded-full bg-white/15 px-3 py-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`以${roleName}的身份说话，（）包裹动作`}
              className="flex-1 min-w-0 bg-transparent text-[13px] outline-none placeholder:text-white/50"
            />
            <button
              onClick={insertActionMarkers}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white/70 hover:text-white active:scale-95"
            >
              <Asterisk size={15} />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7a2a2a] text-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] active:scale-95 disabled:opacity-50"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Immersive experience modal */}
      {showImmersiveModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-8">
          <div className="w-full max-w-[300px] rounded-2xl bg-gradient-to-b from-[#2a1a1a] to-[#1a1014] border border-white/10 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7a2a2a]/30 border border-[#7a2a2a]/50">
              <Volume2 size={22} className="text-[#e8b88a]" />
            </div>
            <div className="font-brush text-[20px] tracking-[0.15em] text-white mb-2">
              开启沉浸体验
            </div>
            <p className="text-[12px] leading-relaxed text-white/70 mb-5">
              建议开启声音，配合环境音效与角色配音，<br />让你更深入这场画堂春的故事。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImmersiveModal(false)}
                className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-[12px] text-white/70 active:scale-95"
              >
                稍后
              </button>
              <button
                onClick={() => setShowImmersiveModal(false)}
                className="flex-1 rounded-full bg-[#7a2a2a] px-4 py-2.5 text-[12px] text-white shadow-[0_2px_10px_rgba(122,42,42,0.5)] active:scale-95"
              >
                开启声音
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({
  m,
  myRole,
  onChoice,
}: {
  m: ChatMessage;
  myRole: string;
  onChoice: (index: number) => void;
}) {
  if (m.kind === "narration") {
    return (
      <div className="mx-auto max-w-[88%] text-center">
        <div className="mx-auto mb-2 h-px w-10 bg-white/40" />
        <p className="font-brush text-[13px] leading-relaxed tracking-wider text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          {m.text}
        </p>
        <div className="mx-auto mt-2 h-px w-10 bg-white/40" />
      </div>
    );
  }

  if (m.kind === "me") {
    const me = getCharacter(myRole);
    return (
      <div className="flex justify-end gap-2">
        <div className="max-w-[78%]">
          {m.mode === "do" ? (
            <div className="rounded-2xl rounded-tr-md bg-black/50 px-4 py-2.5 text-[13px] italic text-white/65 shadow-[0_2px_10px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              （{m.text}）
            </div>
          ) : (
            <div className="rounded-2xl rounded-tr-md bg-black/50 px-4 py-2.5 text-[14px] leading-relaxed text-white shadow-[0_2px_10px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              {m.text}
            </div>
          )}
        </div>
        {me && (
          <img src={me.img} alt={me.name} className="h-9 w-9 flex-shrink-0 rounded-full object-cover" />
        )}
      </div>
    );
  }

  if (m.kind === "dialog" || m.kind === "action") {
    // If this character is the one I'm playing, show on the right (as "me")
    const nameToId: Record<string, string> = {
      "温棠": "wentang", "裴容": "peirong", "裴琰": "peiyan",
      "裴瑜": "peiyu", "皇后": "empress", "陈嬷嬷": "mama",
    };
    const speakerRoleId = nameToId[m.speaker] ?? m.charId;
    if (speakerRoleId === myRole) {
      // It's the player's own character speaking (from script) — show as narration/prompt
      const me = getCharacter(myRole);
      return (
        <div className="flex justify-end gap-2">
          <div className="max-w-[78%]">
            <div className="rounded-2xl rounded-tr-md bg-black/50 px-4 py-2.5 text-[14px] leading-relaxed text-white shadow-[0_2px_10px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              {m.text}
            </div>
          </div>
          {me && (
            <img src={me.img} alt={me.name} className="h-9 w-9 flex-shrink-0 rounded-full object-cover" />
          )}
        </div>
      );
    }
    const c = getCharacter(m.charId) ?? CHARACTERS[0];
    return (
      <div className="flex gap-2">
        <img src={c.img} alt={c.name} className="h-9 w-9 flex-shrink-0 rounded-full object-cover" />
        <div className="max-w-[80%]">
          <div className="mb-1 text-[10px] text-white/60">{m.speaker || c.name}</div>
          {m.kind === "action" ? (
            <div className="rounded-2xl rounded-tl-md border border-white/40 bg-white/15 px-4 py-2.5 text-[13px] italic text-white shadow-[0_2px_10px_rgba(0,0,0,0.25)] backdrop-blur-md">
              （{m.text}）
            </div>
          ) : (
            <div className="rounded-2xl rounded-tl-md bg-white/80 px-4 py-2.5 text-[14px] leading-relaxed text-neutral-800 shadow-[0_2px_10px_rgba(0,0,0,0.18)] backdrop-blur-sm">
              {m.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (m.kind === "choice") {
    return (
      <div className="my-4 space-y-2 px-2">
        <div className="mb-2 flex items-center gap-1.5 text-[10px] text-amber-200/80">
          <Sparkles size={10} />
          <span className="tracking-[0.3em]">选 择</span>
        </div>
        {m.choices.map((c) => (
          <button
            key={c.index}
            onClick={() => onChoice(c.index)}
            className="block w-full rounded-lg bg-white/80 px-4 py-2.5 text-left text-[14px] font-medium text-neutral-900 shadow-[0_2px_10px_rgba(0,0,0,0.18)] backdrop-blur-sm transition active:scale-[0.99]"
          >
            {c.text}
            {c.influence_hint && (
              <span className="ml-2 text-[11px] text-neutral-500">({c.influence_hint})</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (m.kind === "reward") {
    return (
      <div className="my-2 flex justify-center">
        <div className="rounded-full border border-amber-200/30 bg-amber-950/70 px-4 py-1.5 text-[11px] text-amber-100/90 backdrop-blur-md">
          <Sparkles size={10} className="inline mr-1 text-amber-200" />
          {m.text}
        </div>
      </div>
    );
  }

  if (m.kind === "notice") {
    return (
      <div className="my-3 flex justify-center">
        <div className="rounded-full border border-white/20 bg-black/55 px-4 py-1.5 text-[11px] text-white/80 backdrop-blur-md">
          {m.text}
        </div>
      </div>
    );
  }

  return null;
}

function PlayPage() {
  return (
    <PhoneMockup>
      <Play />
    </PhoneMockup>
  );
}
