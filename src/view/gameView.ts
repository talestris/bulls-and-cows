import { getState, addGameAttempt, resetToSetup } from "../main";
import { createDigitValidator, isValidGuess, evaluateGuess } from "../core/gameLogic";
import { saveHighscore } from "../services/storage";

export const renderGameScreen = (): HTMLElement => {
  const state = getState();
  const { length, base } = state.settings;

  const container = document.createElement("div");
  container.className = "game-screen";

  const header = document.createElement("div");
  header.className = "game-header";

  const title = document.createElement("h2");
  title.textContent = `Game Mode: ${length} digits (base ${base})`;
  header.appendChild(title);

  const backButton = document.createElement("button");
  backButton.className = "back-button";
  backButton.textContent = "New Game";
  backButton.addEventListener("click", resetToSetup);
  header.appendChild(backButton);
  container.appendChild(header);

  const isCharValid = createDigitValidator(base);

  if (state.status === "playing") {
    const inputSection = document.createElement("div");
    inputSection.className = "input-section";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Enter ${length} unique digits`;
    input.maxLength = length;
    input.className = "guess-input";

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Tab") return;

      if (!isCharValid(e.key)) e.preventDefault();
    });

    const submitButton = document.createElement("button");
    submitButton.className = "submit-button";
    submitButton.textContent = "Check";

    const errorDisplay = document.createElement("p");
    errorDisplay.className = "error-message";

    const handleAddGuess = () => {
      const guessStr = input.value.trim();
      errorDisplay.textContent = "";

      if (!isValidGuess(guessStr, length, base)) {
        errorDisplay.textContent = `You must input exactly ${length} unique digits`;
        return;
      }

      const isDuplicate = state.history.some(
        (h) => h.guess.toLowerCase() === guessStr.toLowerCase()
      );
      if (isDuplicate) {
        errorDisplay.textContent = "You already tried this combination!";
        input.value = "";
        return;
      }

      const guessArray = guessStr.split("");
      const { bulls, cows } = evaluateGuess(state.secret, guessArray);

      addGameAttempt(guessStr, bulls, cows);
    };

    submitButton.addEventListener("click", handleAddGuess);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleAddGuess();
    });

    inputSection.appendChild(input);
    inputSection.appendChild(submitButton);
    container.appendChild(inputSection);
    container.appendChild(errorDisplay);

    setTimeout(() => input.focus(), 0);
  }

  if (state.status === "won") {
    const winSection = document.createElement("div");
    winSection.className = "win-section animate-win";

    const winTitle = document.createElement("h2");
    winTitle.textContent = "You won!";
    winSection.appendChild(winTitle);

    const secretText = document.createElement("p");
    secretText.className = "secret-display";
    secretText.textContent = `The secret number: ${state.secret.join("")}`;
    winSection.appendChild(secretText);

    const statsText = document.createElement("p");
    const totalTime = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : 0;
    statsText.textContent = `Total attempts: ${state.history.length} | Time: ${totalTime} sec`;
    winSection.appendChild(statsText);

    const newGameButton = document.createElement("button");
    newGameButton.className = "new-game-button";
    newGameButton.textContent = "New Game";
    newGameButton.addEventListener("click", resetToSetup);
    winSection.appendChild(newGameButton);

    container.appendChild(winSection);
  }

  if (state.history.length > 0) {
    const historySection = document.createElement("div");
    historySection.className = "history-section";

    const historyTitle = document.createElement("h3");
    historyTitle.textContent = "Previous attempts";
    historySection.appendChild(historyTitle);

    const historyList = document.createElement("div");
    historyList.className = "history-list";

    [...state.history].reverse().forEach((attempt, index) => {
      const actualIndex = state.history.length - index;

      const item = document.createElement("div");
      item.className = "history-item";

      const numSpan = document.createElement("span");
      numSpan.className = "attempt-num";
      numSpan.textContent = `#${actualIndex}`;

      const guessSpan = document.createElement("span");
      guessSpan.className = "attempt-guess";
      guessSpan.textContent = attempt.guess.toUpperCase();

      const badgesContainer = document.createElement("div");
      badgesContainer.className = "badges-container";

      const bullsBadge = document.createElement("span");
      bullsBadge.className = "badge badge-bulls";
      bullsBadge.textContent = `${attempt.bulls} bulls`;

      const cowsBadge = document.createElement("span");
      cowsBadge.className = "badge badge-cows";
      cowsBadge.textContent = `${attempt.cows} cows`;

      badgesContainer.appendChild(bullsBadge);
      badgesContainer.appendChild(cowsBadge);

      item.appendChild(numSpan);
      item.appendChild(guessSpan);
      item.appendChild(badgesContainer);
      historyList.appendChild(item);
    });

    historySection.appendChild(historyList);
    container.appendChild(historySection);
  }
  return container;
};
