import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Share2, RotateCcw, ChevronLeft, Heart, Search } from "lucide-react";
import { PhoneMockup } from "@/components/PhoneMockup";
import sceneBg from "@/assets/ending-bg.jpg";
import playerAvatar from "@/assets/player-tingyu.png";
import { getCharacter } from "@/lib/characters";

export const Route = createFileRoute("/ending")({
  component: EndingPage,
  head: () => ({
    meta: [
      { title: "圆满结局 · 凤凰归位" },
      { name: "description", content: "重生之贵女难求 · 圆满结局。" },
    ],
  }),
});

const PLAYER_ID = "hanyan";

// 与庄寒雁的关系
const RELATIONS: Record<
  string,
  { desc: string; intimacy: number; clues: number; tag: string }
> = {
  moshen: {
    desc: "钻狗洞那日的惊鸿一瞥，从此一生一世一双人。",
    intimacy: 98,
    clues: 14,
    tag: "一生一世",
  },
  zhouyi: {
    desc: "笑里藏刀的继母，终被亲手送进牢狱。",
    intimacy: 8,
    clues: 11,
    tag: "宿敌伏法",
  },
  zhuangsy: {
    desc: "凉薄寡情的父亲，迟来的悔意已无人在意。",
    intimacy: 32,
    clues: 7,
    tag: "形同陌路",
  },
  yushan: {
    desc: "假姐妹反目，她游街疯死，尘归尘土归土。",
    intimacy: 5,
    clues: 9,
    tag: "因果自负",
  },
};

const OTHERS = ["moshen", "zhouyi", "zhuangsy", "yushan"];

