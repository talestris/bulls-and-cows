import { getState } from "../main";
import { renderSetupScreen } from "./setupView";
import { renderGameScreen } from "./gameView";

export const renderApp = (): void => {
  document.body.textContent = "";

  const state = getState();

  const appContainer = document.createElement("main");
  appContainer.className = "game-container";

  if (state.status === "setup") {
    appContainer.appendChild(renderSetupScreen());
  } else if (state.status === "playing" || state.status === "won") {
    appContainer.appendChild(renderGameScreen());
  }

  document.body.appendChild(appContainer);
};
