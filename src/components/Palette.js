import React from "react";
import Board from "./Board";
import { gameInit } from "../logic/gameInit";
import { gameReducer } from "../logic/gameReducer";
import Clues from "./Clues";
import CurrentWord from "./CurrentWord";
import GameOver from "./GameOver";
import { Countdown } from "./Countdown";
import WhatsNew from "./WhatsNew";

async function handleInstall(installPromptEvent, setInstallPromptEvent) {
  console.log("handling install");
  console.log(installPromptEvent);
  installPromptEvent.prompt();
  const result = await installPromptEvent.userChoice;
  console.log(result);
  setInstallPromptEvent(null);

  try {
    window.gtag("event", "install", {});
  } catch (error) {
    console.log("tracking error", error);
  }
}

export default function Palette({
  setDisplay,
  installPromptEvent,
  showInstallButton,
  setInstallPromptEvent,
  setSawWhatsNew20230101,
  sawWhatsNew20230101
}) {
  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {},
    gameInit
  );

  React.useEffect(() => {
    window.localStorage.setItem("dailyPaletteState", JSON.stringify(gameState));
  }, [gameState]);

  const isGameOver = gameState.clueMatches.every((i) => i);

  if (
    !sawWhatsNew20230101 &&
    gameState?.preSeededHints &&
    gameState?.numPreSeededHints // don't show if 0 hints
  ) {
    return (
      <WhatsNew
        setDisplay={setDisplay}
        setSawWhatsNew20230101={setSawWhatsNew20230101}
      ></WhatsNew>
    );
  }

  return (
    <div
      className="App"
      id="palette"
      onPointerUp={(e) => {
        e.preventDefault();

        dispatchGameState({
          action: "endWord",
        });
      }}
    >
      <div id="controls">
        <div id="nextGame">
          {isGameOver ? (
            <Countdown
              dispatchGameState={dispatchGameState}
              puzzleIndex={gameState.puzzleIndex}
            ></Countdown>
          ) : (
            `Hints used: ${
              gameState.hints.flatMap((i) => i).filter((i) => i).length -
              (gameState.numPreSeededHints ?? 0)
            }`
          )}
        </div>
        <button id="rules" onClick={() => setDisplay("rules")}></button>
        <button id="heart" onClick={() => setDisplay("heart")}></button>
        {showInstallButton && installPromptEvent ? (
          <button
            id="install"
            onClick={() =>
              handleInstall(installPromptEvent, setInstallPromptEvent)
            }
          ></button>
        ) : (
          <></>
        )}
      </div>
      <Clues
        clueMatches={gameState.clueMatches}
        hints={gameState.hints}
        clueColors={gameState.clueIndexes.map((clue) =>
          clue.map((index) => gameState.colors[index])
        )}
        clueLetters={gameState.clueIndexes.map((clue) =>
          clue.map((index) => gameState.letters[index])
        )}
        dispatchGameState={dispatchGameState}
      ></Clues>
      {isGameOver ? (
        <GameOver
          hints={gameState.hints}
          preSeededHints={gameState.preSeededHints}
          clueIndexes={gameState.clueIndexes}
          colors={gameState.colors}
        />
      ) : (
        <CurrentWord
          letters={gameState.playedIndexes.map(
            (index) => gameState.letters[index]
          )}
          colors={gameState.playedIndexes.map(
            (index) => gameState.colors[index]
          )}
        ></CurrentWord>
      )}
      <Board
        letters={gameState.letters}
        colors={gameState.colors}
        playedIndexes={gameState.playedIndexes}
        gameOver={gameState.clueMatches.every((i) => i)}
        dispatchGameState={dispatchGameState}
      ></Board>
    </div>
  );
}
