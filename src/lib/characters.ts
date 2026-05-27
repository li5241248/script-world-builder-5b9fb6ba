import wentang from "@/assets/char-wentang.jpg";
import peirong from "@/assets/char-peirong.jpg";
import peiyan from "@/assets/char-peiyan.jpg";
import peiyu from "@/assets/char-peiyu.jpg";
import mama from "@/assets/char-mama.jpg";
import empress from "@/assets/char-empress.jpg";

export type Relation = { id: string; label: string };

export type Character = {
  id: string;
  name: string;
  role: string;
  gender: "女" | "男";
  age: number;
  tag: string;
  img: string;
  desc: string;
  played: number;
  motto?: string;
  identity: string;
  personality: string;
  skill: string;
  secret: string;
  story: string;
  relations: Relation[];
};

export const CHARACTERS: Character[] = [
  {
    id: "hanyan", name: "庄寒雁", role: "女主 · 侯门嫡女", gender: "女", age: 13, tag: "重生", img: wentang, played: 12483,
    desc: "庄府嫡长女，母亲新丧。一朝重生回少年时，誓要看清府中虎狼，为母亲讨一个公道。",
    motto: "「重要不等于必要，这个道理，她总有一天会明白。」",
    identity: "镇国侯庄府嫡长女，前世惨死，今生重生归来",
    personality: "外柔内刚，心思缜密，亦正亦邪",
    skill: "察言观色，借力打力，识破伪善",
    secret: "她记得这一世所有人的结局，也记得自己是怎么死的",
    story: "她原是侯府嫡长女，母亲温婉、弟弟年幼，本以为这一生不过寻常。前世她信错了继母周氏，信错了所谓的好姐姐庄语山，眼看着母亲被算计而亡、弟弟被夺、父亲冷待，自己也落得凄惨收场。一朝重生回到母亲新丧、周氏母女初入庄府那一日，她不再是那个一无所知的小女孩。这一回，她要把那些笑里藏刀的人一个一个，亲手送回原本该去的地方。",
    relations: [
      { id: "zhouyi", label: "继母" },
      { id: "zhuangsy", label: "父女" },
      { id: "yushan", label: "假姐妹" },
      { id: "jilan", label: "心腹" },
    ],
  },
  {
    id: "zhouyi", name: "周氏", role: "庄府继室", gender: "女", age: 32, tag: "千娇百媚", img: empress, played: 9821,
    desc: "庄仕洋外室出身，母亲一去便登堂入室。柳眉细眼，笑里藏刀，最善借男人的疼宠杀人于无形。",
    motto: "「妾身也是心疼雁姐儿，这孩子就是心善。」",
    identity: "庄仕洋多年外室，今奉旨扶正",
    personality: "千娇百媚，绵里藏针，极擅装柔示弱",
    skill: "枕边风，借刀杀人，调香理妆",
    secret: "庄府嫡夫人之死，她从头到尾都不算干净",
    story: "她原本不过是庄仕洋养在外头的人，靠一身风情和一双女儿吊住了他大半颗心。嫡夫人尚在时，她不动声色地等；嫡夫人一去，她便迫不及待地带着女儿登门借宿，桃色长裙、红宝石头面，恨不能立刻坐到正房那把椅子上。她以为庄寒雁不过是个被娇宠坏的小姑娘，三言两语便能拿捏——却没想到，这次迎面而来的，是一个把她的心思看得清清楚楚的人。",
    relations: [
      { id: "zhuangsy", label: "夫妻" },
      { id: "yushan", label: "母女" },
      { id: "hanyan", label: "继母" },
    ],
  },
  {
    id: "zhuangsy", name: "庄仕洋", role: "镇国侯", gender: "男", age: 40, tag: "庄府家主", img: peirong, played: 4216,
    desc: "袭爵承业，最在意官声体面。妻子尸骨未寒，便急着把外室母女接进府中。",
    motto: "「这里没你说话的地步。」",
    identity: "镇国侯，庄府家主，朝中三品",
    personality: "自负多疑，凉薄寡情，最重仕途",
    skill: "权衡利害，揣摩圣意",
    secret: "对女儿过敏什么、母亲忌日哪天，他一概不记得",
    story: "他是大宗朝的镇国侯，年轻时也曾对发妻许过一两句温言，可这一切都敌不过周氏一双勾魂的眼睛。妻子病重那几年，他在外头养下两个女儿；妻子刚走，便迫不及待将她们接入府中，全然不顾丧期未过。在他眼里，仕途最重，颜面次之，至于嫡女庄寒雁——不过是府里另一件需要打理的东西罢了。",
    relations: [
      { id: "zhouyi", label: "宠妾" },
      { id: "hanyan", label: "父女" },
      { id: "yushan", label: "父女" },
    ],
  },
  {
    id: "yushan", name: "庄语山", role: "周氏长女", gender: "女", age: 14, tag: "假千金", img: mama, played: 3580,
    desc: "周氏所出，自小养在外院。一进府便要做这庄府名正言顺的大小姐，谁知一开口便撞上了寒雁的刀。",
    motto: "「总有一天，这府里千金的位置，会是我庄语山的。」",
    identity: "周氏长女，新入庄府",
    personality: "骄矜娇气，心高气傲，演技略浅",
    skill: "撒娇示弱，扮可怜",
    secret: "她身上那股浓重香粉，是周氏一早替她精心选的「见面礼」",
    story: "她从小被周氏带在身边，听了一耳朵关于庄府、关于那个嫡出妹妹的话，早已把那把千金交椅当成自己的。今日终于踏进庄府大门，原以为不过是走个过场，却被庄寒雁三两句话逼得跪也不是、笑也不是，连母亲精心给她挑的桃色衣裳都成了把柄。她从未见过这样的妹妹，恨得牙痒，却又生出一点说不清的怯。",
    relations: [
      { id: "zhouyi", label: "母女" },
      { id: "zhuangsy", label: "父女" },
      { id: "hanyan", label: "假姐妹" },
    ],
  },
  {
    id: "jilan", name: "汲蓝 & 姝红", role: "清秋苑双婢", gender: "女", age: 15, tag: "心腹", img: empress, played: 2914,
    desc: "汲蓝爽利藏不住话，姝红寡言极有分寸。一动一静，是寒雁在这虎狼之府里仅剩的两只手。",
    motto: "「小姐，那个周夫人，看着就不是什么好人。」",
    identity: "庄寒雁贴身丫鬟，清秋苑双婢",
    personality: "汲蓝心直口快，姝红冷静持重",
    skill: "通风报信，护主周全",
    secret: "姝红的来历，远比一个普通丫鬟要复杂",
    story: "她们一个跳脱、一个沉静，从小陪着寒雁长大。前世她们都没能护住自家小姐，今生再被带在身边，便决心连命也要替她看着。寒雁要钻狗洞出府，汲蓝高兴得几乎跳起来，姝红只是皱了皱眉，把银子收得更紧——这一次，她们要陪着小姐，走一条与从前完全不同的路。",
    relations: [
      { id: "hanyan", label: "主仆" },
    ],
  },
  {
    id: "moshen", name: "墙外之人", role: "神秘男子", gender: "男", age: 22, tag: "局外人", img: peiyu, played: 1207,
    desc: "庄府外墙边一个含着草梗的陌生身影，看见有人钻狗洞，竟笑出了声——「有意思。」",
    motto: "「庄府上的丫头真奇怪，放着好好的大门不走，偏爱钻狗洞。」",
    identity: "身份不明，常在京中游走",
    personality: "懒散随性，眼神却毒辣",
    skill: "察人于细微，行踪如风",
    secret: "他为何会在那堵墙外，不是巧合",
    story: "他斜倚在庄府外墙不远处，叼着一根草，本只是路过。却恰好瞧见一个粗布丫鬟打扮的姑娘，从狗洞里钻出来，拍了拍裙摆，竟还一脸欢喜。他眯起眼睛笑了一声——这京里高门贵女他见得太多，唯独没见过会钻狗洞的。这一笑，便记住了那个背影；这一记，往后许多事便都跟着拐了弯。",
    relations: [
      { id: "hanyan", label: "未识" },
    ],
  },
];

export const getCharacter = (id: string) => CHARACTERS.find((c) => c.id === id);
