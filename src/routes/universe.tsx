// 页面:个人作品集宇宙（阮庭萱 · 我的灵魂宇宙）  路由:/universe
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Rocket, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/universe")({
  component: UniversePage,
  head: () => ({
    meta: [
      { title: "我的灵魂宇宙 · 阮庭萱个人作品集" },
      { name: "description", content: "阮庭萱的个人作品集 —— 以宇宙星系形式串联学历、实习、自媒体、AI 项目与爱好。" },
      { property: "og:title", content: "我的灵魂宇宙 · 阮庭萱" },
      { property: "og:description", content: "宇宙式交互探索个人作品集" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

// ── Data ─────────────────────────────────────────────────────────────

type Planet = {
  id: string;
  name: string;
  subtitle?: string;
  color: string; // core color
  ring?: string; // ring/atmosphere color
  size: number; // px
  detail: string[];
};

type Galaxy = {
  id: string;
  name: string;
  tagline: string;
  hue: number; // base hue for palette
  angle: number; // starting angle around sun
  distance: number; // orbit radius (px on desktop)
  planets: Planet[];
};

const GALAXIES: Galaxy[] = [
  {
    id: "edu",
    name: "学历星系",
    tagline: "四年海内外 · 四所大学 · 复合专业",
    hue: 265,
    angle: 0,
    distance: 220,
    planets: [
      {
        id: "whu", name: "武汉大学", subtitle: "本科 · 播音主持 + 工商管理", size: 68, color: "#9b6bff", ring: "#c9a8ff",
        detail: [
          "本科：播音与主持艺术（主修）+ 工商管理（辅修）",
          "绩点专业第一 · 国家奖学金 / 创业奖学金 / 境外交换奖学金",
          "商赛奖金累计 7w+ · 国家发明专利持有者",
          "互联网+ / 挑战杯 / 正大杯市场调研 / 品牌策划赛 国家金奖",
        ],
      },
      {
        id: "sjtu", name: "上海交通大学", subtitle: "一硕 · 新闻与传播", size: 60, color: "#6bb2ff", ring: "#a8d4ff",
        detail: ["媒体与传播学院 · 新闻与传播", "全国第一保研"],
      },
      {
        id: "ic", name: "帝国理工学院", subtitle: "二硕 · 战略营销（优等学位）", size: 58, color: "#ff6bd5", ring: "#ffb0e3",
        detail: ["商学院 · 战略营销", "以优等学位（Merit / Distinction）毕业"],
      },
      {
        id: "hku", name: "香港大学", subtitle: "本科公费交换", size: 46, color: "#ffb36b",
        detail: ["港大商学院公费交换"],
      },
      {
        id: "ucsb", name: "UCSB", subtitle: "本科交换", size: 44, color: "#6bffd0",
        detail: ["加州大学圣塔芭芭拉分校 学期交换"],
      },
      {
        id: "ucla", name: "UCLA", subtitle: "高中交换", size: 42, color: "#ffe36b",
        detail: ["加州大学洛杉矶分校 高中交换", "雅思 7.0 · GRE 320"],
      },
    ],
  },
  {
    id: "intern",
    name: "实习星系",
    tagline: "商业 / 品牌 / 传播 · 多元实践轨迹",
    hue: 200,
    angle: 72,
    distance: 300,
    planets: [
      { id: "brand", name: "品牌策划", size: 58, color: "#6bd4ff", ring: "#b8ecff",
        detail: ["多段品牌 / 市场策略实习", "从洞察到 campaign 全链路参与"] },
      { id: "media", name: "内容传播", size: 52, color: "#6b9dff",
        detail: ["MCN、平台内容运营", "内容策划 + 数据复盘"] },
      { id: "biz", name: "商业分析", size: 50, color: "#a8b8ff",
        detail: ["用户调研、市场洞察", "输出可执行 insight"] },
    ],
  },
  {
    id: "creator",
    name: "自媒体星系",
    tagline: "6 平台 · 多条 50w / 200w+ 爆款",
    hue: 330,
    angle: 144,
    distance: 260,
    planets: [
      { id: "xhs", name: "小红书", subtitle: "研木加安 · 5,794", size: 56, color: "#ff5a7a", ring: "#ffb3c4",
        detail: ["研木加安", "5,794 粉丝 · 求职 / 成长向内容"] },
      { id: "dy", name: "抖音", subtitle: "加安 · 6,540", size: 54, color: "#ff2b6b",
        detail: ["加安", "6,540 粉丝 · 旅行 / 穿搭 / 探店 / cos"] },
      { id: "wx", name: "公众号", subtitle: "研木加安 · 1,396", size: 44, color: "#5ac26b",
        detail: ["研木加安 · 1,396 粉丝"] },
      { id: "bili", name: "B站", subtitle: "研木加安 · 1,329", size: 46, color: "#6bd4ff",
        detail: ["研木加安 · 1,329 粉丝"] },
      { id: "sph", name: "视频号", subtitle: "研木加安 · 3,037", size: 48, color: "#8affa8",
        detail: ["研木加安 · 3,037 粉丝"] },
      { id: "gh", name: "GitHub", subtitle: "graceruan311", size: 44, color: "#c9c9d4",
        detail: ["github.com/graceruan311"] },
    ],
  },
  {
    id: "ai",
    name: "AI 项目星系",
    tagline: "独立开发者 · 1k 人 AI 社群主理人",
    hue: 160,
    angle: 216,
    distance: 330,
    planets: [
      { id: "ruxi", name: "入戏", subtitle: "AI 多人互动文游平台", size: 64, color: "#ff8b3d", ring: "#ffd0a8",
        detail: ["AI 多人互动文游平台", "自由代入角色，每个选择改写故事"] },
      { id: "life", name: "人生余额", subtitle: "监督你早睡的 app", size: 54, color: "#7affc4",
        detail: ["以「人生余额」视角提醒早睡", "轻量、可视化、有情绪"] },
      { id: "music", name: "音势增长助手", subtitle: "AI 独立音乐人一站式宣发", size: 58, color: "#c47aff", ring: "#e2c1ff",
        detail: ["面向独立音乐人的宣发 + 增长工具", "从内容生产到分发"] },
    ],
  },
  {
    id: "hobby",
    name: "爱好星系",
    tagline: "音乐 · 舞蹈 · 环球旅行 · cosplay",
    hue: 30,
    angle: 288,
    distance: 250,
    planets: [
      { id: "travel", name: "环球旅行", subtitle: "4 大洲 · 18 国", size: 58, color: "#ffd36b", ring: "#ffe9a8",
        detail: ["目前踏足 4 大洲 18 个国家", "横跨欧洲 / 南北美洲 / 非洲 / 亚洲"] },
      { id: "cos", name: "Cosplay", subtitle: "老二次元 · JO 厨", size: 52, color: "#ff9ecb",
        detail: ["近期沉迷 nana / 全职猎人 / 天国大魔境", "狂热 JO 厨"] },
      { id: "art", name: "舞台 · 声乐", subtitle: "美声 · 钢琴 · 中国舞 10 级", size: 52, color: "#a8f0ff",
        detail: ["奇葩说第八季嘉宾", "华语辩论世界杯帝国理工代表", "中国好声音安徽 10 强"] },
      { id: "design", name: "视觉创作", subtitle: "Adobe 全家桶 · 前动画设计师", size: 50, color: "#c9a8ff",
        detail: ["AU / PR / PS / AE / AI / XD / C4D", "前动画设计师"] },
      { id: "sport", name: "运动书法", subtitle: "自由泳 · 羽毛球 · 书法", size: 46, color: "#8bffb0",
        detail: ["市自由泳第二", "书法 / 羽毛球 / 吉他 / 画画 / 编曲"] },
    ],
  },
];

// ── Starfield background ─────────────────────────────────────────────

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0, h = 0;
    const stars: { x: number; y: number; z: number; r: number; tw: number }[] = [];
    const resize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      stars.length = 0;
      const n = Math.floor((w * h) / 12000);
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random(),
          r: Math.random() * 1.4 + 0.2,
          tw: Math.random() * Math.PI * 2,
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);
    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      // subtle nebula wash
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
      grad.addColorStop(0, "rgba(60,30,120,0.28)");
      grad.addColorStop(0.5, "rgba(20,10,50,0.15)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = 0.6 + 0.4 * Math.sin(t * 2 + s.tw);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${200 + Math.floor(s.z * 55)},${200 + Math.floor(s.z * 40)},255,${twinkle * (0.4 + s.z * 0.6)})`;
        ctx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />;
}

// ── Page ─────────────────────────────────────────────────────────────

function UniversePage() {
  const [activeGalaxy, setActiveGalaxy] = useState<Galaxy | null>(null);
  const [activePlanet, setActivePlanet] = useState<Planet | null>(null);

  useEffect(() => {
    document.body.style.background = "#05030f";
    return () => { document.body.style.background = ""; };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white" style={{ background: "radial-gradient(ellipse at 50% 40%, #1a0b3a 0%, #0a0520 45%, #05030f 100%)" }}>
      <Starfield />

      {/* Top nav */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "conic-gradient(from 0deg, #9b6bff, #ff6bd5, #6bd4ff, #9b6bff)" }}>
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-sm tracking-[0.3em] text-white/80">我的灵魂宇宙</div>
        </div>
        <nav className="hidden gap-8 text-xs tracking-[0.25em] text-white/60 md:flex">
          <a className="hover:text-white">首页</a>
          <a className="hover:text-white">关于我</a>
          <a className="hover:text-white">项目星系</a>
          <a className="hover:text-white">经历轨迹</a>
          <a className="hover:text-white">联系我</a>
        </nav>
      </header>

      {/* Hero */}
      {!activeGalaxy && (
        <section className="relative z-10 mx-auto max-w-6xl px-6 pt-4 md:px-10">
          <h1 className="bg-gradient-to-r from-white via-[#e0c8ff] to-[#a8d4ff] bg-clip-text text-4xl font-black leading-tight text-transparent md:text-6xl">
            我的灵魂宇宙
          </h1>
          <p className="mt-3 text-sm tracking-[0.4em] text-white/60 md:text-base">阮 庭 萱 · 个 人 作 品 集</p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
            你好，我是阮庭萱 —— 一名产品经理与创意策划。<br />
            我相信每一个想法都是宇宙中的一颗星，连接用户、产品与价值，创造有温度的体验。
          </p>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/40 md:text-sm">
            点击星系 → 放大进入 · 点击星球 → 查看详情
          </p>
        </section>
      )}

      {/* Universe stage */}
      <main className="relative z-10 mx-auto flex h-[calc(100vh-180px)] max-w-6xl items-center justify-center px-4">
        {!activeGalaxy ? (
          <UniverseView onSelect={setActiveGalaxy} />
        ) : (
          <GalaxyView
            galaxy={activeGalaxy}
            onBack={() => setActiveGalaxy(null)}
            onSelectPlanet={setActivePlanet}
          />
        )}
      </main>

      {activePlanet && <PlanetModal planet={activePlanet} onClose={() => setActivePlanet(null)} />}
    </div>
  );
}

// ── Universe (5 galaxies orbiting the sun) ───────────────────────────

function UniverseView({ onSelect }: { onSelect: (g: Galaxy) => void }) {
  return (
    <div className="relative aspect-square w-full max-w-[720px]">
      {/* orbit rings */}
      {GALAXIES.map((g, i) => (
        <div
          key={"ring-" + g.id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          style={{
            width: `${(g.distance / 400) * 100}%`,
            height: `${(g.distance / 400) * 100}%`,
            borderColor: `hsla(${g.hue}, 80%, 70%, 0.15)`,
            boxShadow: `0 0 30px hsla(${g.hue}, 80%, 60%, 0.05) inset`,
          }}
        />
      ))}

      {/* Central sun (main galaxy) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="relative grid h-32 w-32 place-items-center rounded-full md:h-40 md:w-40"
          style={{
            background: "radial-gradient(circle at 35% 30%, #fff2c8, #ffb36b 40%, #ff6bd5 70%, #6b2b9b 100%)",
            boxShadow: "0 0 80px rgba(255,140,220,0.5), 0 0 160px rgba(120,80,255,0.4), inset 0 0 40px rgba(255,255,255,0.3)",
          }}
        >
          <div className="text-center">
            <div className="text-[10px] tracking-[0.3em] text-white/80">CORE</div>
            <div className="text-sm font-bold text-white md:text-base">阮庭萱</div>
          </div>
          <div className="absolute inset-0 animate-spin-slow rounded-full" style={{ background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.15) 30deg, transparent 60deg)" }} />
        </div>
      </div>

      {/* Orbiting galaxies */}
      {GALAXIES.map((g, i) => (
        <OrbitingGalaxy key={g.id} galaxy={g} index={i} onClick={() => onSelect(g)} />
      ))}
    </div>
  );
}

function OrbitingGalaxy({ galaxy, index, onClick }: { galaxy: Galaxy; index: number; onClick: () => void }) {
  const duration = 60 + index * 12; // seconds
  const delay = -(galaxy.angle / 360) * duration;
  const size = 90 + galaxy.planets.length * 4;
  return (
    <div
      className="absolute left-1/2 top-1/2 h-0 w-0"
      style={{
        animation: `orbit-${galaxy.id} ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <style>{`
        @keyframes orbit-${galaxy.id} {
          from { transform: rotate(0deg) translateX(${galaxy.distance * 0.5}px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(${galaxy.distance * 0.5}px) rotate(-360deg); }
        }
        @media (min-width: 768px) {
          @keyframes orbit-${galaxy.id} {
            from { transform: rotate(0deg) translateX(${galaxy.distance}px) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(${galaxy.distance}px) rotate(-360deg); }
          }
        }
      `}</style>
      <button
        onClick={onClick}
        className="group relative -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 rounded-full transition-all duration-500 group-hover:scale-125"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsl(${galaxy.hue}, 90%, 78%), hsl(${galaxy.hue}, 80%, 50%) 55%, hsl(${galaxy.hue + 30}, 70%, 25%) 100%)`,
            boxShadow: `0 0 40px hsla(${galaxy.hue}, 90%, 60%, 0.6), inset 0 -10px 20px rgba(0,0,0,0.4)`,
          }}
        />
        <div className="absolute inset-0 animate-spin-slow rounded-full opacity-60" style={{ background: `conic-gradient(from 0deg, transparent, hsla(${galaxy.hue}, 100%, 80%, 0.3), transparent)` }} />
        <div className="absolute left-1/2 top-full mt-3 w-max -translate-x-1/2 text-center opacity-90 group-hover:opacity-100">
          <div className="text-sm font-bold text-white">{galaxy.name}</div>
          <div className="text-[10px] tracking-wider text-white/60">{galaxy.tagline}</div>
        </div>
      </button>
    </div>
  );
}

// ── Galaxy detail (planets orbiting) ─────────────────────────────────

function GalaxyView({ galaxy, onBack, onSelectPlanet }: { galaxy: Galaxy; onBack: () => void; onSelectPlanet: (p: Planet) => void }) {
  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> 返回银河系
        </button>
        <div className="text-right">
          <div className="text-lg font-bold text-white md:text-2xl" style={{ textShadow: `0 0 20px hsl(${galaxy.hue}, 90%, 60%)` }}>
            {galaxy.name}
          </div>
          <div className="text-xs text-white/60">{galaxy.tagline}</div>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute left-1/2 top-1/2 aspect-square w-[min(90vw,620px)] -translate-x-1/2 -translate-y-1/2">
          {/* central star */}
          <div
            className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-28 md:w-28"
            style={{
              background: `radial-gradient(circle at 35% 30%, #fff, hsl(${galaxy.hue}, 90%, 70%) 40%, hsl(${galaxy.hue}, 80%, 40%) 100%)`,
              boxShadow: `0 0 100px hsla(${galaxy.hue}, 90%, 60%, 0.7), inset 0 0 30px rgba(255,255,255,0.4)`,
            }}
          />

          {galaxy.planets.map((p, i) => (
            <OrbitingPlanet
              key={p.id}
              planet={p}
              index={i}
              total={galaxy.planets.length}
              hue={galaxy.hue}
              onClick={() => onSelectPlanet(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrbitingPlanet({ planet, index, total, hue, onClick }: { planet: Planet; index: number; total: number; hue: number; onClick: () => void }) {
  // stagger orbit radii and speeds
  const radius = 130 + (index % 3) * 55 + (index >= 3 ? 30 : 0);
  const duration = 24 + index * 5;
  const startAngle = (360 / total) * index;
  const orbitName = `p-${planet.id}`;
  const spinName = `s-${planet.id}`;
  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 rounded-full border"
        style={{
          width: radius * 2,
          height: radius * 2,
          transform: "translate(-50%,-50%)",
          borderColor: `hsla(${hue}, 80%, 70%, 0.12)`,
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-0 w-0"
        style={{ animation: `${orbitName} ${duration}s linear infinite`, animationDelay: `${-(startAngle / 360) * duration}s` }}
      >
        <style>{`
          @keyframes ${orbitName} {
            from { transform: rotate(0deg) translateX(${radius}px) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(${radius}px) rotate(-360deg); }
          }
          @keyframes ${spinName} { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
        <button
          onClick={onClick}
          className="group relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
          style={{ width: planet.size, height: planet.size }}
        >
          <div
            className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-125"
            style={{
              width: planet.size,
              height: planet.size,
              background: `radial-gradient(circle at 30% 25%, #fff, ${planet.color} 45%, rgba(0,0,0,0.6) 100%)`,
              boxShadow: `0 0 30px ${planet.color}80, inset -6px -8px 20px rgba(0,0,0,0.5)`,
              animation: `${spinName} ${20 + index * 3}s linear infinite`,
            }}
          >
            {planet.ring && (
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: planet.size * 1.6,
                  height: planet.size * 0.35,
                  border: `2px solid ${planet.ring}`,
                  transform: "translate(-50%,-50%) rotate(-20deg)",
                  boxShadow: `0 0 12px ${planet.ring}`,
                }}
              />
            )}
          </div>
          <div className="pointer-events-none absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 whitespace-nowrap text-center opacity-90 group-hover:opacity-100">
            <div className="text-xs font-semibold text-white">{planet.name}</div>
            {planet.subtitle && <div className="text-[10px] text-white/60">{planet.subtitle}</div>}
          </div>
        </button>
      </div>
    </>
  );
}

// ── Planet detail modal ──────────────────────────────────────────────

function PlanetModal({ planet, onClose }: { planet: Planet; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md" style={{ background: "rgba(5,3,15,0.7)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg overflow-hidden rounded-3xl border border-white/15 p-6 md:p-8"
        style={{ background: `linear-gradient(135deg, ${planet.color}22, rgba(20,10,40,0.9))` }}
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 hover:bg-white/20">
          <X className="h-4 w-4" />
        </button>
        <div className="mb-5 flex items-center gap-4">
          <div
            className="h-16 w-16 shrink-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 25%, #fff, ${planet.color} 50%, rgba(0,0,0,0.6))`,
              boxShadow: `0 0 30px ${planet.color}`,
            }}
          />
          <div className="min-w-0">
            <div className="text-2xl font-bold text-white">{planet.name}</div>
            {planet.subtitle && <div className="text-sm text-white/70">{planet.subtitle}</div>}
          </div>
        </div>
        <ul className="space-y-2 text-sm leading-relaxed text-white/85">
          {planet.detail.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: planet.color, boxShadow: `0 0 6px ${planet.color}` }} />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
