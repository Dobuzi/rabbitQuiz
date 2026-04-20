# Rabbit And Magician Secret Quiz Game Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a short, child-friendly story quiz game about a rabbit exploring a magician's secret tower that runs entirely in the browser as a static single-page app.

**Architecture:** Use a minimal static web structure with one HTML entry point, one stylesheet, and one JavaScript file. Keep all story and quiz content in a plain in-memory data structure, render scenes from state, and update the DOM without page reloads.

**Tech Stack:** HTML, CSS, vanilla JavaScript

---

## File Structure

- `index.html`
  - Main shell for the game layout, stage area, dialogue panel, and choice buttons
- `style.css`
  - Storybook visual system, responsive layout, and small feedback animations
- `game.js`
  - Story data, game state, rendering, answer handling, and scene transitions
- `docs/superpowers/specs/2026-04-20-rabbit-magician-quiz-design.md`
  - Approved design reference

## Chunk 1: Shell And Static Layout

### Task 1: Create The Base HTML Shell

**Files:**
- Create: `index.html`
- Reference: `docs/superpowers/specs/2026-04-20-rabbit-magician-quiz-design.md`

- [ ] **Step 1: Write the HTML shell**

Create `index.html` with:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>토끼와 마술사의 비밀 퀴즈</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <main class="game-shell">
      <header class="game-header">
        <p class="game-kicker">비밀 퀴즈 동화</p>
        <h1>토끼와 마술사의 비밀 퀴즈</h1>
        <p id="progress-text" class="progress-text">시작 전</p>
      </header>

      <section id="stage-panel" class="stage-panel" aria-label="게임 무대">
        <div class="stage-backdrop"></div>
        <div class="stage-actors">
          <div id="rabbit-actor" class="actor rabbit">토끼</div>
          <div id="magician-actor" class="actor magician">마술사</div>
        </div>
        <div id="room-badge" class="room-badge">탑의 입구</div>
      </section>

      <section class="story-panel" aria-live="polite">
        <h2 id="scene-title">모험의 시작</h2>
        <p id="story-text">시작 버튼을 누르면 이야기가 시작됩니다.</p>
        <p id="feedback-text" class="feedback-text"></p>
      </section>

      <section id="choices-panel" class="choices-panel" aria-label="선택지"></section>

      <section class="control-panel">
        <button id="primary-action" type="button">시작하기</button>
      </section>
    </main>

    <script src="./game.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Verify the HTML file exists and includes the main regions**

Run: `rg -n "game-shell|stage-panel|choices-panel|primary-action" index.html`
Expected: matches for all four identifiers

- [ ] **Step 3: Check the page loads in a browser without JavaScript errors from missing elements**

Run: `open index.html`
Expected: the browser opens a page showing the title, stage area, story text, and a start button

- [ ] **Step 4: Commit the HTML shell if git is available**

Run: `git rev-parse --is-inside-work-tree`
Expected: `true` if git is available; if not, skip commit in this workspace

If the command returns `true`, run:

```bash
git add index.html
git commit -m "feat: add rabbit quiz game html shell"
```

### Task 2: Add Storybook Layout And Responsive CSS

**Files:**
- Create: `style.css`
- Reference: `docs/superpowers/specs/2026-04-20-rabbit-magician-quiz-design.md`

- [ ] **Step 1: Write the base styles**

Create `style.css` with:

