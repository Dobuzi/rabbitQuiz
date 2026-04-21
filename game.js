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
