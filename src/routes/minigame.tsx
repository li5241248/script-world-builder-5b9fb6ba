import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ChevronLeft, Map as MapIcon, Paperclip, Puzzle, X, Check, Share2, Sparkles } from "lucide-react";
import { PhoneMockup } from "@/components/PhoneMockup";
import malePortrait from "@/assets/minigame-character-male.png";
import femalePortrait from "@/assets/minigame-character-female.png";
import matronPortrait from "@/assets/minigame-character-matron.png";
import scene1 from "@/assets/minigame-scene-1.png";
import scene2 from "@/assets/minigame-scene-2.png";
import scene3 from "@/assets/minigame-scene-3.png";
import scene4 from "@/assets/minigame-scene-4.png";
import scene5 from "@/assets/minigame-scene-5.png";

export const Route = createFileRoute("/minigame")({
  component: MinigamePage,
  ssr: false,
  head: () => ({
    meta: [
      { title: "贵女探案录 · 身世之谜" },
      { name: "description", content: "古风推理小游戏" },
    ],
  }),
});

/* ============ Data ============ */

type SceneId =
  | "qingqiu" | "furong" | "gongtong" | "tianlao"
  | "xuanqing" | "shunchang" | "apobi";

type Scene = {
  id: SceneId;
  name: string;
  icon: string;
  gradient: string;
  backgroundImage?: string;
  hotspots: { id: string; clueId: string; x: string; y: string; label: string }[];
  npcId?: string;
};

const SCENES: Scene[] = [
  {
    id: "qingqiu", name: "清秋苑", icon: "🍂",
    gradient: "linear-gradient(135deg,#2a1a1a 0%,#1a2a1a 100%)",
    backgroundImage: scene1,
    npcId: "chenmama",
    hotspots: [
      { id: "h1", clueId: "letter_mother", x: "22%", y: "38%", label: "妆奁" },
      { id: "h2", clueId: "portrait_clue", x: "70%", y: "55%", label: "画像" },
    ],
  },
  {
    id: "furong", name: "芙蓉园", icon: "🌺",
    gradient: "linear-gradient(135deg,#2a1a2a 0%,#1a2a1a 100%)",
    backgroundImage: scene2,
    npcId: "jiaomeng",
    hotspots: [
      { id: "h1", clueId: "prescription", x: "30%", y: "60%", label: "药案" },
      { id: "h2", clueId: "pillow_clue", x: "68%", y: "40%", label: "软枕" },
    ],
  },
  {
    id: "gongtong", name: "珙桐苑", icon: "🌳",
    gradient: "linear-gradient(135deg,#1a1a2a 0%,#2a1a1a 100%)",
    backgroundImage: scene3,
    hotspots: [
      { id: "h1", clueId: "letter_zhou", x: "26%", y: "44%", label: "暗格" },
      { id: "h2", clueId: "poison_bottle", x: "72%", y: "62%", label: "妆台" },
    ],
  },
  {
    id: "tianlao", name: "天牢", icon: "⛓️",
    gradient: "linear-gradient(135deg,#0a0a0a 0%,#151515 100%)",
    backgroundImage: scene4,
    npcId: "meiyiniang",
    hotspots: [],
  },
  {
    id: "xuanqing", name: "玄清王府", icon: "🏯",
    gradient: "linear-gradient(135deg,#1a1a2e 0%,#0a1a3a 100%)",
    backgroundImage: scene5,
    npcId: "wutaiyi",
    hotspots: [{ id: "h1", clueId: "medical_record", x: "50%", y: "50%", label: "医案" }],
  },
  {
    id: "shunchang", name: "顺昌武馆", icon: "⚔️",
    gradient: "linear-gradient(135deg,#2a2a1a 0%,#1a2a2a 100%)",
    npcId: "yangqi",
    hotspots: [{ id: "h1", clueId: "tangmen_token", x: "50%", y: "55%", label: "兵架" }],
  },
  {
    id: "apobi", name: "城外破屋", icon: "🏚️",
    gradient: "linear-gradient(135deg,#1a1a1a 0%,#2a2a1a 100%)",
    hotspots: [
      { id: "h1", clueId: "silk_handkerchief", x: "32%", y: "50%", label: "残箱" },
      { id: "h2", clueId: "candle_clue", x: "70%", y: "48%", label: "烛台" },
    ],
  },
];

type ClueCategory = "书信" | "证物" | "文书" | "信物" | "口供" | "真相";

type Clue = {
  id: string;
  name: string;
  icon: string;
  category: ClueCategory;
  short: string;
  full: string;
};

