import { ArrowLeft, Clock, Trophy, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useReducer } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 28;
const GAME_DURATION = 180;
const BOT_INTERVAL = 600;

const PLAYER_COLORS: Record<string, string> = {
  player: "#00D6FF",
  bot1: "#FF3FD1",
  bot2: "#37FF6B",
  bot3: "#FF8C00",
};

const PLAYER_NAMES: Record<string, string> = {
  player: "YOU",
  bot1: "PHANTOMX",
  bot2: "GRID_GOD",
  bot3: "VOLT_RUN",
};

type EntityId = "player" | "bot1" | "bot2" | "bot3";

interface Entity {
  x: number;
  y: number;
  id: EntityId;
}

interface GameState {
  grid: (EntityId | null)[][];
  entities: Record<EntityId, Entity>;
  timeLeft: number;
  gameOver: boolean;
  winner: EntityId | null;
  started: boolean;
}

type GameAction =
  | { type: "MOVE_PLAYER"; dx: number; dy: number }
  | { type: "MOVE_BOTS" }
  | { type: "TICK" }
  | { type: "RESET" };

function initGrid(): (EntityId | null)[][] {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

function initState(): GameState {
  const grid = initGrid();
  const startPositions: Record<EntityId, { x: number; y: number }> = {
    player: { x: 2, y: 2 },
    bot1: { x: GRID_SIZE - 3, y: 2 },
    bot2: { x: 2, y: GRID_SIZE - 3 },
    bot3: { x: GRID_SIZE - 3, y: GRID_SIZE - 3 },
  };

  const entities: Record<EntityId, Entity> = {} as Record<EntityId, Entity>;
  for (const [id, pos] of Object.entries(startPositions) as [
    EntityId,
    { x: number; y: number },
  ][]) {
    entities[id] = { id, ...pos };
    grid[pos.y][pos.x] = id;
  }

  return {
    grid,
    entities,
    timeLeft: GAME_DURATION,
    gameOver: false,
    winner: null,
    started: true,
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function countCells(grid: (EntityId | null)[][], id: EntityId): number {
  return grid.flat().filter((c) => c === id).length;
}

function getLeader(grid: (EntityId | null)[][]): EntityId {
  const ids: EntityId[] = ["player", "bot1", "bot2", "bot3"];
  return ids.reduce(
    (best, id) => (countCells(grid, id) >= countCells(grid, best) ? id : best),
    ids[0],
  );
}

function botMoveDir(
  bot: Entity,
  grid: (EntityId | null)[][],
  botId: EntityId,
): { dx: number; dy: number } {
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
  ];

  const validDirs = dirs.filter(
    (d) =>
      bot.x + d.dx >= 0 &&
      bot.x + d.dx < GRID_SIZE &&
      bot.y + d.dy >= 0 &&
      bot.y + d.dy < GRID_SIZE,
  );

  const unclaimedDirs = validDirs.filter(
    (d) => grid[bot.y + d.dy][bot.x + d.dx] === null,
  );
  const nonSelfDirs = validDirs.filter(
    (d) => grid[bot.y + d.dy][bot.x + d.dx] !== botId,
  );

  const candidates =
    unclaimedDirs.length > 0
      ? unclaimedDirs
      : nonSelfDirs.length > 0
        ? nonSelfDirs
        : validDirs;

  const cx = GRID_SIZE / 2;
  const cy = GRID_SIZE / 2;
  const scored = candidates.map((d) => {
    const nx = bot.x + d.dx;
    const ny = bot.y + d.dy;
    const distToCenter = Math.abs(nx - cx) + Math.abs(ny - cy);
    const rand = Math.random() * 4;
    return { d, score: -distToCenter + rand };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.d ?? { dx: 0, dy: 0 };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "RESET") return initState();
  if (state.gameOver) return state;

  if (action.type === "TICK") {
    const timeLeft = state.timeLeft - 1;
    if (timeLeft <= 0) {
      return {
        ...state,
        timeLeft: 0,
        gameOver: true,
        winner: getLeader(state.grid),
      };
    }
    return { ...state, timeLeft };
  }

  if (action.type === "MOVE_PLAYER") {
    const { dx, dy } = action;
    const p = state.entities.player;
    const nx = clamp(p.x + dx, 0, GRID_SIZE - 1);
    const ny = clamp(p.y + dy, 0, GRID_SIZE - 1);
    if (nx === p.x && ny === p.y) return state;

    const newGrid = state.grid.map((row) => [...row]);
    newGrid[ny][nx] = "player";
    const newEntities = { ...state.entities, player: { ...p, x: nx, y: ny } };
    return { ...state, grid: newGrid, entities: newEntities };
  }

  if (action.type === "MOVE_BOTS") {
    const bots: EntityId[] = ["bot1", "bot2", "bot3"];
    const newGrid = state.grid.map((row) => [...row]);
    const newEntities = { ...state.entities };

    for (const botId of bots) {
      const bot = newEntities[botId];
      const { dx, dy } = botMoveDir(bot, newGrid, botId);
      const nx = clamp(bot.x + dx, 0, GRID_SIZE - 1);
      const ny = clamp(bot.y + dy, 0, GRID_SIZE - 1);
      newGrid[ny][nx] = botId;
      newEntities[botId] = { ...bot, x: nx, y: ny };
    }

    return { ...state, grid: newGrid, entities: newEntities };
  }

  return state;
}

interface GameViewProps {
  onBack: () => void;
}

export function GameView({ onBack }: GameViewProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, initState);

  // Timer
  useEffect(() => {
    if (state.gameOver) return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.gameOver]);

  // Bots
  useEffect(() => {
    if (state.gameOver) return;
    const id = setInterval(() => dispatch({ type: "MOVE_BOTS" }), BOT_INTERVAL);
    return () => clearInterval(id);
  }, [state.gameOver]);

  // Keyboard
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (state.gameOver) return;
      const map: Record<string, { dx: number; dy: number }> = {
        ArrowUp: { dx: 0, dy: -1 },
        ArrowDown: { dx: 0, dy: 1 },
        ArrowLeft: { dx: -1, dy: 0 },
        ArrowRight: { dx: 1, dy: 0 },
        w: { dx: 0, dy: -1 },
        s: { dx: 0, dy: 1 },
        a: { dx: -1, dy: 0 },
        d: { dx: 1, dy: 0 },
        W: { dx: 0, dy: -1 },
        S: { dx: 0, dy: 1 },
        A: { dx: -1, dy: 0 },
        D: { dx: 1, dy: 0 },
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        dispatch({ type: "MOVE_PLAYER", ...dir });
      }
    },
    [state.gameOver],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const scores = (["player", "bot1", "bot2", "bot3"] as EntityId[]).map(
    (id) => ({
      id,
      name: PLAYER_NAMES[id],
      color: PLAYER_COLORS[id],
      cells: countCells(state.grid, id),
      pct: Math.round(
        (countCells(state.grid, id) / (GRID_SIZE * GRID_SIZE)) * 100,
      ),
    }),
  );
  scores.sort((a, b) => b.cells - a.cells);

  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const timeUrgent = state.timeLeft <= 30;

  // Flatten grid for rendering to avoid nested maps with index keys
  const flatCells = state.grid.flatMap((row, rowIdx) =>
    row.map((cell, colIdx) => ({
      cell,
      rowIdx,
      colIdx,
      key: `${rowIdx}-${colIdx}`,
    })),
  );

  return (
    <div
      className="min-h-screen bg-game-bg flex flex-col"
      style={{ fontFamily: "Rajdhani, sans-serif" }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-game-border bg-game-card/80">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 font-orbitron text-xs tracking-widest text-gray-400 hover:text-white transition-colors"
          data-ocid="game.back.button"
        >
          <ArrowLeft size={14} /> BACK TO HOME
        </button>
        <div
          className="font-orbitron font-black text-lg text-glow-cyan"
          style={{ color: "#00D6FF" }}
        >
          GLOW<span style={{ color: "#FF3FD1" }}>GRID</span>
        </div>
        <div
          className={`font-orbitron font-bold text-xl flex items-center gap-2 ${timeUrgent ? "animate-pulse" : ""}`}
          style={{ color: timeUrgent ? "#FF4FD8" : "#00D6FF" }}
          data-ocid="game.timer.panel"
        >
          <Clock size={16} />
          {timeStr}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Game Grid */}
        <main
          className="flex-1 flex items-center justify-center p-4"
          data-ocid="game.canvas_target"
        >
          <div className="relative">
            <div className="absolute inset-0 scanlines z-10 pointer-events-none rounded-sm" />
            <div
              className="absolute inset-0 z-0 rounded-sm"
              style={{
                boxShadow:
                  "0 0 40px rgba(0,214,255,0.15), 0 0 80px rgba(0,214,255,0.05)",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                border: "1px solid rgba(0,214,255,0.3)",
                borderRadius: "2px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {flatCells.map(({ cell, rowIdx, colIdx, key }) => {
                const isPlayerHere =
                  state.entities.player.x === colIdx &&
                  state.entities.player.y === rowIdx;
                const entityBotHere = (
                  ["bot1", "bot2", "bot3"] as EntityId[]
                ).find(
                  (b) =>
                    state.entities[b].x === colIdx &&
                    state.entities[b].y === rowIdx,
                );
                const entityHere: EntityId | null = isPlayerHere
                  ? "player"
                  : (entityBotHere ?? null);

                const baseColor = cell ? PLAYER_COLORS[cell] : "#0B0F14";
                const isOccupied = entityHere !== null;

                return (
                  <div
                    key={key}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      background: cell ? `${baseColor}44` : "#0D1219",
                      border: "1px solid rgba(255,255,255,0.04)",
                      position: "relative",
                      transition: "background 0.15s",
                      boxShadow: isOccupied
                        ? `inset 0 0 ${CELL_SIZE}px ${PLAYER_COLORS[entityHere!]}88`
                        : cell
                          ? `inset 0 0 4px ${baseColor}33`
                          : "none",
                    }}
                  >
                    {isOccupied && entityHere && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 4,
                          borderRadius: "50%",
                          background: PLAYER_COLORS[entityHere],
                          boxShadow: `0 0 8px ${PLAYER_COLORS[entityHere]}, 0 0 20px ${PLAYER_COLORS[entityHere]}88`,
                          zIndex: 2,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right sidebar: leaderboard */}
        <aside
          className="w-64 border-l border-game-border bg-game-card/60 flex flex-col p-4 gap-4"
          data-ocid="game.leaderboard.panel"
        >
          <div
            className="font-orbitron text-xs font-bold tracking-widest flex items-center gap-2"
            style={{ color: "#00D6FF" }}
          >
            <Trophy size={12} /> LIVE SCORES
          </div>

          <div className="space-y-3">
            {scores.map((s, i) => (
              <div key={s.id} data-ocid={`game.leaderboard.item.${i + 1}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center font-orbitron text-xs font-black"
                      style={{
                        background: `${s.color}22`,
                        border: `1px solid ${s.color}`,
                        color: s.color,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span className="font-orbitron text-xs font-bold text-white">
                      {s.name}
                    </span>
                  </div>
                  <span
                    className="font-orbitron text-xs"
                    style={{ color: s.color }}
                  >
                    {s.pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-game-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${s.pct}%`,
                      background: s.color,
                      boxShadow: `0 0 4px ${s.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <div
              className="rounded-sm p-3 text-xs font-rajdhani text-gray-400"
              style={{
                background: "rgba(0,214,255,0.05)",
                border: "1px solid rgba(0,214,255,0.15)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Zap size={10} style={{ color: "#00D6FF" }} />
                <span
                  className="font-orbitron text-xs"
                  style={{ color: "#00D6FF" }}
                >
                  CONTROLS
                </span>
              </div>
              <p className="leading-relaxed">WASD or Arrow Keys to Move</p>
              <p className="leading-relaxed">
                Claim cells by running over them
              </p>
              <p className="leading-relaxed">Steal rival cells to dominate!</p>
            </div>
          </div>
        </aside>
      </div>

      {/* HUD bottom strip */}
      <div
        className="flex items-center justify-between px-6 py-2 border-t border-game-border"
        style={{
          background: "rgba(11,15,20,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span className="font-orbitron text-xs text-gray-500">ARENA ALPHA</span>
        <span className="font-orbitron text-xs" style={{ color: "#00D6FF" }}>
          CELLS CLAIMED: {countCells(state.grid, "player")}/
          {GRID_SIZE * GRID_SIZE}
        </span>
        <span className="font-orbitron text-xs text-gray-500">
          LEADER:{" "}
          <span style={{ color: PLAYER_COLORS[getLeader(state.grid)] }}>
            {PLAYER_NAMES[getLeader(state.grid)]}
          </span>
        </span>
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {state.gameOver && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "rgba(11,15,20,0.92)",
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-ocid="game.gameover.modal"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", bounce: 0.3 }}
              className="neon-border-cyan rounded-sm p-10 text-center max-w-md w-full mx-4"
              style={{ background: "#1B2330" }}
            >
              <div
                className="font-orbitron text-xs tracking-[0.4em] mb-3"
                style={{ color: "#00D6FF" }}
              >
                GAME OVER
              </div>
              <div className="font-orbitron font-black text-5xl mb-2 text-white">
                {state.winner === "player"
                  ? "YOU WIN!"
                  : `${PLAYER_NAMES[state.winner!]} WINS`}
              </div>
              <div
                className="font-rajdhani text-xl mb-8 font-semibold"
                style={{
                  color: state.winner ? PLAYER_COLORS[state.winner] : "#00D6FF",
                }}
              >
                {state.winner === "player"
                  ? "You dominated the GlowGrid!"
                  : "Better luck next time, recruit."}
              </div>

              <div className="space-y-2 mb-8">
                {scores.map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between px-4 py-2 rounded-sm"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron text-xs text-gray-500">
                        #{i + 1}
                      </span>
                      <span
                        className="font-orbitron text-xs font-bold"
                        style={{ color: s.color }}
                      >
                        {s.name}
                      </span>
                    </div>
                    <span className="font-orbitron text-xs text-white">
                      {s.cells} cells ({s.pct}%)
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "RESET" })}
                  className="btn-cta text-sm"
                  data-ocid="game.play_again.button"
                >
                  PLAY AGAIN
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="btn-outline-cyan text-sm"
                  data-ocid="game.back_to_home.button"
                >
                  MAIN MENU
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
