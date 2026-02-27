/* ============================================================
   content.js — All content data (videos, articles, AI art)
   ============================================================

   Manage content visually: open admin.html in your browser.
   After editing, click "Export content.js" and replace this file.

   ============================================================ */

/* ── Videos ────────────────────────────────────────────────── */
/* platform: 'youtube' | 'xiaohongshu'                         */
const VIDEOS = [
  {
    id:       "vid-001",
    date:     "2026-02-25",
    thumb:    "assets/images/thumbnails/Me and Dad.jpeg",
    platform: "youtube",
    url:      "https://www.youtube.com/shorts/BQkKeNxiuyY",
    en: {
      title: "Me and Dad!",
      desc:  "A short personal video featuring me and my dad.",
    },
    zh: {
      title: "我和爸爸！",
      desc:  "一段与爸爸一起的短视频。",
    }
  }
];

/* ── Articles ───────────────────────────────────────────────── */
/* body: Markdown string. Use ## headings, **bold**, *italic*,  */
/* - list items, > blockquotes.                                 */
const ARTICLES = [
  {
    id:    "art-001",
    date:  "2026-02-23",
    thumb: "",
    en: {
      title:   "Why AI Won't Replace Creativity (Yet)",
      excerpt: "A calm, evidence-based look at what AI actually can and cannot do with creative work.",
      body: `
The headlines love to scare us. "AI will replace artists." "Writers are obsolete." But if you spend real time *using* these tools for creative work, a more nuanced picture emerges.

## What AI actually does well

AI excels at pattern completion. Give it a style, a genre, a format — and it will produce something that *looks like* the thing you asked for. Quickly, tirelessly, and at scale.

For certain tasks, this is genuinely useful. First drafts, brainstorming, overcoming blank-page paralysis — AI is a capable collaborator here.

## Where humans remain irreplaceable

What AI cannot do is **care**. It has no stakes in the outcome. It doesn't know what it feels like to lose someone, to start over, to be moved by a piece of music at 2am.

The most resonant creative work draws from lived experience — from the specific texture of a particular human life. That texture is yours alone.

> The best creative work happens when humans and AI each do what they're good at — and neither pretends to be the other.

## A practical way to think about it

- Use AI for the *generative* phase: getting ideas, rough drafts, structural exploration.
- Bring your full human judgment to the *editorial* phase: what to keep, cut, and sharpen.
- The final voice should always be yours.

AI is a powerful new brush. But you're still the painter.
      
      `
    },
    zh: {
      title:   "为什么 AI 暂时还没法替代创造力",
      excerpt: "平静而有据可依地看一看，AI 在创造性工作上究竟能做什么、不能做什么。",
      body: `
标题总爱吓我们。"AI 将取代艺术家。""写作者已经过时。"但如果你真正花时间*用*这些工具做创意工作，会看到一幅更微妙的图景。

## AI 真正擅长什么

AI 在模式补全方面表现出色。给它一种风格、一个类型、一种格式——它就会生产出*看起来像*你要求的东西。快速、持续、大规模。

对于某些任务，这确实有用：初稿、头脑风暴、克服空白页的恐惧——AI 在这些方面是个称职的协作者。

## 人类仍然不可替代的地方

AI 做不到的是**在乎**。它在结果上没有任何利益。它不知道失去一个人是什么感觉，不知道重新开始是什么滋味，不知道凌晨两点被一段音乐打动是什么体验。

最能引起共鸣的创意作品来自亲身经历——来自特定人类生命的具体质感。那种质感只属于你。

> 最好的创意工作，发生在人类和 AI 各做自己擅长的事的时候——没有谁假装成对方。

## 一种实用的思考方式

- 用 AI 负责*生成*阶段：获取想法、粗略草稿、结构探索。
- 把你完整的人类判断带入*编辑*阶段：决定留下什么、删除什么、打磨什么。
- 最终的声音永远应该是你的。

AI 是一支强大的新画笔。但你仍然是那个画画的人。
      
      `
    }
  },
  {
    id:    "art-002",
    date:  "2026-02-15",
    thumb: "",
    en: {
      title:   "The 10-Minute AI Workflow That Saves Me 3 Hours a Week",
      excerpt: "A simple system using three tools in sequence that I've been running for six months.",
      body: `

I'm going to describe a workflow that took me about ten minutes to set up and has saved me somewhere between two and four hours every week since.

## The problem it solves

Every week I was spending time on three things that felt important but were eating into the time I wanted for actual creative work: summarizing my notes, drafting social captions, and scheduling content.

## The workflow

Here's what I do every Sunday evening, in order:

### Step 1: Dump the week into ChatGPT (5 min)

I paste my rough notes from the week — voice memos transcribed, ideas jotted down, links I wanted to revisit — into a single ChatGPT prompt. I ask it to organize them into themes and flag the three most interesting ideas.

### Step 2: Turn themes into captions (3 min)

For each flagged idea, I ask it to draft three caption variations: one for X (short, punchy), one for Xiaohongshu (warmer, more story-driven), and one for a potential YouTube title.

### Step 3: Build the week's schedule (2 min)

I paste the captions I like into Notion, where I have a simple content calendar template. I assign dates, add any missing assets, and I'm done.

## What I still do manually

Everything above handles logistics. The actual *writing*, the *filming*, the *thinking* — that's still all me. The workflow doesn't replace creative work. It removes the friction around it.
      
      `
    },
    zh: {
      title:   "每周帮我省 3 小时的 10 分钟 AI 工作流",
      excerpt: "一个用三个工具按顺序运行的简单系统，我已经坚持了六个月。",
      body: `

我要介绍一个大约花十分钟就能搭建好的工作流——从那以后，每周大概帮我节省了两到四个小时。

## 它解决了什么问题

每周我都在三件感觉重要、却又吃掉我真正想用来创作的时间的事情上耗费精力：整理笔记、起草社交文案、安排内容发布计划。

## 工作流

这是我每个周日晚上按顺序做的事：

### 第一步：把一周的内容倒进 ChatGPT（5 分钟）

我把这一周的粗糙笔记——转录的语音备忘、随手记的想法、想回头看的链接——粘贴进一个 ChatGPT 提示词。让它把这些内容按主题整理，并标出最有意思的三个想法。

### 第二步：把主题变成文案（3 分钟）

针对每个被标出的想法，我让它起草三个文案版本：一个给 X（简短有力），一个给小红书（更有温度、更像故事），一个用作潜在的 YouTube 标题。

### 第三步：搭建本周计划（2 分钟）

我把自己满意的文案粘贴进 Notion，里面有一个简单的内容日历模板。分配日期，补齐缺失的素材，完成。

## 我仍然手动做的事

以上都是在处理后勤。真正的*写作*、*拍摄*、*思考*——还是全靠我自己。这个工作流不替代创意工作，只是消除了围绕它的摩擦。
      
      `
    }
  },
  {
    id:    "art-003",
    date:  "2026-02-08",
    thumb: "",
    en: {
      title:   "What I Wish I Knew Before Starting AI Content Creation",
      excerpt: "Three things that took me too long to figure out — so you don't have to.",
      body: `

I've been making AI content for over a year. Here are three things I wish someone had told me at the start.

## 1. Consistency beats virality

I wasted three months trying to engineer viral posts instead of just showing up regularly. The channel that grew was the one I updated every week, not the one I optimized obsessively.

## 2. Your specific perspective is the product

There are thousands of people covering AI tools. What made mine different wasn't having better tools — it was having a consistent *point of view*: practical, skeptical of hype, focused on creative applications.

Figure out your point of view early. It makes every content decision easier.

## 3. The audience teaches you

I planned my first six months of content based on what I thought people wanted. Then I started asking questions in comments and replies — and learned that what people actually wanted was almost entirely different.

> Don't guess what your audience needs. Ask them. Then make that.
      
      `
    },
    zh: {
      title:   "做 AI 内容创作之前，我希望早点知道这些事",
      excerpt: "三件花了我太长时间才想明白的事——希望你不必走同样的弯路。",
      body: `

我做 AI 内容已经超过一年了。以下是三件我希望一开始就有人告诉我的事。

## 1. 持续更新胜过爆款

我浪费了三个月时间试图制造爆款，而不是规律出现。真正增长的频道，是那个每周都更新的，不是我反复优化却迟迟不发的那个。

## 2. 你独特的视角才是产品

有成千上万的人在介绍 AI 工具。让我的内容不同的，不是拥有更好的工具——而是拥有一致的*观点*：实用、对炒作保持怀疑、专注于创意应用。

尽早找到你的观点。它会让之后的每一个内容决策都变得更容易。

## 3. 受众会教你

我根据自己的想象规划了前六个月的内容。后来我开始在评论和回复里提问——才发现人们真正想要的东西和我猜的几乎完全不同。

> 不要猜测受众需要什么。问他们。然后做那个。
      
      `
    }
  }
];

