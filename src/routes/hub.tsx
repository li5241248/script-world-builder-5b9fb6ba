// 页面:互动文游首页(底部 4 Tab:互动文游 / 我的创作 / 好友 / 我的)  路由:/hub
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Sparkles, Flame, Lock, ChevronRight, Users, Clock, Home, PenLine, UserRound, BookOpen, Plus } from "lucide-react";
import heroHuatang from "@/assets/hero-huatangchun.jpg";
import coverJiu from "@/assets/cover-jiuchongxue.jpg";
import coverWu from "@/assets/cover-wugang.jpg";
import coverChangan from "@/assets/cover-changan.jpg";
import coverXing from "@/assets/cover-xinghai.jpg";
import { PhoneMockup } from "@/components/PhoneMockup";

export const Route = createFileRoute("/hub")({
  component: HubPage,
  head: () => ({
    meta: [
      { title: "严选 · 互动文游" },
      { name: "description", content: "知乎严选 · AI 互动文游精选合集。" },
    ],
  }),
});

type Game = {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  tags: string[];
  players: string;
  duration: string;
  hot?: boolean;
  locked?: boolean;
  to?: string;
};

const FEATURED: Game = {
  id: "huatangchun",
  title: "重生之贵女难求",
  subtitle: "一卷重生之贵女难求，半阙血色词。深宫之中，谁是故人，谁是劫数。",
  cover: heroHuatang,
  tags: ["古风", "宫廷", "悬疑"],
  players: "34,221",
  duration: "约 90 分钟",
  hot: true,
  to: "/huatangchun",
};

const GAMES: Game[] = [
  { id: "jiu", title: "九重雪", subtitle: "雪山之巅，剑出无回。", cover: coverJiu, tags: ["仙侠", "成长"], players: "12,408", duration: "60 分钟", locked: true },
  { id: "changan", title: "长安花事", subtitle: "盛唐市井，一袭红衣穿过千年。", cover: coverChangan, tags: ["唐风", "言情"], players: "8,772", duration: "75 分钟", locked: true },
  { id: "wu", title: "雾港谜案", subtitle: "1937 上海，一桩没有尸体的命案。", cover: coverWu, tags: ["民国", "推理"], players: "6,915", duration: "80 分钟", locked: true },
  { id: "xing", title: "星海回声", subtitle: "宇宙深处，一段未发出的回信。", cover: coverXing, tags: ["科幻", "孤独"], players: "3,204", duration: "50 分钟", locked: true },
];

const CATEGORIES = ["全部", "古风", "悬疑", "言情", "科幻", "民国", "仙侠"];

