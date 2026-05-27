import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Share2, Bookmark, ChevronDown, Sparkles, Users, Clock, X } from "lucide-react";
import heroImg from "@/assets/hero-huatangchun.jpg";
import { CHARACTERS } from "@/lib/characters";
import { PhoneMockup } from "@/components/PhoneMockup";

export const Route = createFileRoute("/huatangchun")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "雁回时 · 第五章 初次交锋" },
      { name: "description", content: "长篇故事《雁回时》互动剧本杀，自由代入任意角色，AI 实时改编剧情。" },
    ],
  }),
});

const STORY_CHAPTERS = [
  { title: "第 1 幕：母丧未远，新人登门", body: "庄府的白幡尚未撤尽，周氏便携女庄语山堂而皇之地踏进了大门。一身桃色长裙，红宝石头面，富贵逼人。庄仕洋亲自相迎，命寒雁出来「认一认这位姐姐」——可她身上那股浓重的香粉味，先一步飘进了寒雁的鼻尖。" },
  { title: "第 2 幕：跪与不跪，皆是交锋", body: "寒雁一句「她身上有香粉的味道」，惹得庄仕洋拍案叫她下跪。庄语山假意求情，反被父亲斥责。寒雁顺势起身，握住对方的手温柔致歉，又「好心」赠她一盒「连丫鬟都用得的香膏」——周氏的脸色，霎时由红转白。" },
  { title: "第 3 幕：狗洞之外，有人含笑", body: "寒雁借丧期律例三言两语逼退周氏母女，转身换上丫鬟粗布衣裳，带着汲蓝姝红从清秋苑后墙的狗洞钻出府去。她不知道的是，外墙不远处，一个叼着草梗的陌生男子正含笑望着她的背影——「有意思。」" },
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
        <img src={heroImg} alt="雁回时世界" className="absolute inset-0 h-full w-full object-cover" />
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
        <div className="relative z-10 -mt-2 px-3">
          <h1 className="font-brush text-[72px] leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)] tracking-[0.05em]">
            雁回时
          </h1>
          <p className="mt-1 text-[13px] tracking-[0.4em] text-white/80">第五章 · 初次交锋</p>

          <div className="mt-4 space-y-1 text-[13px] leading-relaxed text-white/85">
            <p>母丧之日，外室登堂。重生而来的庄寒雁，与那对母女的第一次正面交锋。</p>
          </div>

          <div className="mt-4 flex items-center gap-3 text-[11px] text-white/80">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />34,221 人入梦</span>
            <span className="h-3 w-px bg-white/30" />
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />约 90 分钟</span>
            <span className="h-3 w-px bg-white/30" />
            <span>原著改编</span>
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
            你的每一个选择，都将由 AI 实时改写，与他人的故事彼此交错——同一卷《雁回时》，没有两场相同的结局。
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
                <h3 className="font-brush text-2xl text-neutral-900">雁回时 · 世界观</h3>
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
                「雁过留声，人过留名。这一回，她记得清清楚楚。」
              </p>

              <div>
                <h4 className="font-display text-[14px] font-medium text-neutral-900">大宗朝 · 镇国侯府</h4>
                <p className="mt-1.5">
                  大宗朝当今圣上最重仁爱孝义，律例森严：丧期三月内不得着艳色，违者罢官流放。京中世家百年清誉系于一线，最忌行差踏错。镇国侯庄府袭爵承业，外有官声体面，内里却早已被外室周氏一双勾魂的眼睛搅得乱了纲常。
                </p>
              </div>

              <div>
                <h4 className="font-display text-[14px] font-medium text-neutral-900">清秋苑里 · 庄寒雁</h4>
                <p className="mt-1.5">
                  庄寒雁，镇国侯庄仕洋之嫡长女。母亲温婉柔顺，从不与人争长短；父亲冷淡，多年在外头养着外室母女而她毫不知情。前世，她信了继母的笑、信了「好姐姐」的眼泪，眼看着母亲被算计而亡、弟弟被夺走、自己也走到了那个凄惨结局。再睁眼，竟回到了母丧未远、周氏母女初登庄府的那一天。
                </p>
              </div>

              <div>
                <h4 className="font-display text-[14px] font-medium text-neutral-900">第五章 · 初次交锋</h4>
                <p className="mt-1.5">
                  这一日，周氏盛装登门，庄语山娇声唤她「妹妹」。前世的寒雁会怯怯地笑着应下，今生的她，却把每一句话都化作钝刀——香粉、丧期、律例、丫鬟用的香膏，一句一句，剜在周氏母女最痛的地方。父亲庄仕洋的脸色变了又变，周氏第一次明白：这个嫡女，与从前不一样了。
                </p>
              </div>

              <div>
                <h4 className="font-display text-[14px] font-medium text-neutral-900">你的故事</h4>
                <p className="mt-1.5">
                  在这则故事里，你可以是任何人——是带着前世记忆归来的庄寒雁，以一双慧眼一张利口在虎狼之府里步步反扑；是装柔示弱、却被识破伪装的周氏；是骄矜娇气、第一次撞上铁板的庄语山；是只在意官声仕途的庄仕洋；也可以是那个叼着草梗、在外墙边含笑看戏的陌生人。
                </p>
                <p className="mt-3">
                  每一次选择，都会改写这场「初次交锋」的胜负——独一无二的，你的雁回时。
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
