import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Share2, Bookmark, ChevronDown, Sparkles, Users, Clock, X } from "lucide-react";
import heroImg from "@/assets/hero-huatangchun.jpg";
import { CHARACTERS } from "@/lib/characters";
import { PhoneMockup } from "@/components/PhoneMockup";

export const Route = createFileRoute("/huatangchun")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "画堂春 · 知乎剧本杀文游" },
      { name: "description", content: "盐选长篇小说《画堂春》互动剧本杀，自由代入任意角色，AI 实时改编剧情。" },
    ],
  }),
});

const STORY_CHAPTERS = [
  { title: "第 1 幕：雪夜承宠", body: "雪落长街，温棠提灯独行，与失母的小皇子裴琰擦肩而过，一眼便记住了那双怯生生的眼睛。当夜陛下翻牌至她的寝宫，烛影摇红之间，竟轻声问她：可愿替朕，抚育三皇子？" },
  { title: "第 2 幕：抚育之诺", body: "翌日圣旨下达，温棠晋封采桑宫主位，奉旨抚育三皇子裴琰。小小的孩子伏在她膝前怯怯唤了一声「母妃」，殿外炭火正暖，她将他拥入怀中——从此宫深似海，她不再是孤身一人。" },
  { title: "第 3 幕：帝临采桑", body: "雪后初晴，陛下裴容亲临采桑宫。她奉上一盏亲手熬煮的红豆甜汤，热气氤氲间，他眉眼微动，赞了一句「合朕心意」。宫人们交换着了然的眼神——封妃之兆，已在不言之中。" },
];