const CLUES: Record<string, Clue> = {
  // 清秋苑
  letter_mother: { id: "letter_mother", name: "娘亲遗信", icon: "📜", category: "书信", short: "母亲临终所留半残书信", full: "信纸已泛黄，落款被血迹遮蔽，依稀可辨「乔」字一角，似与外人通信。" },
  portrait_clue: { id: "portrait_clue", name: "画像疑点", icon: "🖼️", category: "证物", short: "幼时画像中容貌略异", full: "画中女童眉宇与庄仕洋夫妇皆不相像，反倒与传闻中东侯王少年面容有七分神似。" },
  // 芙蓉园
  prescription: { id: "prescription", name: "安胎药方", icon: "📋", category: "文书", short: "出自王氏的旧药方", full: "药方上注明日期早于翰焰出生九月有余——药本是给王氏服用，却从未真正煎过。" },
  pillow_clue: { id: "pillow_clue", name: "假孕枕头", icon: "🛏️", category: "证物", short: "中空塞布的孕枕", full: "枕中以软布与药包伪装腹隆，足见当年怀孕之事是一场精心安排。" },
  // 珙桐苑
  letter_zhou: { id: "letter_zhou", name: "周氏密信", icon: "📜", category: "书信", short: "周氏与外人密谋之信", full: "信中议及「掉换婴孩」「灭口接生婆」等语，字迹与庄府账房一致。" },
  poison_bottle: { id: "poison_bottle", name: "毒药瓶", icon: "💊", category: "证物", short: "残留鹤顶红的小瓷瓶", full: "瓶口磨损，曾多次开启，与陈妈妈所述「夫人忽病暴卒」时辰吻合。" },
  // 玄清王府
  medical_record: { id: "medical_record", name: "吴太医医案", icon: "📖", category: "文书", short: "记载东侯王旧伤的医案", full: "案中详记东侯王二十年前胸前剑伤一道——而翰焰幼时亦曾梦呓提及「胸前长疤的爹爹」。" },
  // 顺昌武馆
  tangmen_token: { id: "tangmen_token", name: "唐门令牌", icon: "🗡️", category: "信物", short: "刻有「乔」字的唐门暗令", full: "令牌乃唐门嫡系所持，背面阴刻「乔」字小印，正是当年唐小乔的随身信物。" },
  // 城外破屋
  silk_handkerchief: { id: "silk_handkerchief", name: "绣乔字锦帕", icon: "🧣", category: "信物", short: "绣有「乔」字的旧锦帕", full: "帕角绣「乔」字一枚，针法精致，与唐门令牌字形一致，乃唐小乔旧物。" },
  candle_clue: { id: "candle_clue", name: "烧残信纸", icon: "🕯️", category: "证物", short: "几片未燃尽的字纸", full: "依稀可辨「东侯」「孩儿」「托付」字样，似是当年托孤之信。" },

  // NPC 口供
  clue_mother_love: { id: "clue_mother_love", name: "母怀深情", icon: "🕊️", category: "口供", short: "陈妈妈：王氏待翰焰视如己出", full: "陈妈妈说，王氏自始至终待翰焰极好，然临终竟低声唤她「焰儿，对不起娘亲，你不是……」" },
  clue_father_cold: { id: "clue_father_cold", name: "父薄如纸", icon: "❄️", category: "口供", short: "陈妈妈：庄仕洋从不亲近翰焰", full: "庄仕洋表面慈父，私下从不抱翰焰，每见之必避——陈妈妈疑其早知翰焰非己出。" },
  clue_abi_info: { id: "clue_abi_info", name: "破屋秘闻", icon: "🏚️", category: "口供", short: "陈妈妈：城外破屋是接生之地", full: "当年城外破屋中曾住一名年轻女子，由一位贵人秘密接生，事后下落不明。" },
  clue_fake_pregnancy: { id: "clue_fake_pregnancy", name: "假孕惊闻", icon: "🤫", category: "口供", short: "娇梦：王氏从未真孕", full: "娇梦低声说，当年王氏「有孕」期间，从不召太医诊脉，腹围每月却恰好递增——分明是装的。" },
  clue_not_zhuang: { id: "clue_not_zhuang", name: "非庄府血", icon: "🩸", category: "口供", short: "娇梦：翰焰非庄府血脉", full: "娇梦言之凿凿：「府中老人都晓得，小姐不是庄家的血。」" },
  clue_truth_birth: { id: "clue_truth_birth", name: "身世真相", icon: "🌑", category: "口供", short: "媚姨娘：翰焰乃顶替之婴", full: "媚姨娘在狱中泣道：「当年是我亲手将她从破屋抱回，换下王氏怀中早已夭折的孩儿。」" },
  clue_donghou_father: { id: "clue_donghou_father", name: "东侯托孤", icon: "👑", category: "口供", short: "媚姨娘 & 杨琦：东侯王是生父", full: "东侯王被害前夕，将襁褓中的女儿托付亲信，由唐小乔诞下，藏于庄府以避祸。" },
  clue_look_alike: { id: "clue_look_alike", name: "容貌相肖", icon: "👤", category: "口供", short: "吴太医：翰焰极似东侯王", full: "吴太医道：「我曾为东侯王诊治多年，小姐眉眼，与他年少时一般无二。」" },
  clue_massacre: { id: "clue_massacre", name: "东侯灭门", icon: "🔥", category: "口供", short: "吴太医：东侯一门遭灭", full: "二十年前，东侯王府一夜火起，满门皆丧，唯独不见幼女尸首。" },
  clue_taihou_role: { id: "clue_taihou_role", name: "太后授意", icon: "🐉", category: "口供", short: "吴太医：太后早知一切", full: "太后命人封口，并暗中保留翰焰性命，似有更深谋划。" },
  clue_tangmen: { id: "clue_tangmen", name: "唐门旧事", icon: "🗡️", category: "口供", short: "杨琦：唐门旧主姓乔", full: "唐门嫡女唐小乔，二十年前神秘失踪，江湖传言与东侯王有染。" },
  clue_donghou: { id: "clue_donghou", name: "东侯遗孤", icon: "🌒", category: "口供", short: "杨琦：东侯王留有一女", full: "「东侯王临终前确有一女，由唐小乔所诞，托付亲信带走。」" },
  clue_donghou_hero: { id: "clue_donghou_hero", name: "东侯忠烈", icon: "🏵️", category: "口供", short: "杨琦：东侯并非乱党", full: "东侯王生前忠君爱民，遭奸臣陷害「谋逆」之名，实为冤案。" },
  clue_xiaoqiao: { id: "clue_xiaoqiao", name: "小乔避难", icon: "🌸", category: "口供", short: "杨琦：唐小乔避祸破屋", full: "唐小乔产女后避祸于城外破屋，留下绣「乔」字锦帕一方为信。" },
};

type NpcId = "chenmama" | "jiaomeng" | "meiyiniang" | "wutaiyi" | "yangqi";

type Npc = {
  id: NpcId;
  name: string;
  title: string;
  avatar: string;
  portrait?: string;
  sceneId: SceneId;
  dialogues: { q: string; a: string; clueId: string }[];
};

