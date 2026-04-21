import {
  advanceScene,
  createInitialState,
  getCurrentScene,
  restartGame,
  submitChoice,
} from "./src/game-state.js";
import { scenes } from "./src/scenes.js";

let state = createInitialState();

const stagePanel = document.getElementById("stage-panel");
const roomBadge = document.getElementById("room-badge");
const progressText = document.getElementById("progress-text");
const chapterLabel = document.getElementById("chapter-label");
const chapterStrip = document.getElementById("chapter-strip");
const sceneCaption = document.getElementById("scene-caption");
const sceneTitle = document.getElementById("scene-title");
const storyText = document.getElementById("story-text");
const sceneTask = document.getElementById("scene-task");
const rabbitLine = document.getElementById("rabbit-line");
const magicianLine = document.getElementById("magician-line");
const choiceGuide = document.getElementById("choice-guide");
const choicesTitle = document.getElementById("choices-title");
const feedbackText = document.getElementById("feedback-text");
const choicesPanel = document.getElementById("choices-panel");
const controlPanel = document.querySelector(".control-panel");
const primaryAction = document.getElementById("primary-action");

const choiceGuideByTheme = {
  entrance: "버튼을 누르면 이야기가 시작돼요.",
  star: "정답을 고르면 별빛 길이 열려요.",
  card: "카드를 잘 보고 토끼가 고를 답을 정해 주세요.",
  moon: "조용한 마음으로 마지막 답을 골라요.",
  secret: "마지막 장면을 읽고 다시 모험을 시작할 수 있어요.",
};

function renderChapterStrip(scene) {
  const quizScenes = scenes.filter((entry) => entry.type === "quiz");
  const activeQuizIndex = quizScenes.findIndex((entry) => entry.id === scene.id);

  chapterStrip.innerHTML = "";

  for (let index = 0; index < quizScenes.length; index += 1) {
    const marker = document.createElement("span");
    marker.className = "chapter-dot";

    if (activeQuizIndex >= 0) {
      if (index < activeQuizIndex) {
        marker.dataset.state = "done";
      } else if (index === activeQuizIndex) {
        marker.dataset.state = "current";
      }
    } else if (scene.id === "ending") {
      marker.dataset.state = "done";
    }

    chapterStrip.appendChild(marker);
  }
}

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
  chapterLabel.textContent = scene.chapter;
  sceneCaption.textContent = scene.caption;
  sceneTitle.textContent = scene.title;
  storyText.textContent = scene.type === "quiz" ? `${scene.story}\n\n${scene.question}` : scene.story;
  sceneTask.textContent = scene.task;
  rabbitLine.textContent = scene.rabbitLine;
  magicianLine.textContent = scene.magicianLine;
  choiceGuide.textContent = choiceGuideByTheme[scene.theme];
  feedbackText.textContent = state.feedback;
  choicesTitle.textContent =
    scene.type === "quiz" ? "토끼가 고를 답 하나를 정해 주세요." : "다음 장면으로 넘어가 볼까요?";
  stagePanel.dataset.speaker = scene.speaker;
  renderChapterStrip(scene);

  stagePanel.classList.remove("is-fading");
  void stagePanel.offsetWidth;
  stagePanel.classList.add("is-fading");
  window.setTimeout(() => stagePanel.classList.remove("is-fading"), 350);

  choicesPanel.innerHTML = "";

  if (scene.type === "quiz") {
    controlPanel.hidden = true;
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

  controlPanel.hidden = false;
  primaryAction.hidden = false;
  primaryAction.textContent = scene.actionLabel;

  const note = document.createElement("div");
  note.className = "choices-note";
  note.textContent =
    scene.id === "ending"
      ? "비밀을 모두 읽었어요. 다시 시작하면 토끼와 새로운 마음으로 한 번 더 올라갈 수 있어요."
      : "지금은 선택 대신 이야기를 따라가면 돼요. 아래 버튼을 누르면 다음 장면이 열려요.";
  choicesPanel.appendChild(note);
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
