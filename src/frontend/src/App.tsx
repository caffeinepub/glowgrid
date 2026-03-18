import { useState } from "react";
import { GameView } from "./components/GameView";
import { LandingPage } from "./components/LandingPage";

export type AppView = "landing" | "game";

export default function App() {
  const [view, setView] = useState<AppView>("landing");

  return (
    <div className="min-h-screen bg-game-bg">
      {view === "landing" ? (
        <LandingPage onPlay={() => setView("game")} />
      ) : (
        <GameView onBack={() => setView("landing")} />
      )}
    </div>
  );
}