const NPCS: Record<NpcId, Npc> = {
  chenmama: {
    id: "chenmama", name: "陈妈妈", title: "清秋苑老仆", avatar: "👵", portrait: matronPortrait, sceneId: "qingqiu",
    dialogues: [
      { q: "夫人临终可有遗言？", a: "夫人最后一句，是抱着小姐喃喃道「焰儿，对不起娘亲，你不是……」便去了。", clueId: "clue_mother_love" },
      { q: "老爷待小姐如何？", a: "老爷表面慈父，私下却从不抱小姐，每见必避，怕是早知什么。", clueId: "clue_father_cold" },
      { q: "可知城外那间破屋？", a: "那破屋里头当年住过一位年轻女子，由贵人秘密接生，事毕便不见了。", clueId: "clue_abi_info" },
    ],
  },
  jiaomeng: {
    id: "jiaomeng", name: "娇梦", title: "芙蓉园侍婢", avatar: "👩", portrait: femalePortrait, sceneId: "furong",
    dialogues: [
      { q: "夫人当年怀孕可有蹊跷？", a: "夫人「有孕」时从不召太医诊脉，腹围每月却递增——分明是装的。", clueId: "clue_fake_pregnancy" },
      { q: "府中可有别样传闻？", a: "（压低声）老人都晓得，小姐根本不是庄家的血。", clueId: "clue_not_zhuang" },
      { q: "你怎敢说这等话？", a: "婢子只说自己亲眼所见，姑娘信不信，全凭您。", clueId: "clue_not_zhuang" },
    ],
  },
  meiyiniang: {
    id: "meiyiniang", name: "媚姨娘", title: "天牢罪人", avatar: "🥀", portrait: matronPortrait, sceneId: "tianlao",
    dialogues: [
      { q: "你究竟做了什么？", a: "当年是我亲手将你从破屋抱回，换下王氏怀中早已夭折的孩儿。", clueId: "clue_truth_birth" },
      { q: "我的生父是谁？", a: "东侯王。他临终之夜，把襁褓中的你托给亲信，由唐小乔诞下，藏于庄府避祸。", clueId: "clue_donghou_father" },
      { q: "你可有悔意？", a: "悔？我若有悔，便不会一辈子守着这桩秘密了。", clueId: "clue_truth_birth" },
    ],
  },
  wutaiyi: {
    id: "wutaiyi", name: "吴太医", title: "玄清王府御医", avatar: "👴", portrait: malePortrait, sceneId: "xuanqing",
    dialogues: [
      { q: "您可识得东侯王？", a: "我曾为东侯王诊治多年，姑娘眉眼，与他年少时一般无二。", clueId: "clue_look_alike" },
      { q: "东侯王一门何以灭绝？", a: "二十年前一夜火起，满门皆丧，唯不见幼女尸首。", clueId: "clue_massacre" },
      { q: "此事太后可知？", a: "太后早已知情，封人之口，留你性命，怕是另有谋划。", clueId: "clue_taihou_role" },
    ],
  },
  yangqi: {
    id: "yangqi", name: "杨琦", title: "顺昌武馆教头", avatar: "🧔", portrait: malePortrait, sceneId: "shunchang",
    dialogues: [
      { q: "唐门旧主何人？", a: "唐门嫡女唐小乔，二十年前神秘失踪，传言与东侯王有染。", clueId: "clue_tangmen" },
      { q: "东侯可曾留有后人？", a: "确有一女，由唐小乔所诞，托付亲信带走。", clueId: "clue_donghou" },
      { q: "东侯王究竟为人如何？", a: "他忠君爱民，「谋逆」实为冤案。小乔避祸破屋，留绣「乔」字锦帕一方。", clueId: "clue_donghou_hero" },
    ],
  },
};

const GOLD = "#c9a96e";
const TOTAL_CLUES = 24;

/* ============ State ============ */

type View =
  | { kind: "scene"; sceneId: SceneId }
  | { kind: "dialogue"; npcId: NpcId; sceneId: SceneId }
  | { kind: "victory" };

function MinigamePage() {
  return (
    <PhoneMockup>
      <Game />
    </PhoneMockup>
  );
}