function Ending() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>("moshen");
  const player = getCharacter(PLAYER_ID);
  const target = getCharacter(selected);
  const rel = RELATIONS[selected];

  return (
    <div className="relative h-full overflow-hidden">
      {/* background */}
      <img
        src={sceneBg}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
      />

      {/* back */}
      <button
        onClick={() => navigate({ to: "/scene" })}
        className="absolute left-4 top-12 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur active:scale-95"
      >
        <ChevronLeft size={18} />
      </button>

      {/* main scroll */}
      <div className="relative z-10 h-full overflow-y-auto px-4 pt-32 pb-8">
        {/* paper card */}
        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] bg-[#fbf5ec] px-6 pt-9 pb-7 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]">
          {/* subtle inner border */}
          <div className="pointer-events-none absolute inset-2 rounded-[22px] ring-1 ring-[#7a2a2a]/5" />

          {/* title */}
          <h1 className="text-center font-brush text-[26px] leading-tight tracking-wide text-[#2b1a14]">
            <span className="text-[#7a2a2a]">【圆满结局】</span>凤凰归位
          </h1>

          {/* divider */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-[#7a2a2a]/30" />
            <span className="text-[10px] text-[#7a2a2a]/70">❀</span>
            <span className="h-px w-12 bg-[#7a2a2a]/30" />
          </div>

          {/* body */}
          <p className="mt-5 text-center text-[14px] leading-[2] text-[#3a2a22]">
            寒雁手刃旧怨，周氏伏法、语山疯死，<br />
            玄清王府十里红妆，<br />
            傅云夕一句「此生唯卿」，<br />
            重生之路，终成正果。
          </p>

          {/* hairline */}
          <div className="mx-auto mt-6 h-px w-full bg-[#7a2a2a]/10" />

          {/* relationship graph */}
          <div className="mt-6 flex flex-col items-center">
            {/* player avatar (large) */}
            <div className="relative">
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-[#d4a373] to-[#7a2a2a]" />
              <img
                src={player?.img}
                alt={player?.name}
                className="relative h-20 w-20 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#7a2a2a] px-2 py-[2px] text-[9px] leading-none text-white">
                我 · {player?.name}
              </div>
            </div>

            {/* connector */}
            <div className="my-4 flex w-full items-center justify-center">
              <span className="h-px flex-1 bg-[#7a2a2a]/15" />
              <span className="mx-2 rounded-full border border-[#7a2a2a]/30 bg-[#fbf5ec] px-2 py-[2px] text-[10px] text-[#7a2a2a]">
                {rel?.tag ?? "关系"}
              </span>
              <span className="h-px flex-1 bg-[#7a2a2a]/15" />
            </div>

            {/* others row */}
            <div className="grid w-full grid-cols-4 gap-2">
              {OTHERS.map((id) => {
                const ch = getCharacter(id);
                const active = id === selected;
                return (
                  <button
                    key={id}
                    onClick={() => setSelected(id)}
                    className="flex flex-col items-center gap-1 active:scale-95"
                  >
                    <div className="relative">
                      <div
                        className={`absolute -inset-[2px] rounded-full ${
                          active
                            ? "bg-gradient-to-br from-[#d4a373] to-[#7a2a2a]"
                            : "bg-[#7a2a2a]/15"
                        }`}
                      />
                      <img
                        src={ch?.img}
                        alt={ch?.name}
                        className={`relative h-12 w-12 rounded-full object-cover transition ${
                          active ? "" : "opacity-70 grayscale-[40%]"
                        }`}
                      />
                    </div>
                    <div
                      className={`text-[11px] ${
                        active ? "font-medium text-[#7a2a2a]" : "text-[#3a2a22]/70"
                      }`}
                    >
                      {ch?.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* relation info */}
            <div className="mt-4 w-full rounded-xl bg-[#f3e8d4]/70 p-3">
              <p className="text-center text-[12px] leading-[1.7] text-[#3a2a22]">
                {rel?.desc}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center gap-1.5 rounded-lg bg-white/70 py-2">
                  <Heart size={12} className="text-[#7a2a2a]" />
                  <span className="text-[10px] text-[#3a2a22]/70">亲密度</span>
                  <span className="font-brush text-[16px] leading-none text-[#7a2a2a]">
                    {rel?.intimacy}
                    <span className="text-[10px]">%</span>
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 rounded-lg bg-white/70 py-2">
                  <Search size={12} className="text-[#7a2a2a]" />
                  <span className="text-[10px] text-[#3a2a22]/70">线索</span>
                  <span className="font-brush text-[16px] leading-none text-[#7a2a2a]">
                    {rel?.clues}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* real player module - only for moshen */}
          {selected === "moshen" && (
            <div className="mt-4 rounded-xl border border-[#7a2a2a]/15 bg-white/60 p-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-[2px] rounded-full bg-gradient-to-br from-[#d4a373] to-[#7a2a2a]" />
                  <img
                    src={playerAvatar}
                    alt="真人玩家"
                    className="relative h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-[#3a2a22]/60">扮演者</div>
                  <div className="text-[13px] font-medium text-[#2b1a14] truncate">
                    真人玩家 · 听雨
                  </div>
                  <div className="text-[10px] text-[#3a2a22]/60">
                    ID: 88231 · 已扮演 3 场
                  </div>
                </div>
                <button
                  onClick={() => navigate({ to: "/report" })}
                  className="shrink-0 rounded-full bg-[#7a2a2a]/10 px-3 py-1.5 text-[11px] text-[#7a2a2a] active:scale-95"
                >
                  亲密关系报告 →
                </button>
              </div>
            </div>
          )}

          {/* buttons */}
          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={() => navigate({ to: "/lobby" })}
              className="flex flex-1 items-center justify-center gap-1 rounded-full border border-[#7a2a2a]/40 bg-white py-2.5 text-[12px] text-[#7a2a2a] active:scale-[0.99]"
            >
              <RotateCcw size={13} />
              再玩一次
            </button>
            <button className="flex flex-[1.2] items-center justify-center gap-1.5 rounded-full bg-[#7a2a2a] py-2.5 text-[13px] font-medium text-white shadow-[0_6px_16px_-6px_rgba(122,42,42,0.6)] active:scale-[0.99]">
              <Share2 size={14} />
              分享
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EndingPage() {
  return (
    <PhoneMockup>
      <Ending />
    </PhoneMockup>
  );
}
