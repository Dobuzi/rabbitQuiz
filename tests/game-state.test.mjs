import test from "node:test";
import assert from "node:assert/strict";

import {
  createInitialState,
  getCurrentScene,
  submitChoice,
  advanceScene,
  restartGame,
} from "../src/game-state.js";

const scenes = [
  {
    id: "start",
    type: "intro",
    room: "탑의 입구",
    progress: "0 / 2",
    title: "시작",
    story: "시작 장면",
    actionLabel: "들어가기",
  },
  {
    id: "quiz-1",
    type: "quiz",
    room: "별의 방",
    progress: "1 / 2",
    title: "첫 문제",
    story: "별의 방 설명",
    question: "정답은?",
    choices: [
      { label: "별", correct: true, hint: "반짝이는 것을 골라요." },
      { label: "돌", correct: false, hint: "돌은 반짝이지 않아요." },
      { label: "모자", correct: false, hint: "모자는 쓰는 거예요." },
    ],
  },
  {
    id: "ending",
    type: "ending",
    room: "비밀의 방",
    progress: "완료",
    title: "끝",
    story: "엔딩 장면",
    actionLabel: "다시 하기",
  },
];

test("initial state starts at the first scene with no feedback", () => {
  const state = createInitialState();

  assert.equal(state.sceneIndex, 0);
  assert.equal(state.feedback, "");
  assert.equal(state.lastAnswerCorrect, false);
});

test("wrong answer keeps the player on the same quiz and shows hint feedback", () => {
  const quizState = { sceneIndex: 1, feedback: "", lastAnswerCorrect: false };

  const nextState = submitChoice(quizState, scenes, 2);

  assert.equal(nextState.sceneIndex, 1);
  assert.equal(nextState.feedback, "힌트: 모자는 쓰는 거예요.");
  assert.equal(nextState.lastAnswerCorrect, false);
});

test("correct answer marks success and advanceScene moves to the next scene", () => {
  const quizState = { sceneIndex: 1, feedback: "", lastAnswerCorrect: false };

  const answeredState = submitChoice(quizState, scenes, 0);
  assert.equal(answeredState.sceneIndex, 1);
  assert.equal(answeredState.feedback, "정답이에요! 반짝 문이 열렸어요.");
  assert.equal(answeredState.lastAnswerCorrect, true);

  const advancedState = advanceScene(answeredState, scenes);
  assert.equal(advancedState.sceneIndex, 2);
  assert.equal(advancedState.feedback, "");
  assert.equal(advancedState.lastAnswerCorrect, false);
  assert.equal(getCurrentScene(advancedState, scenes).id, "ending");
});

test("restartGame returns to the opening scene and clears feedback", () => {
  const state = { sceneIndex: 2, feedback: "무언가 남아 있음", lastAnswerCorrect: true };

  const resetState = restartGame(state);

  assert.equal(resetState.sceneIndex, 0);
  assert.equal(resetState.feedback, "");
  assert.equal(resetState.lastAnswerCorrect, false);
});
