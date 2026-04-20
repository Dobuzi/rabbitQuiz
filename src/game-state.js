export function createInitialState() {
  return {
    sceneIndex: 0,
    feedback: "",
    lastAnswerCorrect: false,
  };
}

export function getCurrentScene(state, scenes) {
  return scenes[state.sceneIndex];
}

export function submitChoice(state, scenes, choiceIndex) {
  const scene = getCurrentScene(state, scenes);
  const choice = scene.choices[choiceIndex];

  if (choice.correct) {
    return {
      ...state,
      feedback: "정답이에요! 반짝 문이 열렸어요.",
      lastAnswerCorrect: true,
    };
  }

  return {
    ...state,
    feedback: `힌트: ${choice.hint}`,
    lastAnswerCorrect: false,
  };
}

export function advanceScene(state, scenes) {
  const nextIndex = Math.min(state.sceneIndex + 1, scenes.length - 1);

  return {
    sceneIndex: nextIndex,
    feedback: "",
    lastAnswerCorrect: false,
  };
}

export function restartGame() {
  return createInitialState();
}
