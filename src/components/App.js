import React from "react";
import Palette from "./Palette";
import Heart from "./Heart";
import Rules from "./Rules";

function handleBeforeInstallPrompt(
  event,
  setInstallPromptEvent,
  setShowInstallButton
) {
  console.log("handleBeforeInstallPrompt");
  if (event) setInstallPromptEvent(event);
  setShowInstallButton(true);
}

function handleAppInstalled(setInstallPromptEvent, setShowInstallButton) {
  console.log("handleAppInstalled");
  setInstallPromptEvent(null);
  setShowInstallButton(false);
}

export default function App() {
  const [display, setDisplay] = React.useState("game");
  const [installPromptEvent, setInstallPromptEvent] = React.useState();
  const [showInstallButton, setShowInstallButton] = React.useState(true);

  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) =>
      handleBeforeInstallPrompt(
        event,
        setInstallPromptEvent,
        setShowInstallButton
      )
    );
    return () =>
      window.removeEventListener("beforeinstallprompt", (event) =>
        handleBeforeInstallPrompt(
          event,
          setInstallPromptEvent,
          setShowInstallButton
        )
      );
  }, []);

  React.useEffect(() => {
    window.addEventListener("appinstalled", () =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton)
    );
    return () => window.removeEventListener("appinstalled", handleAppInstalled);
  }, []);

  const savedIsFirstGame = JSON.parse(
    localStorage.getItem("dailyPaletteIsFirstGame")
  );

  const [isFirstGame, setIsFirstGame] = React.useState(
    savedIsFirstGame ?? true
  );

  React.useEffect(() => {
    window.localStorage.setItem(
      "dailyPaletteIsFirstGame",
      JSON.stringify(isFirstGame)
    );
  }, [isFirstGame]);

  const savedSawWhatsNew20230101 = JSON.parse(
    localStorage.getItem("dailyPaletteSawWhatsNew20230101")
  );

  const [sawWhatsNew20230101, setSawWhatsNew20230101] = React.useState(
    savedSawWhatsNew20230101 ?? false
  );

  React.useEffect(() => {
    window.localStorage.setItem(
      "dailyPaletteSawWhatsNew20230101",
      JSON.stringify(sawWhatsNew20230101)
    );
  }, [sawWhatsNew20230101]);

  if (isFirstGame) {
    return (
      <Rules
        setDisplay={setDisplay}
        isFirstGame={isFirstGame}
        setIsFirstGame={setIsFirstGame}
        setSawWhatsNew20230101={setSawWhatsNew20230101}
      ></Rules>
    );
  }

  switch (display) {
    case "game":
      return (
        <Palette
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
          setSawWhatsNew20230101={setSawWhatsNew20230101}
          sawWhatsNew20230101={sawWhatsNew20230101}
        ></Palette>
      );

    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>;

    case "heart":
      return <Heart setDisplay={setDisplay}></Heart>;

    default:
      return (
        <Palette
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
        ></Palette>
      );
  }
}