```css
:root {
  --bg-top: #f7d9ff;
  --bg-bottom: #fff8d6;
  --panel: rgba(255, 255, 255, 0.82);
  --panel-border: rgba(116, 79, 153, 0.18);
  --text: #3e2b54;
  --muted: #7d6797;
  --accent: #ffb84d;
  --accent-strong: #f28c28;
  --correct: #78d694;
  --wrong: #ff9a9a;
  --shadow: 0 18px 45px rgba(92, 62, 125, 0.16);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Trebuchet MS", "Apple SD Gothic Neo", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at top, rgba(255,255,255,0.55), transparent 38%),
    linear-gradient(180deg, var(--bg-top), var(--bg-bottom));
}

.game-shell {
  width: min(920px, calc(100% - 32px));
  margin: 24px auto;
  padding: 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}

.game-header,
.story-panel,
.choices-panel,
.control-panel {
  margin-top: 18px;
}

.stage-panel,
.story-panel,
.choices-panel,
.control-panel {
  border: 1px solid var(--panel-border);
  border-radius: 24px;
  background: var(--panel);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.stage-panel {
  position: relative;
  overflow: hidden;
  min-height: 280px;
  padding: 20px;
}

.stage-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.85), transparent 18%),
    radial-gradient(circle at 80% 18%, rgba(255,255,255,0.6), transparent 12%),
    linear-gradient(180deg, rgba(187, 141, 245, 0.75), rgba(255, 242, 196, 0.7));
}

.stage-actors {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: end;
  justify-content: space-between;
  min-height: 240px;
}

.actor {
  display: grid;
  place-items: center;
  width: 160px;
  height: 160px;
  border-radius: 999px;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
}

.rabbit {
  background: linear-gradient(180deg, #ff9eb5, #ff7d8d);
}

.magician {
  background: linear-gradient(180deg, #7d6bff, #5141d9);
}

.room-badge {
  position: relative;
  z-index: 1;
  display: inline-block;
  margin-top: 12px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  color: var(--muted);
  font-weight: 700;
}

.story-panel,
.choices-panel,
.control-panel {
  padding: 18px;
}

.progress-text,
.game-kicker,
.feedback-text {
  color: var(--muted);
}

.feedback-text {
  min-height: 1.5em;
  font-weight: 700;
}

.choice-button,
#primary-action {
  width: 100%;
  border: 0;
  border-radius: 18px;
  padding: 14px 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.choice-button {
  margin-top: 10px;
  color: var(--text);
  background: white;
  border: 1px solid rgba(116, 79, 153, 0.14);
}

#primary-action {
  background: linear-gradient(180deg, var(--accent), var(--accent-strong));
  color: white;
}

.is-correct {
  animation: sparkle 0.45s ease;
}

.is-wrong {
  animation: nudge 0.28s ease;
}

.is-fading {
  animation: fadeScene 0.35s ease;
}

@keyframes sparkle {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

@keyframes nudge {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes fadeScene {
  from { opacity: 0.3; }
  to { opacity: 1; }
}

@media (max-width: 720px) {
  .game-shell {
    width: calc(100% - 20px);
    margin: 10px auto;
    padding: 16px;
  }

  .stage-actors {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }

  .actor {
    width: 120px;
    height: 120px;
  }
}
```

- [ ] **Step 2: Verify the expected CSS hooks exist**

Run: `rg -n ":root|stage-panel|choice-button|@media" style.css`
Expected: matches for the theme tokens, stage panel, choice button, and mobile breakpoint

- [ ] **Step 3: Open the page and visually verify the shell is readable on desktop**

Run: `open index.html`
Expected: the page shows a colorful storybook layout with distinct header, stage, story, and control regions

- [ ] **Step 4: Commit the CSS if git is available**

Run: `git rev-parse --is-inside-work-tree`
Expected: `true` if git is available; if not, skip commit in this workspace

If the command returns `true`, run:

```bash
git add style.css
git commit -m "feat: add storybook styles for rabbit quiz game"
```

## Chunk 2: Story Data And Game Logic

### Task 3: Add Story Content And Initial Render Logic

**Files:**
- Create: `game.js`
- Modify: `index.html`
- Reference: `docs/superpowers/specs/2026-04-20-rabbit-magician-quiz-design.md`

- [ ] **Step 1: Write the story and quiz data structure**

Create `game.js` with the initial data model and element lookups:

```js
const scenes = [
  {
    id: "start",
    type: "intro",
    room: "탑의 입구",
    progress: "0 / 5",
    title: "문이 반짝였어요",
    story:
      "작은 토끼는 반짝이는 탑 문 앞에 섰어요. 문이 열리자 다정한 마술사가 웃으며 말했어요. “별빛, 카드, 달빛의 방을 지나면 내 비밀을 보여 줄게.”",
    actionLabel: "탑 안으로 들어가기",
  },
  {
    id: "star-quiz",
    type: "quiz",
    room: "별의 방",
    progress: "1 / 5",
    title: "별의 방",
    story:
      "천장에는 별이 떠 있었어요. 마술사가 말했어요. “가장 밝은 길잡이 별을 골라야 다음 문이 열려.”",
    question: "길을 알려 주는 반짝이는 것은 무엇일까요?",
    choices: [
      { label: "노란 별", correct: true, hint: "별의 방에서는 반짝이는 별이 길을 알려 줘요." },
      { label: "빗자루", correct: false, hint: "빗자루는 날 수 있지만 길을 비추지는 않아요." },
      { label: "찻잔", correct: false, hint: "찻잔은 예쁘지만 하늘에서 반짝이지 않아요." },
    ],
  },
  {
    id: "card-quiz-1",
    type: "quiz",
    room: "카드의 방",
    progress: "2 / 5",
    title: "카드의 방",
    story:
      "공중에 카드가 둥둥 떠다녔어요. 마술사는 “같은 모양끼리 친구가 되지” 하고 속삭였어요.",
    question: "하트 카드와 친구가 될 카드는 무엇일까요?",
    choices: [
      { label: "하트 카드", correct: true, hint: "같은 모양끼리 친구가 된다고 했어요." },
      { label: "별 카드", correct: false, hint: "별은 반짝이지만 카드 무늬는 아니에요." },
      { label: "달 카드", correct: false, hint: "달은 다음 방과 더 잘 어울려요." },
    ],
  },
  {
    id: "card-quiz-2",
    type: "quiz",
    room: "카드의 방",
    progress: "3 / 5",
    title: "카드 다리",
    story:
      "바닥에 카드 다리가 생겼어요. 마술사가 말했어요. “가장 가벼운 마음으로 건너 보렴.”",
    question: "가벼운 마음과 가장 잘 어울리는 것은 무엇일까요?",
    choices: [
      { label: "웃는 토끼", correct: true, hint: "가벼운 마음은 웃을 때 더 잘 느껴져요." },
      { label: "무거운 돌", correct: false, hint: "돌은 가볍지 않아요." },
      { label: "닫힌 상자", correct: false, hint: "닫힌 상자는 답답한 느낌이에요." },
    ],
  },
  {
    id: "moon-quiz-1",
    type: "quiz",
    room: "달빛의 방",
    progress: "4 / 5",
    title: "달빛의 방",
    story:
      "하얀 달빛이 방 안을 조용히 비췄어요. 마술사가 말했어요. “달빛에는 조용한 친구가 잘 어울린단다.”",
    question: "달빛과 가장 잘 어울리는 친구는 누구일까요?",
    choices: [
      { label: "조용히 앉은 토끼", correct: true, hint: "달빛은 조용하고 포근한 장면과 잘 어울려요." },
      { label: "쿵쾅거리는 북", correct: false, hint: "북소리는 달빛의 조용한 분위기와 달라요." },
      { label: "소리치는 나팔", correct: false, hint: "나팔은 너무 시끌벅적해요." },
    ],
  },
  {
    id: "moon-quiz-2",
    type: "quiz",
    room: "달빛의 방",
    progress: "5 / 5",
    title: "비밀 문",
    story:
      "마지막 문 앞에서 마술사가 미소 지었어요. “내 비밀은 아주 어려운 것이 아니란다. 따뜻한 마음이 있으면 보여.”",
    question: "마술사의 비밀을 여는 열쇠는 무엇일까요?",
    choices: [
      { label: "따뜻한 마음", correct: true, hint: "방금 마술사가 직접 알려 줬어요." },
      { label: "커다란 망치", correct: false, hint: "이 문은 힘으로 여는 문이 아니에요." },
      { label: "시끄러운 종", correct: false, hint: "이 비밀은 조용하고 따뜻한 마음과 관련 있어요." },
    ],
  },
  {
    id: "ending",
    type: "ending",
    room: "비밀의 방",
    progress: "완료",
    title: "마술사의 비밀",
    story:
      "비밀의 방 안에는 반짝이는 보물이 아니라 작은 거울이 있었어요. 거울 속 토끼를 본 마술사가 말했어요. “내 비밀은 다른 이를 기쁘게 보는 마음이란다.” 토끼는 활짝 웃었어요.",
    actionLabel: "처음부터 다시 하기",
  },
];

const state = {
  sceneIndex: 0,
  feedback: "",
};

const stagePanel = document.getElementById("stage-panel");
const roomBadge = document.getElementById("room-badge");
const progressText = document.getElementById("progress-text");
const sceneTitle = document.getElementById("scene-title");
const storyText = document.getElementById("story-text");
const feedbackText = document.getElementById("feedback-text");
const choicesPanel = document.getElementById("choices-panel");
const primaryAction = document.getElementById("primary-action");
```