function Game() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<View>({ kind: "scene", sceneId: "qingqiu" });
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<SceneId>>(new Set(["qingqiu"]));
  const [showMap, setShowMap] = useState(false);
  const [showClues, setShowClues] = useState(false);
  const [showDeduce, setShowDeduce] = useState(false);
  const [discoveredClueId, setDiscoveredClueId] = useState<string | null>(null);
  const [expandedClueId, setExpandedClueId] = useState<string | null>(null);
  const [npcDialogueUsed, setNpcDialogueUsed] = useState<Record<string, Set<number>>>({});
  const [toast, setToast] = useState<string | null>(null);


  const collectClue = (id: string) => {
    if (collected.has(id)) {
      setToast("此线索已收入");
      setTimeout(() => setToast(null), 1200);
      return;
    }
    setDiscoveredClueId(id);
  };
  const confirmCollect = () => {
    if (!discoveredClueId) return;
    setCollected((s) => new Set(s).add(discoveredClueId));
    setDiscoveredClueId(null);
  };

  const gotoScene = (id: SceneId) => {
    setView({ kind: "scene", sceneId: id });
    setVisited((v) => new Set(v).add(id));
    setShowMap(false);
  };

  return (
    <div className="relative h-full overflow-hidden bg-black text-white" style={{ fontFamily: "'Noto Serif SC', serif" }}>
      {/* parchment grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-50 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {view.kind === "scene" && (
        <SceneView
          scene={SCENES.find((s) => s.id === view.sceneId)!}
          collected={collected}
          onHotspot={(clueId) => collectClue(clueId)}
          onNpc={(npcId) => setView({ kind: "dialogue", npcId, sceneId: view.sceneId })}
          onBack={() => navigate({ to: "/play", search: { role: "hanyan", mode: "solo", partner: "peirong" } })}
          onMap={() => setShowMap(true)}
          onClues={() => setShowClues(true)}
          onDeduce={() => setShowDeduce(true)}
        />
      )}

      {view.kind === "dialogue" && (
        <DialogueView
          npc={NPCS[view.npcId]}
          usedIdx={npcDialogueUsed[view.npcId] ?? new Set()}
          collected={collected}
          onPick={(i, clueId) => {
            setNpcDialogueUsed((m) => {
              const next = { ...m };
              const s = new Set(next[view.npcId] ?? []);
              s.add(i);
              next[view.npcId] = s;
              return next;
            });
            if (!collected.has(clueId)) collectClue(clueId);
          }}
          onClose={() => setView({ kind: "scene", sceneId: view.sceneId })}
        />
      )}

      {view.kind === "victory" && <VictoryView onExit={() => navigate({ to: "/play", search: { role: "hanyan", mode: "solo", partner: "peirong" } })} />}

      {/* Discovery modal */}
      {discoveredClueId && (
        <ClueDiscoveryModal clue={CLUES[discoveredClueId]} onConfirm={confirmCollect} />
      )}

      {/* Clue detail modal */}
      {expandedClueId && (
        <ClueDetailModal clue={CLUES[expandedClueId]} onClose={() => setExpandedClueId(null)} />
      )}

      {/* Map drawer */}
      {showMap && (
        <MapDrawer
          currentId={view.kind === "scene" ? view.sceneId : null}
          visited={visited}
          onGo={gotoScene}
          onClose={() => setShowMap(false)}
        />
      )}

      {/* Clue drawer */}
      {showClues && (
        <CluePanel
          collected={collected}
          onExpand={(id) => setExpandedClueId(id)}
          onClose={() => setShowClues(false)}
        />
      )}

      {/* Deduction */}
      {showDeduce && (
        <DeductionPanel
          collected={collected}
          onClose={() => setShowDeduce(false)}
          onWin={() => {
            setShowDeduce(false);
            setView({ kind: "victory" });
          }}
        />
      )}

      {toast && (
        <div className="absolute left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-[12px] text-white backdrop-blur">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ============ Scene View ============ */

function SceneView({
  scene, collected, onHotspot, onNpc, onBack, onMap, onClues, onDeduce,
}: {
  scene: Scene;
  collected: Set<string>;
  onHotspot: (clueId: string) => void;
  onNpc: (npcId: NpcId) => void;
  onBack: () => void;
  onMap: () => void;
  onClues: () => void;
  onDeduce: () => void;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 0%, #2a1a10 0%, #140c08 55%, #070503 100%)",
      }}
    >
      {/* parchment / ink-splatter atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(201,169,110,0.18), transparent 35%), radial-gradient(circle at 88% 82%, rgba(201,169,110,0.12), transparent 40%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-10 pb-2">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur active:scale-95"
          style={{ border: `1px solid ${GOLD}55` }}
        >
          <ChevronLeft size={18} style={{ color: GOLD }} />
        </button>
        <div className="text-center">
          <div className="text-[10px] tracking-[0.45em]" style={{ color: `${GOLD}99` }}>
            ─ 探 案 录 ─
          </div>
          <div
            className="font-brush text-[24px] tracking-[0.3em]"
            style={{
              color: GOLD,
              textShadow: `0 1px 0 #00000099, 0 0 18px ${GOLD}55`,
            }}
          >
            {scene.name}
          </div>
        </div>
        <div
          className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] backdrop-blur"
          style={{ border: `1px solid ${GOLD}55`, color: GOLD }}
        >
          {collected.size}/{TOTAL_CLUES}
        </div>
      </div>

      {/* ornate framed scene */}
      <div className="relative z-10 mx-auto mt-3 h-[58%] w-[90%]">
        {/* outer gilded frame */}
        <div
          className="relative h-full w-full p-[10px]"
          style={{
            background:
              "linear-gradient(135deg,#3a2a18 0%,#6b4f2a 25%,#c9a96e 50%,#6b4f2a 75%,#2a1d10 100%)",
            borderRadius: 14,
            boxShadow:
              "0 0 0 1px #2a1d10, 0 10px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,220,160,0.25)",
          }}
        >
          {/* inner thin border */}
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              borderRadius: 6,
              border: `1px solid ${GOLD}aa`,
              boxShadow: `inset 0 0 0 1px #000, inset 0 0 60px rgba(0,0,0,0.6)`,
              background: scene.gradient,
            }}
          >
            {scene.backgroundImage && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${scene.backgroundImage})` }}
              />
            )}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.6) 100%)",
              }}
            />
            {!scene.backgroundImage && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                <span className="text-[160px]" style={{ color: GOLD }}>
                  {scene.icon}
                </span>
              </div>
            )}

            {/* corner ornaments */}
            {(["tl", "tr", "bl", "br"] as const).map((c) => (
              <span
                key={c}
                className="pointer-events-none absolute h-4 w-4"
                style={{
                  top: c.startsWith("t") ? 4 : undefined,
                  bottom: c.startsWith("b") ? 4 : undefined,
                  left: c.endsWith("l") ? 4 : undefined,
                  right: c.endsWith("r") ? 4 : undefined,
                  borderTop: c.startsWith("t") ? `1.5px solid ${GOLD}` : undefined,
                  borderBottom: c.startsWith("b") ? `1.5px solid ${GOLD}` : undefined,
                  borderLeft: c.endsWith("l") ? `1.5px solid ${GOLD}` : undefined,
                  borderRight: c.endsWith("r") ? `1.5px solid ${GOLD}` : undefined,
                }}
              />
            ))}

            {/* hotspots */}
            {scene.hotspots.map((h) => {
              const done = collected.has(h.clueId);
              return (
                <button
                  key={h.id}
                  onClick={() => onHotspot(h.clueId)}
                  className="absolute flex flex-col items-center"
                  style={{ left: h.x, top: h.y, transform: "translate(-50%,-50%)" }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{
                      background: done ? `${GOLD}33` : `${GOLD}1a`,
                      border: `1.5px solid ${GOLD}`,
                      boxShadow: done ? "none" : `0 0 0 0 ${GOLD}99`,
                      animation: done ? undefined : "huntPulse 2s ease-in-out infinite",
                    }}
                  >
                    {done ? <Check size={18} style={{ color: GOLD }} /> : <span className="text-lg">🔍</span>}
                  </span>
                  <span
                    className="mt-1 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px]"
                    style={{ color: GOLD }}
                  >
                    {h.label}
                  </span>
                </button>
              );
            })}

            {scene.hotspots.length === 0 && !scene.npcId && (
              <div className="flex h-full items-center justify-center text-[12px]" style={{ color: `${GOLD}88` }}>
                此处空无一物
              </div>
            )}

            {scene.npcId && (
              <button
                onClick={() => onNpc(scene.npcId as NpcId)}
                className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{ background: "rgba(20,12,6,0.85)", border: `1px solid ${GOLD}` }}
              >
                <span
                  className="flex h-7 w-7 overflow-hidden rounded-full bg-black/50"
                  style={{ border: `1px solid ${GOLD}66` }}
                >
                  <img
                    src={NPCS[scene.npcId as NpcId].portrait ?? ""}
                    alt={NPCS[scene.npcId as NpcId].name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </span>
                <span className="text-[12px]" style={{ color: GOLD }}>
                  与 {NPCS[scene.npcId as NpcId].name} 对话
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* bottom medallion action bar */}
      <div className="absolute bottom-5 left-0 right-0 z-10 flex justify-center gap-4 px-6">
        <MedallionBtn icon={<MapIcon size={18} />} label="舆图" onClick={onMap} />
        <MedallionBtn icon={<Paperclip size={18} />} label="线索" onClick={onClues} badge={collected.size} />
        <MedallionBtn icon={<Puzzle size={18} />} label="推理" onClick={onDeduce} />
      </div>

      <style>{`
        @keyframes huntPulse {
          0%, 100% { box-shadow: 0 0 0 0 ${GOLD}88; }
          50% { box-shadow: 0 0 0 10px ${GOLD}00; }
        }
      `}</style>
    </div>
  );
}

function MedallionBtn({
  icon, label, onClick, badge,
}: { icon: React.ReactNode; label: string; onClick: () => void; badge?: number }) {
  return (
    <button onClick={onClick} className="relative flex flex-col items-center active:scale-95">
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #f3d98a 0%, #c9a96e 45%, #6b4f2a 100%)",
          border: "1.5px solid #3a2a18",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.35)",
          color: "#2a1d10",
        }}
      >
        {icon}
        {typeof badge === "number" && badge > 0 && (
          <span
            className="absolute -right-1 -top-1 rounded-full px-1.5 text-[10px]"
            style={{ background: "#2a1d10", color: GOLD, border: `1px solid ${GOLD}` }}
          >
            {badge}
          </span>
        )}
      </span>
      <span
        className="mt-1 font-brush text-[12px] tracking-[0.2em]"
        style={{ color: GOLD, textShadow: "0 1px 0 #000" }}
      >
        {label}
      </span>
    </button>
  );
}

/* ============ Dialogue ============ */

function DialogueView({ npc, usedIdx, collected, onPick, onClose }: {
  npc: Npc;
  usedIdx: Set<number>;
  collected: Set<string>;
  onPick: (i: number, clueId: string) => void;
  onClose: () => void;
}) {
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);
  const [lastClueGained, setLastClueGained] = useState<string | null>(null);

  const sceneBg = (npc as Npc & { sceneBg?: string }).sceneBg;

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "radial-gradient(120% 80% at 50% 0%, #1f1610 0%, #0d0805 60%, #050302 100%)" }}>
      {/* faint scene backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: sceneBg ? `url(${sceneBg})` : undefined,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(2px) saturate(0.6)",
        }}
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.75))" }} />

      {/* Header */}
      <div className="relative z-10 flex items-center px-4 pt-10 pb-2">
        <button onClick={onClose} className="flex h-10 w-10 items-center justify-center" style={{ color: GOLD }}>
          <ChevronLeft size={26} strokeWidth={2.2} />
        </button>
        <div className="flex flex-1 items-center justify-center gap-3">
          <Flourish flip />
          <div
            className="font-brush text-[22px] tracking-[0.3em]"
            style={{
              background: "linear-gradient(180deg,#fbe5a8 0%,#d4a560 60%,#8a5a20 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >对话</div>
          <Flourish />
        </div>
        <div className="w-10" />
      </div>

      {/* Portrait + name */}
      <div className="relative z-10 flex items-center gap-4 px-6 pt-2">
        <div className="relative h-[92px] w-[92px] shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, #2a1f15 0%, #0d0805 75%)",
              border: `2px solid ${GOLD}`,
              boxShadow: `0 0 24px ${GOLD}55, inset 0 0 0 4px rgba(0,0,0,0.6), inset 0 0 0 5px ${GOLD}66`,
            }}
          />
          <img
            src={npc.portrait ?? ""} alt={npc.name}
            className="absolute inset-[6px] rounded-full object-cover"
            style={{ width: "calc(100% - 12px)", height: "calc(100% - 12px)" }}
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="font-brush text-[28px] tracking-[0.12em]"
            style={{
              background: "linear-gradient(180deg,#fbe5a8 0%,#d4a560 60%,#8a5a20 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >{npc.name}</div>
          <div className="mt-1 text-[12px] tracking-[0.1em]" style={{ color: `${GOLD}aa` }}>{npc.title}</div>
        </div>
      </div>

      {/* Dialogue box */}
      <div className="relative z-10 mt-5 px-5">
        <div
          className="relative min-h-[110px] px-5 py-4 text-[13.5px] leading-[1.9]"
          style={{
            background: "linear-gradient(180deg, rgba(40,28,16,0.55) 0%, rgba(15,10,6,0.55) 100%)",
            border: `1px solid ${GOLD}88`,
            borderRadius: 10,
            color: "#e8d4a8",
            boxShadow: "inset 0 0 24px rgba(0,0,0,0.5)",
          }}
        >
          <span aria-hidden style={{ position: "absolute", inset: 4, border: `1px solid ${GOLD}33`, borderRadius: 7, pointerEvents: "none" }} />
          {lastAnswer ?? "（请择一相问）"}
        </div>
      </div>

      {/* Question pills */}
      <div className="absolute bottom-8 left-0 right-0 z-10 space-y-3 px-5">
        {npc.dialogues.map((d, i) => {
          const used = usedIdx.has(i);
          return (
            <button
              key={i}
              onClick={() => {
                setLastAnswer(d.a);
                setLastClueGained(collected.has(d.clueId) ? null : d.clueId);
                onPick(i, d.clueId);
              }}
              disabled={used}
              className="relative w-full overflow-hidden text-center text-[14px] tracking-[0.08em] transition active:scale-[0.99] disabled:opacity-50"
              style={{
                padding: "12px 44px",
                background: used
                  ? "linear-gradient(180deg, rgba(30,20,10,0.85) 0%, rgba(15,10,6,0.85) 100%)"
                  : "linear-gradient(180deg, rgba(45,30,15,0.9) 0%, rgba(20,12,6,0.9) 100%)",
                border: `1px solid ${used ? `${GOLD}44` : GOLD}`,
                borderRadius: 4,
                color: used ? `${GOLD}88` : "#f0d896",
                boxShadow: used ? "none" : `inset 0 0 0 1px ${GOLD}33, 0 2px 10px rgba(0,0,0,0.5)`,
              }}
            >
              <PillOrnament side="left" color={GOLD} dim={used} />
              <PillOrnament side="right" color={GOLD} dim={used} />
              {used ? "已问 · " : ""}{d.q}
            </button>
          );
        })}
      </div>

      {lastClueGained && (
        <div
          key={lastClueGained}
          className="absolute right-4 top-24 z-20 flex items-center gap-2 rounded-lg px-3 py-2 text-[12px]"
          style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}`, color: GOLD, animation: "slideInRight 0.4s ease-out" }}
        >
          <Sparkles size={14} /> 获得线索：{CLUES[lastClueGained].name}
        </div>
      )}
      <style>{`@keyframes slideInRight { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }`}</style>
    </div>
  );
}

