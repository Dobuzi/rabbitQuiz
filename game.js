import {
  advanceScene,
  createInitialState,
  getCurrentScene,
  restartGame,
  submitChoice,
} from "./src/game-state.js";

const scenes = [
  {
    id: "start",
    type: "intro",
    theme: "entrance",
    room: "탑의 입구",
    progress: "0 / 5",
    caption: "문이 반짝이며 천천히 열렸어요.",
    title: "모험의 시작",
    story:
      "작은 토끼는 반짝이는 탑 문 앞에 섰어요. 문이 열리자 다정한 마술사가 웃으며 말했어요.\n\n“별빛, 카드, 달빛의 방을 지나면 내 비밀을 보여 줄게.”",
    actionLabel: "탑 안으로 들어가기",
  },
  {
    id: "star-quiz",
    type: "quiz",
    theme: "star",
    room: "별의 방",
    progress: "1 / 5",
    caption: "천장의 별들이 토끼를 따라 깜빡였어요.",
    title: "별의 방",
    story:
      "별빛이 둥실 떠오른 방에서 마술사는 은빛 지팡이로 하늘을 가리켰어요. “가장 밝은 길잡이 별을 골라야 다음 문이 열려.”",
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
    theme: "card",
    room: "카드의 방",
    progress: "2 / 5",
    caption: "카드들이 나풀나풀 춤을 추기 시작했어요.",
    title: "카드의 방",
    story:
      "공중에 카드가 둥둥 떠다녔어요. 마술사는 웃으며 “같은 모양끼리 친구가 되지” 하고 속삭였어요.",
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
    theme: "card",
    room: "카드의 방",
    progress: "3 / 5",
    caption: "카드 다리가 반짝이며 길을 만들었어요.",
    title: "카드 다리",
    story:
      "바닥 위로 카드 다리가 생겼어요. 마술사가 토끼에게 부드럽게 말했어요. “가장 가벼운 마음으로 건너 보렴.”",
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
    theme: "moon",
    room: "달빛의 방",
    progress: "4 / 5",
    caption: "달빛이 조용히 방을 감싸 안았어요.",
    title: "달빛의 방",
    story:
      "하얀 달빛이 방 안을 포근하게 비췄어요. 마술사는 목소리를 낮추며 말했어요. “달빛에는 조용한 친구가 잘 어울린단다.”",
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
    theme: "moon",
    room: "비밀 문 앞",
    progress: "5 / 5",
    caption: "마지막 문이 은빛 숨결처럼 반짝였어요.",
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
    theme: "secret",
    room: "비밀의 방",
    progress: "완료",
    caption: "문이 열리자 가장 따뜻한 빛이 쏟아졌어요.",
    title: "마술사의 비밀",
    story:
      "비밀의 방 안에는 반짝이는 보물이 아니라 작은 거울이 있었어요. 거울 속 토끼를 본 마술사가 말했어요.\n\n“내 비밀은 다른 이를 기쁘게 보는 마음이란다.”\n\n토끼는 활짝 웃으며 오늘의 모험을 꼭 기억하기로 했어요.",
    actionLabel: "처음부터 다시 하기",
  },
];

let state = createInitialState();

const stagePanel = document.getElementById("stage-panel");
const roomBadge = document.getElementById("room-badge");
const progressText = document.getElementById("progress-text");
const sceneCaption = document.getElementById("scene-caption");
const sceneTitle = document.getElementById("scene-title");
const storyText = document.getElementById("story-text");
const feedbackText = document.getElementById("feedback-text");
const choicesPanel = document.getElementById("choices-panel");
const primaryAction = document.getElementById("primary-action");

function setStageFeedbackClass(className) {
  stagePanel.classList.remove("is-correct", "is-wrong");
  if (className) {
    stagePanel.classList.add(className);
  }
}

function renderScene() {
  const scene = getCurrentScene(state, scenes);

  stagePanel.dataset.theme = scene.theme;
  roomBadge.textContent = scene.room;
  progressText.textContent = scene.progress;
  sceneCaption.textContent = scene.caption;
  sceneTitle.textContent = scene.title;
  storyText.textContent = scene.type === "quiz" ? `${scene.story}\n\n${scene.question}` : scene.story;
  feedbackText.textContent = state.feedback;

  stagePanel.classList.remove("is-fading");
  void stagePanel.offsetWidth;
  stagePanel.classList.add("is-fading");
  window.setTimeout(() => stagePanel.classList.remove("is-fading"), 350);

  choicesPanel.innerHTML = "";

  if (scene.type === "quiz") {
    primaryAction.hidden = true;
    scene.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.textContent = `${index + 1}. ${choice.label}`;
      button.addEventListener("click", () => handleChoice(index));
      choicesPanel.appendChild(button);
    });
    return;
  }

  primaryAction.hidden = false;
  primaryAction.textContent = scene.actionLabel;
}

function goToNextScene() {
  state = advanceScene(state, scenes);
  renderScene();
}

function handleChoice(choiceIndex) {
  state = submitChoice(state, scenes, choiceIndex);
  const wasCorrect = state.lastAnswerCorrect;
  setStageFeedbackClass(wasCorrect ? "is-correct" : "is-wrong");
  renderScene();

  if (!wasCorrect) {
    window.setTimeout(() => setStageFeedbackClass(""), 280);
    return;
  }

  window.setTimeout(() => {
    setStageFeedbackClass("");
    goToNextScene();
  }, 520);
}

primaryAction.addEventListener("click", () => {
  const scene = getCurrentScene(state, scenes);

  if (scene.id === "ending") {
    state = restartGame();
    setStageFeedbackClass("");
    renderScene();
    return;
  }

  goToNextScene();
});

renderScene();