function GameHub() {
  const navigate = useNavigate();

  const openGame = (g: Game) => {
    if (g.locked || !g.to) return;
    navigate({ to: g.to });
  };

  return (
    <div className="relative h-full overflow-y-auto bg-[#fbf7ef] pb-24 no-scrollbar">
      <header className="sticky top-0 z-20 bg-[#fbf7ef]/90 px-5 pb-3 pt-12 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="font-brush text-2xl text-neutral-900">互动文游</h1>
            </div>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-black/[0.05]" aria-label="通知">
            <Bell className="h-4 w-4 text-neutral-700" />
          </button>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c, i) => (
            <button
              key={c}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] transition ${
                i === 0 ? "bg-neutral-900 text-white" : "bg-black/[0.05] text-neutral-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <section className="px-5 pt-2">
        <div className="mb-2 flex items-center gap-1.5">
          <Flame className="h-4 w-4" style={{ color: "var(--rouge)" }} />
          <span className="text-[12px] font-medium text-neutral-900">本周主打</span>
        </div>
        <button
          onClick={() => openGame(FEATURED)}
          className="group relative block h-[260px] w-full overflow-hidden rounded-3xl text-left shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] active:scale-[0.99] transition"
        >
          <img src={FEATURED.cover} alt={FEATURED.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-white" />
            <span className="text-[10px] tracking-widest text-white">AI 实时改编</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h2 className="font-brush text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{FEATURED.title}</h2>
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-white/85">{FEATURED.subtitle}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] text-white/80">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{FEATURED.players}</span>
                <span className="h-3 w-px bg-white/30" />
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{FEATURED.duration}</span>
              </div>
              <span
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium text-white"
                style={{ background: "var(--gradient-rouge)" }}
              >
                立即进入 <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </button>
      </section>

      {/* 创作工作台入口 */}
      <section className="mt-6 px-5">
        <button
          onClick={() => navigate({ to: "/workshop" })}
          className="group flex w-full items-center justify-between overflow-hidden rounded-2xl border border-black/5 bg-white px-4 py-4 text-left transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
              style={{ background: "var(--gradient-rouge)" }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-neutral-900">互动文游创作工作台</div>
              <p className="mt-0.5 text-[11px] text-neutral-500">上传你的小说，让 AI 改编为互动文游</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-neutral-400" />
        </button>
      </section>

      <section className="mt-8 px-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h3 className="font-brush text-xl text-neutral-900">精选文游</h3>
            <p className="text-[11px] text-neutral-400">每一个故事，都是另一种人生</p>
          </div>
          <button className="text-[11px] text-neutral-400">全部 ›</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => openGame(g)}
              className="group relative overflow-hidden rounded-2xl bg-black/[0.04] text-left transition active:scale-[0.98]"
            >
              <div className="relative h-[180px] w-full overflow-hidden">
                <img
                  src={g.cover}
                  alt={g.title}
                  loading="lazy"
                  className={`h-full w-full object-cover transition ${g.locked ? "blur-[2px] grayscale-[40%]" : ""}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {g.locked && (
                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 backdrop-blur-md">
                    <Lock className="h-3 w-3 text-white" />
                    <span className="text-[10px] text-white">敬请期待</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="font-brush text-xl text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">{g.title}</div>
                </div>
              </div>
              <div className="px-3 py-2.5">
                <p className="line-clamp-1 text-[11px] text-neutral-600">{g.subtitle}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-1">
                    {g.tags.slice(0, 2).map((t) => (
                      <span key={t} className="rounded-sm bg-black/[0.06] px-1.5 py-0.5 text-[9px] text-neutral-500">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                    <Users className="h-2.5 w-2.5" />
                    {g.players}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 px-5">
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: "var(--rouge)" }} />
            <span className="text-[12px] font-medium text-neutral-900">什么是 AI 互动文游？</span>
          </div>
          <p className="mt-2 text-[12px] leading-6 text-neutral-600">
            互动文游基于长篇故事改编，由 AI 实时生成剧情走向。你可以自由代入任意角色，每一次选择都将塑造一个独属于你的结局。
          </p>
        </div>
      </section>
    </div>
  );
}

type TabKey = "home" | "create" | "friends" | "me";

function CreateTab() {
  const navigate = useNavigate();
  const drafts = [
    { id: "d1", title: "重生之贵女难求", status: "已发布", cover: heroHuatang, updated: "2 小时前" },
    { id: "d2", title: "未命名草稿 · 03", status: "改编中 · 4/6", cover: coverChangan, updated: "昨天" },
  ];
  return (
    <div className="relative h-full overflow-y-auto bg-[#fbf7ef] pb-24 no-scrollbar">
      <header className="sticky top-0 z-20 bg-[#fbf7ef]/90 px-5 pb-3 pt-12 backdrop-blur-md">
        <h1 className="font-brush text-2xl text-neutral-900">我的创作</h1>
        <p className="mt-1 text-[11px] text-neutral-500">把你的小说，交给 AI 改成可玩文游</p>
      </header>

      <section className="px-5 pt-2">
        <button
          onClick={() => navigate({ to: "/workshop" })}
          className="flex w-full items-center justify-between overflow-hidden rounded-2xl px-5 py-5 text-left text-white shadow-[0_18px_40px_-16px_rgba(232,107,90,0.6)] active:scale-[0.99] transition"
          style={{ background: "var(--gradient-rouge)" }}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 backdrop-blur-md">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[15px] font-semibold">新建互动文游</div>
              <div className="mt-0.5 text-[11px] text-white/80">上传或粘贴小说，AI 一键改编</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4" />
        </button>
      </section>

      <section className="mt-7 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-neutral-900">我的作品</h3>
          <span className="text-[11px] text-neutral-400">{drafts.length} 部</span>
        </div>
        <div className="space-y-3">
          {drafts.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-3">
              <img src={d.cover} alt={d.title} className="h-16 w-12 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium text-neutral-900">{d.title}</div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
                  <span className="rounded-sm bg-black/[0.06] px-1.5 py-0.5 text-[10px]">{d.status}</span>
                  <span>{d.updated}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 px-5">
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" style={{ color: "var(--rouge)" }} />
            <span className="text-[12px] font-medium text-neutral-900">创作指引</span>
          </div>
          <p className="mt-2 text-[12px] leading-6 text-neutral-600">
            建议上传 1 万字以上的完整故事，AI 将自动拆解章节、人物与场景，并生成可代入的角色卡。
          </p>
        </div>
      </section>
    </div>
  );
}

function FriendsTab() {
  const friends = [
    { id: "1", name: "执笔ang", note: "正在玩《重生之贵女难求》", online: true },
    { id: "2", name: "墨白", note: "刚完成一个改编草稿", online: true },
    { id: "3", name: "青衫客", note: "3 天前在线", online: false },
    { id: "4", name: "云栖", note: "邀请你共读《长安花事》", online: false },
  ];
  return (
    <div className="relative h-full overflow-y-auto bg-[#fbf7ef] pb-24 no-scrollbar">
      <header className="sticky top-0 z-20 bg-[#fbf7ef]/90 px-5 pb-3 pt-12 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h1 className="font-brush text-2xl text-neutral-900">好友</h1>
          <button className="rounded-full bg-black/[0.05] px-3 py-1.5 text-[11px] text-neutral-700">+ 添加</button>
        </div>
      </header>

      <section className="px-5 pt-2">
        <div className="rounded-2xl border border-black/5 bg-white">
          {friends.map((f, i) => (
            <div key={f.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-black/5" : ""}`}>
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#e86b5a] to-[#c0392b] text-[13px] font-medium text-white">
                  {f.name.slice(0, 1)}
                </div>
                {f.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-neutral-900">{f.name}</div>
                <div className="mt-0.5 truncate text-[11px] text-neutral-500">{f.note}</div>
              </div>
              <button className="rounded-full bg-black/[0.05] px-3 py-1.5 text-[11px] text-neutral-700">邀玩</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MeTab() {
  return (
    <div className="relative h-full overflow-y-auto bg-[#fbf7ef] pb-24 no-scrollbar">
      <header className="px-5 pt-12">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#e86b5a] to-[#c0392b] text-[20px] font-medium text-white">
            雁
          </div>
          <div className="min-w-0">
            <div className="text-[16px] font-semibold text-neutral-900">寒雁</div>
            <div className="mt-0.5 text-[11px] text-neutral-500">ID · 20260628 · 加入 32 天</div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-black/5 bg-white p-4 text-center">
          {[
            { k: "已玩", v: "12" },
            { k: "已创作", v: "2" },
            { k: "好友", v: "8" },
          ].map((s) => (
            <div key={s.k}>
              <div className="text-[18px] font-semibold text-neutral-900">{s.v}</div>
              <div className="mt-0.5 text-[10px] text-neutral-500">{s.k}</div>
            </div>
          ))}
        </div>
      </header>

      <section className="mt-6 px-5">
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
          {[
            "我的收藏",
            "游玩记录",
            "通知设置",
            "隐私与安全",
            "帮助与反馈",
          ].map((label, i) => (
            <button
              key={label}
              className={`flex w-full items-center justify-between px-4 py-3.5 text-left text-[13px] text-neutral-800 ${
                i > 0 ? "border-t border-black/5" : ""
              }`}
            >
              <span>{label}</span>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function BottomNav({ tab, setTab }: { tab: TabKey; setTab: (t: TabKey) => void }) {
  const items: { key: TabKey; label: string; Icon: typeof Home }[] = [
    { key: "home", label: "互动文游", Icon: Home },
    { key: "create", label: "我的创作", Icon: PenLine },
    { key: "friends", label: "好友", Icon: Users },
    { key: "me", label: "我的", Icon: UserRound },
  ];
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/95 backdrop-blur-md">
      <div className="flex items-stretch justify-around px-2 pb-2 pt-1.5">
        {items.map(({ key, label, Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex flex-1 flex-col items-center gap-0.5 py-1"
            >
              <Icon
                className={`h-5 w-5 transition ${active ? "" : "text-neutral-400"}`}
                style={active ? { color: "var(--rouge)" } : undefined}
              />
              <span
                className={`text-[10px] transition ${active ? "font-medium" : "text-neutral-400"}`}
                style={active ? { color: "var(--rouge)" } : undefined}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function HubPage() {
  const [tab, setTab] = useState<TabKey>("home");
  return (
    <PhoneMockup>
      <div className="relative h-full">
        {tab === "home" && <GameHub />}
        {tab === "create" && <CreateTab />}
        {tab === "friends" && <FriendsTab />}
        {tab === "me" && <MeTab />}
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </PhoneMockup>
  );
}