function HuatangChun() {
  const navigate = useNavigate();
  const [active, setActive] = useState(1);
  const [openChapter, setOpenChapter] = useState(0);
  const [showWorld, setShowWorld] = useState(false);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const centerCard = (i: number, smooth = true) => {
    const track = trackRef.current;
    const card = cardRefs.current[i];
    if (!track || !card) return;
    const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    centerCard(active, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync active card with scroll position (debounced — only after the user stops swiping)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let min = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const c = card.offsetLeft + card.clientWidth / 2;
          const d = Math.abs(c - center);
          if (d < min) { min = d; nearest = i; }
        });
        setActive((prev) => (prev === nearest ? prev : nearest));
      }, 140);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const setActiveSafe = (i: number) => {
    const idx = Math.max(0, Math.min(CHARACTERS.length - 1, i));
    setActive(idx);
    centerCard(idx);
  };

  return (
    <div className="relative h-full bg-white">
    <div className="relative h-full overflow-y-auto pb-32 text-foreground no-scrollbar">
      {/* HERO */}
      <section className="relative h-[68vh] min-h-[600px] w-full overflow-hidden">
        <img src={heroImg} alt="画堂春世界" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 88%, #ffffff 100%)" }} />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-end px-5 pt-12">
          <div className="flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-full bg-black/25 backdrop-blur-md">
              <Bookmark className="h-4 w-4 text-white" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-black/25 backdrop-blur-md">
              <Share2 className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Title block — horizontal */}
        <div className="relative z-10 mt-6 px-6">
          <h1 className="font-brush text-[72px] leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)] tracking-[0.05em]">
            画堂春
          </h1>

          <div className="mt-4 space-y-1 text-[13px] leading-relaxed text-white/85">
            <p>一卷画堂春，半阙血色词。</p>
          </div>

          <div className="mt-4 flex items-center gap-3 text-[11px] text-white/80">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />34,221 人入梦</span>
            <span className="h-3 w-px bg-white/30" />
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />约 90 分钟</span>
            <span className="h-3 w-px bg-white/30" />
            <span>知乎盐选 · 改编</span>
          </div>
        </div>

        {/* World view chip */}
        <button
          onClick={() => setShowWorld(true)}
          className="absolute right-5 top-28 z-10 flex flex-col items-center gap-1 rounded-full bg-white/15 px-3 py-3 backdrop-blur-md transition active:scale-95"
        >
          <Sparkles className="h-4 w-4 text-white" />
          <span className="text-[10px] tracking-widest text-white">世界观</span>
        </button>
      </section>

      {/* CHARACTER CAROUSEL */}
      <section className="relative -mt-[260px] z-20">
        <div className="px-5 pb-2 text-center">
          <h2 className="font-brush text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">人物角色</h2>
        </div>

        <div ref={trackRef} className="no-scrollbar mt-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[22%] pb-6 pt-4">
          {CHARACTERS.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={c.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                onClick={() => {
                  navigate({ to: "/character/$id", params: { id: c.id } });
                }}
                className={`relative shrink-0 snap-center overflow-hidden rounded-2xl border transition-all duration-500 ${
                  isActive
                    ? "h-[330px] w-[200px] -translate-y-2 border-white/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)]"
                    : "h-[270px] w-[140px] border-white/10 opacity-70"
                }`}
              >
                <img src={c.img} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                  <div className={`font-brush text-white ${isActive ? "text-3xl" : "text-2xl"}`}>{c.name}</div>
                  <div className="mt-1 text-[10px] text-white/80">{c.gender} · {c.age} 岁</div>
                  {isActive && (
                    <span className="mt-2 inline-block rounded-sm bg-white/15 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                      {c.tag}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5">
          {CHARACTERS.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>

      </section>

      {/* STORY BACKGROUND */}
      <section className="mt-10 px-6">
        <div className="flex items-center gap-2">
          <span className="font-brush" style={{ color: "var(--rouge)" }}>❀</span>
          <h2 className="font-brush text-xl text-neutral-900">剧情分幕</h2>
        </div>

        <div className="mt-4 space-y-3">
          {STORY_CHAPTERS.map((ch, i) => {
            const open = i === openChapter;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-black/10 bg-black/[0.03] transition-all"
              >
                <button
                  onClick={() => setOpenChapter(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display text-[11px] tracking-widest text-neutral-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[15px] text-neutral-900">{ch.title}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="animate-fade-up px-4 pb-4">
                    <p className="text-[13px] leading-7 text-neutral-600">{ch.body}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* AI feature strip */}
      <section className="mt-8 px-6">
        <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: "var(--rouge)" }} />
            <span className="text-[12px] font-medium text-neutral-900">AI 动态剧情</span>
          </div>
          <p className="mt-2 text-[12px] leading-6 text-neutral-600">
            你的每一个选择，都将由 AI 实时改写，与他人的故事彼此交错——同一卷《画堂春》，没有两场相同的结局。
          </p>
        </div>
      </section>

    </div>

      {/* CTA — fixed to phone screen */}
      <div className="absolute bottom-6 right-5 z-30">
        <button
          onClick={() => navigate({ to: "/lobby" })}
          className="grid h-20 w-20 place-items-center rounded-full text-white shadow-[var(--shadow-card)] transition active:scale-95"
          style={{ background: "var(--gradient-rouge)" }}
        >
          <span className="font-brush text-base leading-tight text-center">
            开始<br/>游戏
          </span>
        </button>
      </div>

      {/* WORLDVIEW SHEET */}
      {showWorld && (
        <div className="absolute inset-0 z-40 flex items-end" onClick={() => setShowWorld(false)}>
          <div className="absolute inset-0 animate-fade-in bg-black/55 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-h-[78%] overflow-y-auto rounded-t-[28px] bg-white p-6 pb-10 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.4)] no-scrollbar animate-slide-in-right"
            style={{ animation: "fade-in 0.3s ease-out" }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" style={{ color: "var(--rouge)" }} />
                <h3 className="font-brush text-2xl text-neutral-900">画堂春 · 世界观</h3>
              </div>
              <button
                onClick={() => setShowWorld(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-black/[0.05] text-neutral-500"
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-[13px] leading-7 text-neutral-700">
              <p className="rounded-xl bg-black/[0.03] px-4 py-3 text-[12px] italic text-neutral-600">
                「一卷画堂春，半阙血色词。烟雨深处，是谁的故人，又是谁的劫数。」
              </p>

              <div>
                <h4 className="font-display text-[14px] font-medium text-neutral-900">大梁王朝</h4>
                <p className="mt-1.5">
                  时值大梁某年，边关有战事，内里有暗潮。赵将军执掌兵权，赫赫战功成为后宫倚仗；朝堂之上，立储未定，皇子年幼却已暗流涌动。表面是太平盛世、龙脉绵延，实则前朝后宫一线牵——一位将军的胜仗、一名妃嫔的"暴毙"、一道翻旧账的圣旨，都能让朝局倾覆。
                </p>
              </div>

              <div>
                <h4 className="font-display text-[14px] font-medium text-neutral-900">采桑宫畔</h4>
                <p className="mt-1.5">
                  裴容，大梁帝王，喜怒不形于色，后宫子嗣不丰，膝下仅有四位皇子。他厌恶外戚专权，也疲于美人争宠——他真正缺的，是一处可以做"寻常父亲"的地方。曾经盛宠的周贵妃以子争宠、媚药惑君，落得贬为庶人、暴毙宫外；中宫赵皇后膝下无子，借兄长军功执掌六宫，持铰剪修剪每一根不安分的枝丫。后宫如御园，花儿争奇斗艳，谁更得宠，谁就能多活一日。
                </p>
              </div>

              <div>
                <h4 className="font-display text-[14px] font-medium text-neutral-900">温棠其人</h4>
                <p className="mt-1.5">
                  温棠，太仓知州之女，母亲出身望江楼厨娘。入宫十年，无宠无依，亲生子裴瑜被抱去坤宁宫养大，六岁便不肯认她。她不会争宠，不擅算计，只随大流站队，以求自保。她唯一会做的，是母亲教的红豆甜汤、枣花糕、糖画与毽子——是寻常人家的暖。这份"蠢"，在尔虞我诈的深宫中，反而成了独一无二的东西。
                </p>
              </div>

              <div>
                <h4 className="font-display text-[14px] font-medium text-neutral-900">你的故事</h4>
                <p className="mt-1.5">
                  在这则故事里，你可以是任何人——是温棠，以一颗慈心在虎狼之地误打误撞活出生路；是裴琰，九岁被生母当作争宠工具，亲眼看着她吐血而亡，以为自己再不会哭，直到那块温热的枣花糕、那碗熬到深夜的汤药、那片烤得暖甜的橘瓣；也可以是裴瑜，聪明早慧，被皇后养大，踩着生母讨好养母，最后输给一个"不配"的女人；甚至是裴容，一位在权臣与美色之间疲惫的君王，某个雪夜推开窗，看见有人回头朝他笑。
                </p>
                <p className="mt-3">
                  每一次选择，都会改写画堂之下那段关于"娘"与"家"的故事——独一无二的，你的画堂春。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HomePage() {
  return (
    <PhoneMockup>
      <HuatangChun />
    </PhoneMockup>
  );
}