function Flourish({ flip }: { flip?: boolean }) {
  return (
    <svg width="56" height="14" viewBox="0 0 56 14" fill="none" style={{ transform: flip ? "scaleX(-1)" : undefined, opacity: 0.85 }}>
      <path d="M2 7 Q14 1 26 7 T54 7" stroke={GOLD} strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="14" cy="5" r="1.2" fill={GOLD} />
      <circle cx="40" cy="9" r="1.2" fill={GOLD} />
      <path d="M48 4 Q52 7 48 10" stroke={GOLD} strokeWidth="1" fill="none" />
    </svg>
  );
}

function PillOrnament({ side, color, dim }: { side: "left" | "right"; color: string; dim?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top: "50%",
        [side]: 8,
        transform: "translateY(-50%)",
        opacity: dim ? 0.4 : 0.9,
      } as React.CSSProperties}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2 L18 11 L11 20 L4 11 Z" stroke={color} strokeWidth="1" fill="none" />
        <circle cx="11" cy="11" r="2.2" fill={color} opacity="0.7" />
      </svg>
    </span>
  );
}


/* ============ Map ============ */

function MapDrawer({ currentId, visited, onGo, onClose }: {
  currentId: SceneId | null;
  visited: Set<SceneId>;
  onGo: (id: SceneId) => void;
  onClose: () => void;
}) {
  return (
    <Drawer title="舆 图" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        {SCENES.map((s) => {
          const cur = currentId === s.id;
          const v = visited.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => onGo(s.id)}
              className="relative h-[110px] overflow-hidden rounded-xl p-3 text-left active:scale-[0.98]"
              style={{
                backgroundImage: s.backgroundImage ? `url(${s.backgroundImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                background: s.backgroundImage ? undefined : s.gradient,
                border: `1.5px solid ${cur ? GOLD : `${GOLD}44`}`,
                boxShadow: cur ? `0 0 16px ${GOLD}66` : "none",
              }}
            >
              {/* dark overlay for readability */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)",
                }}
              />
              <div className="relative">
                <div className="text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{s.icon}</div>
                <div className="mt-1 font-brush text-[15px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" style={{ color: GOLD }}>{s.name}</div>
                <div className="text-[10px]" style={{ color: cur ? GOLD : v ? `${GOLD}99` : `${GOLD}77` }}>
                  {cur ? "当前所在" : v ? "已探访" : "未探访"}
                </div>
              </div>
            </button>
          );

        })}
      </div>
    </Drawer>
  );
}

/* ============ Clue panel ============ */

const CATS: ClueCategory[] = ["书信", "证物", "文书", "信物", "口供", "真相"];

function CluePanel({ collected, onExpand, onClose }: {
  collected: Set<string>;
  onExpand: (id: string) => void;
  onClose: () => void;
}) {
  const grouped = useMemo(() => {
    const g: Record<ClueCategory, Clue[]> = { 书信: [], 证物: [], 文书: [], 信物: [], 口供: [], 真相: [] };
    collected.forEach((id) => { const c = CLUES[id]; if (c) g[c.category].push(c); });
    return g;
  }, [collected]);

  return (
    <Drawer title={`线索册 · ${collected.size}/${TOTAL_CLUES}`} onClose={onClose}>
      {collected.size === 0 && <div className="py-10 text-center text-[13px]" style={{ color: `${GOLD}88` }}>尚未收得只字片纸</div>}
      <div className="space-y-4">
        {CATS.map((cat) => grouped[cat].length > 0 && (
          <div key={cat}>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ background: GOLD, color: "#1a1410" }}>{cat}</span>
              <span className="text-[10px]" style={{ color: `${GOLD}88` }}>{grouped[cat].length} 条</span>
            </div>
            <div className="space-y-1.5">
              {grouped[cat].map((c) => (
                <button key={c.id} onClick={() => onExpand(c.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left"
                  style={{ background: "#1a1410", border: `1px solid ${GOLD}33` }}>
                  <span className="text-2xl">{c.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px]" style={{ color: GOLD }}>{c.name}</div>
                    <div className="truncate text-[11px]" style={{ color: `${GOLD}88` }}>{c.short}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

/* ============ Ornate UI primitives ============ */

function OrnateFrame({ children, className, padding = 18 }: { children: React.ReactNode; className?: string; padding?: number }) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        background:
          "radial-gradient(120% 80% at 50% 0%, #221913 0%, #110b07 60%, #080503 100%)",
        border: `1px solid ${GOLD}`,
        borderRadius: 14,
        boxShadow: `0 24px 60px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(0,0,0,0.6)`,
      }}
    >
      {/* inner double border */}
      <div
        style={{
          position: "absolute",
          inset: 6,
          border: `1px solid ${GOLD}66`,
          borderRadius: 10,
          pointerEvents: "none",
        }}
      />
      {/* corner ornaments */}
      {[
        { t: 2, l: 2 }, { t: 2, r: 2 }, { b: 2, l: 2 }, { b: 2, r: 2 },
      ].map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: p.t, left: p.l, right: p.r, bottom: p.b,
            width: 14, height: 14,
            background: GOLD,
            transform: "rotate(45deg)",
            opacity: 0.85,
            boxShadow: `inset 0 0 0 1px #2a1a10`,
          } as React.CSSProperties}
        />
      ))}
      <div style={{ position: "relative", padding }}>{children}</div>
    </div>
  );
}

