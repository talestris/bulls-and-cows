import { startNewRound } from "../main";
import { countPossibleSecrets } from "../core/gameLogic";
import { getHighScores } from "../services/storage";

export const renderSetupScreen = (): HTMLElement => {
  const container = document.createElement("div");
  container.className = "setup-screen";

  const title = document.createElement("h1");
  title.textContent = "Bulls and Cows";
  container.appendChild(title);

  let selectedBase = 10;
  let selectedLength = 4;

  const baseSection = document.createElement("div");
  baseSection.className = "section";

  const baseTitle = document.createElement("h3");
  baseTitle.textContent = "Select Number Base";
  baseSection.appendChild(baseTitle);

  const baseButtonsContainer = document.createElement("div");
  baseButtonsContainer.className = "buttons-row";
  baseSection.appendChild(baseButtonsContainer);
  container.appendChild(baseSection);

  const bases = [
    { name: "Binary (Bin)", value: 2 },
    { name: "Octal (Oct)", value: 8 },
    { name: "Decimal (Dec)", value: 10 },
    { name: "Hexadecimal (Hex)", value: 16 },
  ];

  const lengthSelectContainer = document.createElement("div");
  lengthSelectContainer.className = "section";

  const lengthTitle = document.createElement("h3");
  lengthTitle.textContent = "Secret number length: ";
  lengthSelectContainer.appendChild(lengthTitle);

  const lengthButtonsContainer = document.createElement("div");
  lengthButtonsContainer.className = "buttons-row";

  const infotext = document.createElement("p");
  infotext.className = "combinations-info";
  container.appendChild(infotext);

  const updateCombinationsInfo = () => {
    const count = countPossibleSecrets(selectedLength, selectedBase);
    infotext.textContent = `Possible secret combinations: ${count}`;
  };

  const updateLengthOptions = () => {
    lengthButtonsContainer.textContent = "";

    for (let l = 2; l <= 6; l++) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = l.toString();
      button.className = `radio-button ${selectedLength === l ? "active" : ""}`;

      if (selectedBase === 2 && l !== 2) {
        button.disabled = true;
        button.classList.add("disabled");
      }

      button.addEventListener("click", () => {
        selectedLength = l;
        updateLengthOptions();
        updateCombinationsInfo();
      });

      lengthButtonsContainer.appendChild(button);
    }
  };

  bases.forEach((b) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = b.name;
    button.className = `radio-button ${selectedBase === b.value ? "active" : ""}`;

    button.addEventListener("click", () => {
      selectedBase = b.value;

      if (selectedBase === 2) selectedLength = 2;

      Array.from(baseButtonsContainer.children).forEach((child, i) => {
        child.className = `radio-button ${bases[i].value === selectedBase ? "active" : ""}`;
      });

      updateLengthOptions();
      updateCombinationsInfo();
    });

    baseButtonsContainer.appendChild(button);
  });

  lengthSelectContainer.appendChild(lengthButtonsContainer);
  container.appendChild(lengthSelectContainer);

  const startButton = document.createElement("button");
  startButton.className = "start-button";
  startButton.textContent = "Start the Game";
  startButton.addEventListener("click", () => {
    startNewRound({ length: selectedLength, base: selectedBase });
  });

  container.appendChild(startButton);

  const scores = getHighScores();
  if (scores.length > 0) {
    const scoresSection = document.createElement("div");
    scoresSection.className = "scores-section";

    const scoresTitle = document.createElement("h3");
    scoresTitle.textContent = "Leaderboard (Top 10)";
    scoresSection.appendChild(scoresTitle);

    const table = document.createElement("table");
    table.className = "scores-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = ["System", "Attempts", "Time", "Date"];
    headers.forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    scores.forEach((s) => {
      const row = document.createElement("tr");

      const modeCell = document.createElement("td");
      modeCell.textContent = `${s.length} (base ${s.base})`;

      const attCell = document.createElement("td");
      attCell.textContent = s.attempts.toString();

      const timeCell = document.createElement("td");
      timeCell.textContent = `${s.time} sec`;

      const dateCell = document.createElement("td");
      dateCell.textContent = s.date;

      row.appendChild(modeCell);
      row.appendChild(attCell);
      row.appendChild(timeCell);
      row.appendChild(dateCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    scoresSection.appendChild(table);
    container.appendChild(scoresSection);
  }

  updateLengthOptions();
  updateCombinationsInfo();

  return container;
};