/* ── AI Art ─────────────────────────────────────────────────── */
const ART = [
  {
    id:   "aart-mm4ee5p3",
    date: "2026-02-27",
    src:  "assets/images/art/ZettaSort.jpg",
    en: {
      title: "ZettaSort",
      desc:  "ZettaSort",
    },
    zh: {
      title: "极阶智排",
      desc:  "极阶智排",
    }
  },
  {
    id:   "aart-001",
    date: "2026-02-18",
    src:  "",
    en: {
      title: "Neon Sakura",
      desc:  "Midjourney v6 · Prompt: neon cherry blossom, cyberpunk Tokyo street, soft rain, bokeh",
    },
    zh: {
      title: "霓虹樱花",
      desc:  "Midjourney v6 · 提示词：霓虹樱花、赛博朋克东京街头、细雨、散景",
    }
  },
  {
    id:   "aart-002",
    date: "2026-02-12",
    src:  "",
    en: {
      title: "Golden Hour Robot",
      desc:  "DALL-E 3 · A gentle robot watching the sunset over a wheat field",
    },
    zh: {
      title: "黄昏时刻的机器人",
      desc:  "DALL-E 3 · 一个温柔的机器人望着麦田上方的日落",
    }
  },
  {
    id:   "aart-003",
    date: "2026-02-05",
    src:  "",
    en: {
      title: "Deep Ocean Mind",
      desc:  "Stable Diffusion XL · Prompt: bioluminescent thoughts, dark ocean, neural networks, peaceful",
    },
    zh: {
      title: "深海思维",
      desc:  "Stable Diffusion XL · 提示词：生物发光的思想、深海、神经网络、宁静",
    }
  }
];