function GoldButton({
  children, onClick, disabled, className,
}: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full py-3 text-[15px] font-medium tracking-[0.18em] transition active:scale-[0.98] disabled:opacity-40 ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(180deg,#f5dca0 0%,#dcb472 35%,#a87a36 75%,#7a521e 100%)",
        color: "#3a2410",
        borderRadius: 8,
        border: "1px solid #5a3a18",
        boxShadow:
          "inset 0 1px 0 rgba(255,240,200,0.7), inset 0 0 0 1px rgba(255,220,150,0.35), 0 4px 14px rgba(0,0,0,0.5)",
      }}
    >
      <span
        style={{
          position: "absolute", inset: 4,
          border: "1px solid rgba(90,55,20,0.55)",
          borderRadius: 5, pointerEvents: "none",
        }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}

/* ============ Discovery & Detail Modals ============ */

function ClueDiscoveryModal({ clue, onConfirm }: { clue: Clue; onConfirm: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-5">
      <div className="w-full max-w-[340px]" style={{ animation: "popIn 0.35s cubic-bezier(.2,1.4,.5,1)" }}>
        <OrnateFrame padding={22}>
          <div className="text-center">
            <div className="text-[68px] leading-none" style={{ animation: "scaleSettle 0.6s ease-out", filter: "drop-shadow(0 4px 12px rgba(201,169,110,0.5))" }}>{clue.icon}</div>
            <div className="mt-4 inline-flex items-center gap-2">
              <span style={{ color: `${GOLD}88` }}>—</span>
              <span
                className="px-3 py-1 text-[11px] tracking-[0.3em]"
                style={{
                  background: "linear-gradient(180deg,#d9b270 0%,#a07636 100%)",
                  color: "#2a1a08",
                  borderRadius: 4,
                  border: "1px solid #5a3a18",
                  boxShadow: "inset 0 1px 0 rgba(255,235,180,0.6)",
                }}
              >{clue.category}</span>
              <span style={{ color: `${GOLD}88` }}>—</span>
            </div>
            <div
              className="mt-3 font-brush text-[28px] tracking-[0.08em]"
              style={{
                background: "linear-gradient(180deg,#fbe5a8 0%,#d4a560 60%,#8a5a20 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
              }}
            >{clue.name}</div>
            <div className="mx-auto my-3 h-px w-2/3" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)` }} />
            <div className="text-[13px] leading-[1.9]" style={{ color: "#e8d4a8" }}>{clue.full}</div>
            <div className="mt-5">
              <GoldButton onClick={onConfirm}>收入线索 ✓</GoldButton>
            </div>
          </div>
        </OrnateFrame>
      </div>
      <style>{`
        @keyframes popIn { from{transform:scale(0.85);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes scaleSettle { 0%{transform:scale(0.5)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
      `}</style>
    </div>
  );
}

function ClueDetailModal({ clue, onClose }: { clue: Clue; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-[55] flex items-center justify-center bg-black/75 backdrop-blur-sm px-5" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[340px]">
        <OrnateFrame padding={20}>
          <button onClick={onClose} className="absolute right-3 top-3 z-10" style={{ color: GOLD }}><X size={18} /></button>
          <div className="text-center">
            <div className="text-5xl">{clue.icon}</div>
            <div className="mt-3 inline-block px-3 py-1 text-[11px] tracking-[0.3em]" style={{
              background: "linear-gradient(180deg,#d9b270 0%,#a07636 100%)",
              color: "#2a1a08", borderRadius: 4, border: "1px solid #5a3a18",
            }}>{clue.category}</div>
            <div className="mt-2 font-brush text-[22px]" style={{ color: GOLD }}>{clue.name}</div>
            <div className="mx-auto my-3 h-px w-2/3" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)` }} />
            <div className="text-[13px] leading-[1.9] text-left" style={{ color: "#e8d4a8" }}>{clue.full}</div>
          </div>
        </OrnateFrame>
      </div>
    </div>
  );
}

/* ============ Deduction ============ */

const KEY_CLUES = new Set([
  "clue_truth_birth", "clue_donghou_father", "clue_look_alike",
  "letter_zhou", "tangmen_token", "silk_handkerchief",
  "medical_record", "clue_tangmen", "clue_xiaoqiao",
]);

function DeductionPanel({ collected, onClose, onWin }: {
  collected: Set<string>;
  onClose: () => void;
  onWin: () => void;
}) {
  const [father, setFather] = useState<string>("");
  const [mother, setMother] = useState<string>("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [hint, setHint] = useState<string | null>(null);

  const togglePick = (id: string) => {
    setPicked((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const canSubmit = father && mother && picked.size >= 3;
  const submit = () => {
    const correctFather = father === "donghou";
    const correctMother = mother === "xiaoqiao";
    const keyHits = [...picked].filter((id) => KEY_CLUES.has(id)).length;
    if (correctFather && correctMother && keyHits >= 3) {
      onWin();
      return;
    }
    if (!correctFather) setHint("生父之论，再思一思——画像与医案皆藏玄机。");
    else if (!correctMother) setHint("生母身份，唐门令牌与绣帕之间，必有真章。");
    else setHint("证据稍欠火候，请择三条关键之物再断。");
  };

  return (
    <Drawer title="推 理 · 揭开身世之谜" onClose={onClose}>
      <Section title="生父是谁">
        {[
          { v: "donghou", l: "东侯王" },
          { v: "zhuangsy", l: "庄仕洋" },
          { v: "unknown", l: "不明" },
        ].map((o) => (
          <Radio key={o.v} checked={father === o.v} label={o.l} onClick={() => setFather(o.v)} />
        ))}
      </Section>
      <Section title="生母是谁">
        {[
          { v: "xiaoqiao", l: "唐小乔" },
          { v: "wang", l: "王氏" },
          { v: "unknown", l: "不明" },
        ].map((o) => (
          <Radio key={o.v} checked={mother === o.v} label={o.l} onClick={() => setMother(o.v)} />
        ))}
      </Section>
      <Section title={`选择关键证据（已选 ${picked.size}，至少 3 条）`}>
        {collected.size === 0 ? (
          <div className="text-[12px]" style={{ color: `${GOLD}88` }}>尚无线索，先去寻访各处罢。</div>
        ) : (
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {[...collected].map((id) => {
              const c = CLUES[id];
              const on = picked.has(id);
              return (
                <button
                  key={id}
                  onClick={() => togglePick(id)}
                  className="relative shrink-0 text-left active:scale-[0.98]"
                  style={{
                    width: 180,
                    borderRadius: 10,
                    padding: 10,
                    background: "linear-gradient(180deg,#1a1208 0%,#0d0805 100%)",
                    border: `1px solid ${on ? GOLD : `${GOLD}44`}`,
                    boxShadow: on
                      ? `0 0 0 1px ${GOLD}55, 0 0 14px ${GOLD}44`
                      : "inset 0 0 0 1px rgba(0,0,0,0.4)",
                  }}
                >
                  <div className="flex gap-2.5">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center text-2xl"
                      style={{ background: "#2a1f15", border: `1px solid ${GOLD}55`, borderRadius: 4 }}
                    >{c.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="truncate text-[13px]" style={{ color: GOLD }}>{c.name}</div>
                        <span
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: on ? GOLD : "transparent",
                            border: `1.5px solid ${GOLD}`,
                          }}
                        >
                          {on && <Check size={10} strokeWidth={3} color="#1a1208" />}
                        </span>
                      </div>
                      <div className="mt-1 text-[10.5px] leading-snug line-clamp-3" style={{ color: `${GOLD}aa` }}>{c.short}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Section>

      {hint && (
        <div className="mt-3 rounded-lg px-3 py-2 text-[12px]" style={{ background: "#2a1610", border: `1px solid ${GOLD}66`, color: "#f5d6a8" }}>
          {hint}
        </div>
      )}

      <div className="mt-5">
        <GoldButton onClick={submit} disabled={!canSubmit}>提交推理</GoldButton>
      </div>

    </Drawer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-3 flex items-center gap-2 text-[13px]" style={{ color: GOLD }}>
        <span style={{ transform: "rotate(45deg)", display: "inline-block", width: 7, height: 7, border: `1px solid ${GOLD}` }} />
        <span className="tracking-[0.15em]">{title}</span>
        <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${GOLD}55, transparent)` }} />
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Radio({ checked, label, onClick }: { checked: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative flex w-full items-center gap-3 px-4 py-2.5 text-left transition active:scale-[0.99]"
      style={{
        background: checked
          ? "linear-gradient(180deg,#f0d18a 0%,#c9a05c 55%,#8e6628 100%)"
          : "linear-gradient(180deg,#1a1208 0%,#0d0805 100%)",
        border: `1px solid ${checked ? "#5a3a18" : `${GOLD}55`}`,
        borderRadius: 999,
        boxShadow: checked
          ? "inset 0 1px 0 rgba(255,235,180,0.65), 0 2px 8px rgba(0,0,0,0.4)"
          : "inset 0 0 0 1px rgba(0,0,0,0.4)",
      }}
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full"
        style={{
          border: `1.5px solid ${checked ? "#3a2410" : GOLD}`,
          background: checked ? "#1a1208" : "transparent",
        }}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#f0d896" }} />}
      </span>
      <span className="text-[14px]" style={{ color: checked ? "#2a1a08" : "#e8d4a8" }}>{label}</span>
    </button>
  );
}

/* ============ Drawer (ornate centered modal) ============ */

function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 py-6" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[360px]"
        style={{ animation: "popIn 0.28s ease-out" }}
      >
        <OrnateFrame padding={0}>
          <div className="relative">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div
                className="font-brush text-[22px] tracking-[0.12em]"
                style={{
                  background: "linear-gradient(180deg,#fbe5a8 0%,#d4a560 60%,#8a5a20 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >{title}</div>
              <button onClick={onClose} style={{ color: GOLD }}><X size={20} /></button>
            </div>
            <div className="mx-5 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)` }} />
            <div className="max-h-[68vh] overflow-y-auto px-5 pb-6 pt-4">
              {children}
            </div>
          </div>
        </OrnateFrame>
      </div>
    </div>
  );
}

/* ============ Victory ============ */

function VictoryView({ onExit }: { onExit: () => void }) {
  const [particles] = useState(() => Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    dur: 3 + Math.random() * 3,
    size: 4 + Math.random() * 6,
  })));
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "radial-gradient(circle at center,#3a2818 0%,#0a0604 100%)" }}>
      {particles.map((p) => (
        <span key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`, bottom: -10,
            width: p.size, height: p.size,
            background: GOLD,
            boxShadow: `0 0 8px ${GOLD}`,
            animation: `rise ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
        <Sparkles size={40} style={{ color: GOLD }} />
        <div className="mt-3 font-brush text-[36px] tracking-[0.3em]" style={{ color: GOLD, textShadow: `0 0 24px ${GOLD}aa` }}>真 相 大 白</div>
        <div className="mx-auto mt-4 h-px w-32" style={{ background: `${GOLD}88` }} />
        <p className="mt-5 max-w-[320px] text-[13px] leading-relaxed" style={{ color: "#f5e6c8" }}>
          庄翰焰之真名，乃东侯王与唐门嫡女唐小乔所诞遗孤。<br/>
          二十年前东侯王府遭奸臣构陷，一夜满门尽丧；<br/>
          唐小乔避祸城外破屋，诞下女儿即托亲信，由媚姨娘抱入庄府，
          以代王氏夭折之婴。<br/>
          太后早知一切，留你性命，藏于深闺，
          只待今日——你以贵女之身，亲手揭开这桩二十年前的旧案。
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={onExit} className="rounded-full px-5 py-2 text-[13px]" style={{ background: GOLD, color: "#1a1410" }}>
            归 去
          </button>
          <button className="flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px]" style={{ border: `1px solid ${GOLD}`, color: GOLD }}>
            <Share2 size={13} /> 分享
          </button>
        </div>
      </div>
      <style>{`@keyframes rise { from{transform:translateY(0);opacity:0} 10%{opacity:1} to{transform:translateY(-120vh);opacity:0} }`}</style>
    </div>
  );
}