- [ ] **Step 2: Add a minimal `renderScene()` function and initial render call**

Append this to `game.js`:

```js
function renderScene() {
  const scene = scenes[state.sceneIndex];

  roomBadge.textContent = scene.room;
  progressText.textContent = scene.progress;
  sceneTitle.textContent = scene.title;
  storyText.textContent =
    scene.type === "quiz" ? `${scene.story}\n\n${scene.question}` : scene.story;
  feedbackText.textContent = state.feedback;
  stagePanel.classList.remove("is-correct", "is-wrong");
  stagePanel.classList.add("is-fading");
  window.setTimeout(() => stagePanel.classList.remove("is-fading"), 350);

  choicesPanel.innerHTML = "";

  if (scene.type === "quiz") {
    scene.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.textContent = `${index + 1}. ${choice.label}`;
      button.addEventListener("click", () => handleChoice(index));
      choicesPanel.appendChild(button);
    });
    primaryAction.hidden = true;
  } else {
    primaryAction.hidden = false;
    primaryAction.textContent = scene.actionLabel;
  }
}

renderScene();
```

- [ ] **Step 3: Verify the data and render function exist**

Run: `rg -n "const scenes|renderScene\\(|handleChoice|primaryAction.hidden" game.js`
Expected: matches for scene data, `renderScene`, `handleChoice` placeholder usage, and action visibility logic

- [ ] **Step 4: Open the page and verify the start scene renders**

Run: `open index.html`
Expected: the start scene appears with the opening story and a visible `탑 안으로 들어가기` button

- [ ] **Step 5: Commit the initial logic if git is available**

Run: `git rev-parse --is-inside-work-tree`
Expected: `true` if git is available; if not, skip commit in this workspace

If the command returns `true`, run:

```bash
git add game.js index.html
git commit -m "feat: add rabbit quiz story data and renderer"
```

### Task 4: Add Answer Handling And Scene Progression

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Write the scene advancement and choice handlers**

Append this to `game.js`:

```js
function goToNextScene() {
  if (state.sceneIndex < scenes.length - 1) {
    state.sceneIndex += 1;
    state.feedback = "";
  }
  renderScene();
}

function resetGame() {
  state.sceneIndex = 0;
  state.feedback = "";
  renderScene();
}

function handleChoice(choiceIndex) {
  const scene = scenes[state.sceneIndex];
  const choice = scene.choices[choiceIndex];

  if (choice.correct) {
    state.feedback = "정답이에요! 반짝 문이 열렸어요.";
    stagePanel.classList.add("is-correct");
    window.setTimeout(() => {
      goToNextScene();
    }, 500);
    return;
  }

  state.feedback = `힌트: ${choice.hint}`;
  stagePanel.classList.add("is-wrong");
  window.setTimeout(() => stagePanel.classList.remove("is-wrong"), 280);
  renderScene();
}

primaryAction.addEventListener("click", () => {
  const scene = scenes[state.sceneIndex];

  if (scene.id === "ending") {
    resetGame();
    return;
  }

  goToNextScene();
});
```

- [ ] **Step 2: Fix the stage feedback reset bug before running**

Update `renderScene()` so it preserves the wrong-answer feedback text and only removes temporary stage classes, not the user-visible hint.

The body should keep:

```js
feedbackText.textContent = state.feedback;
stagePanel.classList.remove("is-correct", "is-wrong");
```

and should not overwrite `state.feedback` unless moving to the next scene or resetting the game.

- [ ] **Step 3: Open the page and manually verify the full happy path**

Run: `open index.html`
Expected:
- start button advances to the first quiz
- correct answers move to the next scene
- the ending scene appears after the fifth correct answer
- the ending button restarts the game

- [ ] **Step 4: Open the page again and manually verify wrong-answer behavior**

Run: `open index.html`
Expected:
- a wrong choice keeps the player on the same quiz
- a hint appears in the feedback area
- the player can retry and still continue

- [ ] **Step 5: Commit progression logic if git is available**

