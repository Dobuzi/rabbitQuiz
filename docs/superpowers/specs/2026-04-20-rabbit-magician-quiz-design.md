# Rabbit And Magician Secret Quiz Game Design

## Summary

Build a short browser game for children about a rabbit exploring a magician's secret tower.
The game should feel like a small storybook adventure, not an arcade challenge.
Players progress by reading short scenes and answering easy multiple-choice quiz questions.

## Goals

- Deliver a complete playable game that runs directly in the browser.
- Keep the tone bright, magical, and child-friendly.
- Make the full game completable in about 5 minutes.
- Ensure no hard fail state blocks progress.

## Scope

### In scope

- One short story campaign
- Three themed rooms
- Five total quiz questions
- Multiple-choice answers only
- Hint-and-retry flow for wrong answers
- Start screen, story progression, and ending screen
- Responsive layout for desktop and mobile

### Out of scope

- User accounts or save data
- Timers, scores, lives, or game over states
- Audio requirements
- Backend services
- Phaser or other game engine setup

## Audience

Children.

This means:

- Very simple wording
- No scary imagery or punishment
- Questions should be solvable from context in the current scene

## Product Direction

### Chosen implementation

Use a minimal static web build:

- `index.html`
- `style.css`
- `game.js`

The entire game should run on a single page with in-memory state transitions.

### Why this approach

- Fastest path from an empty folder to a polished playable game
- No dependency installation required
- Small enough that extra abstraction would be wasteful
- Easy to open directly in a browser

## Story Structure

### Flow

1. Start screen
2. Opening scene: the rabbit enters the magician's tower
3. Star Room: 1 quiz
4. Card Room: 2 quizzes
5. Moonlight Room: 2 quizzes
6. Ending scene: the magician reveals the secret

### Tone

- Warm
- Curious
- Playful
- Wonder-driven

The magician should feel mysterious but kind.

## Gameplay Rules

- The player reads a short story segment for each scene.
- A quiz appears with 3 or more answer choices.
- Correct answers advance the story.
- Wrong answers show a short hint and allow another attempt.
- The player can always continue until the ending.

## UI Design

### Layout

Use a single-screen layout with four zones:

- Header: title and progress indicator
- Stage: main visual scene for rabbit, magician, and room atmosphere
- Dialogue panel: story text and hints
- Choice panel: multiple-choice buttons

### Motion

Use only light effects:

- Fade between scenes
- Small sparkle effect on correct answer
- Gentle visual feedback on incorrect answer

### Visual style

- Storybook fantasy
- Soft, colorful backgrounds
- Friendly shapes and readable contrast

## Content Design

Quiz content should be based on the story context, not external knowledge.

Examples of acceptable question patterns:

- Pick the symbol that matches the clue just shown
- Choose the item the rabbit needs next
- Identify the correct magical object from the scene description

Examples to avoid:

- Trivia requiring outside knowledge
- Reading level beyond a young child
- Trick questions with ambiguous wording

## State Model

The game state only needs to track:

- Current scene index
- Current question index
- Whether the current question was answered correctly
- Optional temporary feedback text

No persistent storage is required.

## Verification Criteria

- The full game is playable with mouse or touch only.
- The player can reach the ending without refreshing the page.
- Every question presents at least 3 choices.
- Wrong answers do not dead-end the game.
- The game remains readable and usable on mobile and desktop widths.

## Implementation Notes

- Keep code simple and explicit.
- Avoid introducing abstractions that exist for only one use.
- Keep story data in a plain structured array or object.
- Render from state rather than manually wiring each scene as separate DOM pages.

## Risks

### Main risk

The game could become visually cute but mechanically repetitive.

### Mitigation

Give each room a distinct theme and vary the prompt style slightly while keeping the interaction model unchanged.