Run: `git rev-parse --is-inside-work-tree`
Expected: `true` if git is available; if not, skip commit in this workspace

If the command returns `true`, run:

```bash
git add game.js
git commit -m "feat: add rabbit quiz progression and answer handling"
```

## Chunk 3: Polish, Responsiveness, And Final Verification

### Task 5: Improve Visual Variety Across Rooms

**Files:**
- Modify: `game.js`
- Modify: `style.css`

- [ ] **Step 1: Add per-room visual theme metadata to each scene**

Update each scene object in `game.js` to include a `theme` field such as:

```js
theme: "entrance"
theme: "star"
theme: "card"
theme: "moon"
theme: "secret"
```

- [ ] **Step 2: Add render logic that updates the stage theme class**

Inside `renderScene()`, add:

```js
stagePanel.dataset.theme = scene.theme;
```

- [ ] **Step 3: Add themed CSS for the room backgrounds**

Append this to `style.css`:

```css
.stage-panel[data-theme="entrance"] .stage-backdrop {
  background:
    radial-gradient(circle at 50% 12%, rgba(255,255,255,0.75), transparent 16%),
    linear-gradient(180deg, rgba(201, 157, 255, 0.8), rgba(255, 226, 184, 0.7));
}

.stage-panel[data-theme="star"] .stage-backdrop {
  background:
    radial-gradient(circle at 20% 22%, rgba(255,255,255,0.95), transparent 9%),
    radial-gradient(circle at 76% 26%, rgba(255,255,255,0.75), transparent 7%),
    linear-gradient(180deg, rgba(111, 102, 221, 0.92), rgba(155, 127, 240, 0.82));
}

.stage-panel[data-theme="card"] .stage-backdrop {
  background:
    linear-gradient(135deg, rgba(255,255,255,0.2) 25%, transparent 25%) 0 0/28px 28px,
    linear-gradient(180deg, rgba(255, 186, 215, 0.9), rgba(255, 232, 186, 0.82));
}

.stage-panel[data-theme="moon"] .stage-backdrop {
  background:
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.8), transparent 14%),
    linear-gradient(180deg, rgba(115, 142, 215, 0.88), rgba(225, 237, 255, 0.88));
}

.stage-panel[data-theme="secret"] .stage-backdrop {
  background:
    radial-gradient(circle at 50% 28%, rgba(255,255,255,0.82), transparent 18%),
    linear-gradient(180deg, rgba(176, 244, 214, 0.85), rgba(255, 247, 201, 0.82));
}
```

- [ ] **Step 4: Verify room visuals change as scenes advance**

Run: `open index.html`
Expected: the stage background looks noticeably different in the entrance, star, card, moon, and secret scenes

- [ ] **Step 5: Commit the visual theme pass if git is available**

Run: `git rev-parse --is-inside-work-tree`
Expected: `true` if git is available; if not, skip commit in this workspace

If the command returns `true`, run:

```bash
git add game.js style.css
git commit -m "feat: add room-based visual themes for rabbit quiz game"
```

### Task 6: Final Responsive And Interaction Verification

**Files:**
- Modify: `index.html` if accessibility labels are missing
- Modify: `style.css` if mobile layout breaks
- Modify: `game.js` if scene flow bugs appear

- [ ] **Step 1: Run a desktop pass**

Run: `open index.html`
Expected:
- all text is readable
- buttons remain fully visible
- there is no overlap between stage, text, and choices

- [ ] **Step 2: Run a mobile-width pass with browser responsive tools**

Run: `open index.html`
Expected:
- at narrow width, actors stack vertically
- buttons remain easy to tap
- story text does not overflow its panel

- [ ] **Step 3: Run a full end-to-end interaction pass**

Run: `open index.html`
Expected:
- a player can finish the full game using only clicks or taps
- wrong answers show hints and allow retry
- restarting from the ending returns to the opening scene

- [ ] **Step 4: Clean up only issues discovered during verification**

Apply the smallest possible changes needed to fix any verified layout or logic defects.

- [ ] **Step 5: Commit final fixes if git is available**

Run: `git rev-parse --is-inside-work-tree`
Expected: `true` if git is available; if not, skip commit in this workspace

If the command returns `true`, run:

```bash
git add index.html style.css game.js
git commit -m "fix: polish rabbit magician quiz game interactions"
```
