import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Shield, Magnet, Clock, Sparkles, Heart } from "lucide-react";

const GRID_SIZE = 17;
const CELL_SIZE = 22;
const BASE_SPEED_MS = 140;
const BRACELET_WIN_BEADS = 16;

type Character = "turtle" | "tiger";
type Direction = "up" | "down" | "left" | "right";

type GameModeId = "classic" | "zen" | "rush" | "conservation";
interface GameModeConfig {
  id: GameModeId;
  name: string;
  tagline: string;
  speedMs: number;
  wrapWalls: boolean;
  multiBeads: number;
  allowPowerUps: boolean;
}

const GAME_MODES: GameModeConfig[] = [
  {
    id: "classic",
    name: "Classic",
    tagline: "One bead, one goal",
    speedMs: BASE_SPEED_MS,
    wrapWalls: false,
    multiBeads: 1,
    allowPowerUps: true,
  },
  {
    id: "zen",
    name: "Zen",
    tagline: "Chill slither, no game over",
    speedMs: 200,
    wrapWalls: true,
    multiBeads: 1,
    allowPowerUps: true,
  },
  {
    id: "rush",
    name: "Rush",
    tagline: "Fast & chaotic",
    speedMs: 90,
    wrapWalls: false,
    multiBeads: 3,
    allowPowerUps: true,
  },
  {
    id: "conservation",
    name: "Conservation",
    tagline: "Every bead = impact",
    speedMs: 150,
    wrapWalls: false,
    multiBeads: 1,
    allowPowerUps: true,
  },
];

type PowerUpId = "double" | "shield" | "magnet" | "slowmo" | "beadrain" | "extralife";
interface PowerUp {
  id: PowerUpId;
  pos: Position;
  durationSec?: number; // for timed effects
}
interface ActiveEffect {
  id: PowerUpId;
  expiresAt: number;
}

interface Position {
  x: number;
  y: number;
}

const getRandomCell = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const getInitialSnake = (): Position[] => {
  const mid = Math.floor(GRID_SIZE / 2);
  return [
    { x: mid, y: mid },
    { x: mid, y: mid + 1 },
    { x: mid, y: mid + 2 },
  ];
};

const nextHead = (head: Position, dir: Direction): Position => {
  switch (dir) {
    case "up":
      return { x: head.x, y: head.y - 1 };
    case "down":
      return { x: head.x, y: head.y + 1 };
    case "left":
      return { x: head.x - 1, y: head.y };
    case "right":
      return { x: head.x + 1, y: head.y };
  }
};

const oppositeDir = (dir: Direction): Direction => {
  switch (dir) {
    case "up": return "down";
    case "down": return "up";
    case "left": return "right";
    case "right": return "left";
  }
};

const manhattanDist = (a: Position, b: Position) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const wrap = (p: Position): Position => ({
  x: ((p.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE,
  y: ((p.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE,
});

const samePos = (a: Position, b: Position) => a.x === b.x && a.y === b.y;
const inBounds = (p: Position) =>
  p.x >= 0 && p.x < GRID_SIZE && p.y >= 0 && p.y < GRID_SIZE;

const POWER_UP_CHANCE = 0.2;
const POWER_UP_OPTIONS: PowerUpId[] = [
  "double",
  "shield",
  "magnet",
  "slowmo",
  "beadrain",
  "extralife",
];
const EFFECT_DURATIONS: Record<PowerUpId, number> = {
  double: 10,
  shield: 0,
  magnet: 8,
  slowmo: 6,
  beadrain: 0,
  extralife: 0,
};

export default function BraceGame() {
  const [screen, setScreen] = useState<"character" | "mode" | "game">("character");
  const [character, setCharacter] = useState<Character | null>(null);
  const [mode, setMode] = useState<GameModeConfig | null>(null);
  const [snake, setSnake] = useState<Position[]>([]);
  const [nextDirection, setNextDirection] = useState<Direction>("up");
  const [foods, setFoods] = useState<Position[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [lives, setLives] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lastCollectedBead, setLastCollectedBead] = useState(false);
  const [collectBurstPos, setCollectBurstPos] = useState<Position | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const highScoreKey = "wyldstone_bracegame_highscore";
  const snakeRef = useRef<Position[]>([]);
  const foodsRef = useRef<Position[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const activeEffectsRef = useRef<ActiveEffect[]>([]);
  const nextDirectionRef = useRef<Direction>("up");
  const modeRef = useRef<GameModeConfig | null>(null);
  const livesRef = useRef(1);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    foodsRef.current = foods;
  }, [foods]);
  useEffect(() => {
    powerUpsRef.current = powerUps;
  }, [powerUps]);
  useEffect(() => {
    activeEffectsRef.current = activeEffects;
  }, [activeEffects]);
  useEffect(() => {
    nextDirectionRef.current = nextDirection;
  }, [nextDirection]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  const spawnFoods = useCallback(
    (exclude: Position[], count: number): Position[] => {
      const excludeSet = new Set(exclude.map((p) => `${p.x},${p.y}`));
      const result: Position[] = [];
      let attempts = 0;
      while (result.length < count && attempts < 200) {
        const pos = getRandomCell();
        const key = `${pos.x},${pos.y}`;
        if (!excludeSet.has(key)) {
          excludeSet.add(key);
          result.push(pos);
        }
        attempts++;
      }
      return result;
    },
    []
  );

  const spawnPowerUp = useCallback((exclude: Position[]): PowerUp | null => {
    const excludeSet = new Set(exclude.map((p) => `${p.x},${p.y}`));
    let pos = getRandomCell();
    let attempts = 0;
    while (excludeSet.has(`${pos.x},${pos.y}`) && attempts < 100) {
      pos = getRandomCell();
      attempts++;
    }
    if (excludeSet.has(`${pos.x},${pos.y}`)) return null;
    const id = POWER_UP_OPTIONS[Math.floor(Math.random() * POWER_UP_OPTIONS.length)];
    const durationSec = EFFECT_DURATIONS[id];
    return { id, pos, durationSec: durationSec || undefined };
  }, []);

  const addEffect = useCallback((id: PowerUpId) => {
    const durationSec = EFFECT_DURATIONS[id];
    const expiresAt = durationSec > 0 ? Date.now() + durationSec * 1000 : 0;
    if (id === "extralife") setLives((l) => l + 1);
    setActiveEffects((prev) => {
      const next = [...prev.filter((e) => e.id !== id), { id, expiresAt }];
      activeEffectsRef.current = next;
      return next;
    });
  }, []);

  const startGame = useCallback(() => {
    if (!mode) return;
    const initialSnake = getInitialSnake();
    const initialFoods = spawnFoods(initialSnake, mode.multiBeads);
    setSnake(initialSnake);
    setNextDirection("up");
    setFoods(initialFoods);
    setPowerUps([]);
    setActiveEffects([]);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setLives(0);
    setLastCollectedBead(false);
  }, [mode, spawnFoods]);

  const handleCharacterSelect = useCallback((c: Character) => {
    setCharacter(c);
    setScreen("mode");
  }, []);

  const handleModeSelect = useCallback(
    (m: GameModeConfig) => {
      setMode(m);
      const initialSnake = getInitialSnake();
      const initialFoods = spawnFoods(initialSnake, m.multiBeads);
      setSnake(initialSnake);
      setNextDirection("up");
      setFoods(initialFoods);
      setPowerUps([]);
      setActiveEffects([]);
      setScore(0);
      setGameOver(false);
      setGameWon(false);
      setLives(0);
      setScreen("game");
    },
    [spawnFoods]
  );

  const goBackToMode = useCallback(() => {
    setScreen("mode");
    setGameOver(false);
    setGameWon(false);
  }, []);

  // Game loop
  useEffect(() => {
    if (screen !== "game" || !mode || gameOver || gameWon) return;

    const config = modeRef.current ?? mode;
    const speedMs = config.speedMs;
    const hasSlowMo = activeEffectsRef.current.some((e) => e.id === "slowmo");
    const effectiveSpeed = hasSlowMo ? speedMs * 2 : speedMs;

    const tick = () => {
      const prev = snakeRef.current;
      const currentFoods = foodsRef.current;
      const currentPowerUps = powerUpsRef.current;
      const dir = nextDirectionRef.current;
      const cfg = modeRef.current;
      if (!cfg || prev.length === 0) return;

      let head = nextHead(prev[0], dir);
      if (cfg.wrapWalls) {
        head = wrap(head);
      } else if (!inBounds(head)) {
        const hasShield = activeEffectsRef.current.some((e) => e.id === "shield");
        const hasExtraLife = activeEffectsRef.current.some((e) => e.id === "extralife");
        if (hasShield) {
          setActiveEffects((e) => e.filter((x) => x.id !== "shield"));
          activeEffectsRef.current = activeEffectsRef.current.filter((x) => x.id !== "shield");
          const reverse = oppositeDir(dir);
          nextDirectionRef.current = reverse;
          setNextDirection(reverse);
          return;
        }
        if (hasExtraLife && livesRef.current > 0) {
          setActiveEffects((e) => e.filter((x) => x.id !== "extralife"));
          activeEffectsRef.current = activeEffectsRef.current.filter((x) => x.id !== "extralife");
          setLives((l) => l - 1);
          livesRef.current = livesRef.current - 1;
          const mid = Math.floor(GRID_SIZE / 2);
          const newSnake = [
            { x: mid, y: mid },
            { x: mid, y: mid + 1 },
            { x: mid, y: mid + 2 },
          ];
          snakeRef.current = newSnake;
          setSnake(newSnake);
          nextDirectionRef.current = "up";
          setNextDirection("up");
          return;
        }
        setGameOver(true);
        if (tickRef.current) clearInterval(tickRef.current);
        return;
      }

      if (prev.some((seg) => samePos(seg, head))) {
        const hasShield = activeEffectsRef.current.some((e) => e.id === "shield");
        const hasExtraLife = activeEffectsRef.current.some((e) => e.id === "extralife");
        if (hasShield) {
          setActiveEffects((e) => e.filter((x) => x.id !== "shield"));
          activeEffectsRef.current = activeEffectsRef.current.filter((x) => x.id !== "shield");
          const reverse = oppositeDir(dir);
          nextDirectionRef.current = reverse;
          setNextDirection(reverse);
          return;
        }
        if (hasExtraLife && livesRef.current > 0) {
          setActiveEffects((e) => e.filter((x) => x.id !== "extralife"));
          activeEffectsRef.current = activeEffectsRef.current.filter((x) => x.id !== "extralife");
          setLives((l) => l - 1);
          livesRef.current = livesRef.current - 1;
          const mid = Math.floor(GRID_SIZE / 2);
          const newSnake = [
            { x: mid, y: mid },
            { x: mid, y: mid + 1 },
            { x: mid, y: mid + 2 },
          ];
          snakeRef.current = newSnake;
          setSnake(newSnake);
          nextDirectionRef.current = "up";
          setNextDirection("up");
          return;
        }
        setGameOver(true);
        if (tickRef.current) clearInterval(tickRef.current);
        return;
      }

      const newSnake = [head, ...prev];
      let ateBead = false;
      let newFoods = [...currentFoods];
      const eatenFoodIndex = newFoods.findIndex((f) => samePos(f, head));
      if (eatenFoodIndex !== -1) {
        newFoods.splice(eatenFoodIndex, 1);
        const points = activeEffectsRef.current.some((e) => e.id === "double") ? 2 : 1;
        setScore((s) => {
          const next = s + points;
          const stored = parseInt(
            typeof window !== "undefined"
              ? window.localStorage.getItem(highScoreKey) ?? "0"
              : "0",
            10
          );
          if (next > stored) {
            window.localStorage.setItem(highScoreKey, String(next));
            setHighScore(next);
          }
          return next;
        });
        ateBead = true;
        setLastCollectedBead(true);
        setCollectBurstPos(head);
        setTimeout(() => setLastCollectedBead(false), 200);
        setTimeout(() => setCollectBurstPos(null), 450);
      } else {
        newSnake.pop();
      }

      // Refill foods to target count
      const targetCount = cfg.multiBeads;
      while (newFoods.length < targetCount) {
        const extra = spawnFoods(newSnake.concat(newFoods), 1);
        if (extra.length > 0) newFoods.push(extra[0]);
        else break;
      }

      // Spawn power-up sometimes
      if (
        ateBead &&
        cfg.allowPowerUps &&
        Math.random() < POWER_UP_CHANCE &&
        currentPowerUps.length < 2
      ) {
        const pu = spawnPowerUp([...newSnake, ...newFoods].concat(currentPowerUps.map((p) => p.pos)));
        if (pu) {
          setPowerUps((prev) => [...prev, pu]);
          powerUpsRef.current = [...powerUpsRef.current, pu];
        }
      }

      // Bead rain: add 3 beads
      if (ateBead && activeEffectsRef.current.some((e) => e.id === "beadrain")) {
        setActiveEffects((e) => e.filter((x) => x.id !== "beadrain"));
        activeEffectsRef.current = activeEffectsRef.current.filter((x) => x.id !== "beadrain");
        const rain = spawnFoods(newSnake.concat(newFoods), 3);
        newFoods = newFoods.concat(rain);
      }

      // Magnet: pull beads within 3 cells one step toward head
      const hasMagnet = activeEffectsRef.current.some((e) => e.id === "magnet");
      if (hasMagnet && newSnake.length > 0) {
        const h = newSnake[0];
        const occupied = new Set(newSnake.map((p) => `${p.x},${p.y}`));
        newFoods = newFoods.map((f) => {
          if (manhattanDist(f, h) > 3 || samePos(f, h)) return f;
          const dx = h.x - f.x;
          const dy = h.y - f.y;
          const stepX = dx !== 0 ? (dx > 0 ? 1 : -1) : 0;
          const stepY = dy !== 0 ? (dy > 0 ? 1 : -1) : 0;
          const next = { x: f.x + stepX, y: f.y + stepY };
          if (!inBounds(next)) return f;
          const key = `${next.x},${next.y}`;
          if (occupied.has(key)) return f;
          occupied.add(key);
          return next;
        });
        // If magnet pulled a bead onto head, count as eaten
        const magnetEatenIndex = newFoods.findIndex((f) => samePos(f, h));
        if (magnetEatenIndex !== -1) {
          newFoods.splice(magnetEatenIndex, 1);
          const points = activeEffectsRef.current.some((e) => e.id === "double") ? 2 : 1;
          setScore((s) => {
            const next = s + points;
            const stored = parseInt(
              typeof window !== "undefined"
                ? window.localStorage.getItem(highScoreKey) ?? "0"
                : "0",
              10
            );
            if (next > stored) {
              window.localStorage.setItem(highScoreKey, String(next));
              setHighScore(next);
            }
            return next;
          });
          setLastCollectedBead(true);
          setCollectBurstPos(h);
          setTimeout(() => setLastCollectedBead(false), 200);
          setTimeout(() => setCollectBurstPos(null), 450);
          while (newFoods.length < (cfg.multiBeads)) {
            const extra = spawnFoods(newSnake.concat(newFoods), 1);
            if (extra.length > 0) newFoods.push(extra[0]);
            else break;
          }
        }
      }

      setFoods(newFoods);
      foodsRef.current = newFoods;
      snakeRef.current = newSnake;
      setSnake(newSnake);

      // Win: bracelet complete at 16 beads (segments)
      if (newSnake.length >= BRACELET_WIN_BEADS) {
        if (tickRef.current) clearInterval(tickRef.current);
        setGameWon(true);
      }
    };

    tickRef.current = setInterval(tick, effectiveSpeed);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [screen, mode, gameOver, gameWon, spawnFoods, spawnPowerUp, highScoreKey, lives, activeEffects]);

  // Power-up collection
  useEffect(() => {
    if (screen !== "game" || gameOver || !mode) return;
    const head = snake[0];
    if (!head) return;
    setPowerUps((prev) => {
      const collected = prev.filter((p) => samePos(p.pos, head));
      if (collected.length === 0) return prev;
      collected.forEach((p) => addEffect(p.id));
      const next = prev.filter((p) => !samePos(p.pos, head));
      powerUpsRef.current = next;
      return next;
    });
  }, [snake, screen, gameOver, mode, addEffect]);

  // Expire timed effects (expiresAt > 0 only; one-shot effects use 0 and are removed in game tick)
  useEffect(() => {
    if (screen !== "game") return;
    const t = setInterval(() => {
      const now = Date.now();
      setActiveEffects((prev) => {
        const next = prev.filter((e) => e.expiresAt === 0 || e.expiresAt > now);
        activeEffectsRef.current = next;
        return next;
      });
    }, 200);
    return () => clearInterval(t);
  }, [screen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(highScoreKey);
      if (stored) setHighScore(parseInt(stored, 10));
    }
  }, [highScoreKey]);

  useEffect(() => {
    if (screen !== "game" || gameOver) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setNextDirection((d) => (d !== "down" ? "up" : d));
          break;
        case "ArrowDown":
          e.preventDefault();
          setNextDirection((d) => (d !== "up" ? "down" : d));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setNextDirection((d) => (d !== "right" ? "left" : d));
          break;
        case "ArrowRight":
          e.preventDefault();
          setNextDirection((d) => (d !== "left" ? "right" : d));
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, gameOver]);

  // --- CHARACTER SELECT ---
  if (screen === "character") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-24 px-6 container mx-auto max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
              Wyldstone
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight mb-4">
              Collect the beads
            </h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto">
              Choose your spirit animal and slither to collect beads. Every bead you collect is a step toward impact—just don&apos;t bite your tail!
            </p>
            <motion.div
              className="grid grid-cols-2 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {},
              }}
            >
              {[
                { id: "turtle" as Character, name: "Talise", sub: "Turtle", emoji: "🐢", color: "emerald" },
                { id: "tiger" as Character, name: "Amur", sub: "Tiger", emoji: "🐯", color: "amber" },
              ].map((opt) => (
                <motion.button
                  key={opt.id}
                  type="button"
                  onClick={() => handleCharacterSelect(opt.id)}
                  className="flex flex-col items-center justify-center p-10 rounded-2xl border-2 border-border bg-card shadow-sm hover:border-accent hover:shadow-md hover:scale-[1.02] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={`Play as ${opt.sub} (${opt.name})`}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    className="text-6xl mb-4"
                    aria-hidden
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    {opt.emoji}
                  </motion.span>
                  <span className="font-serif font-bold text-xl text-foreground">{opt.name}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {opt.sub}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- MODE SELECT ---
  if (screen === "mode" && character) {
    const modeEmoji: Record<GameModeId, string> = {
      classic: "✨",
      zen: "🌿",
      rush: "⚡",
      conservation: "💚",
    };
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-24 px-6 container mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => setScreen("character")}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
            aria-label="Back to character select"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
            <span className="text-sm font-medium">Back</span>
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
              Choose your vibe
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight mb-2">
              Pick a mode
            </h1>
            <p className="text-muted-foreground mb-10">
              Playing as {character === "turtle" ? "Talise" : "Amur"} — slither for the cause!
            </p>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08 } },
                hidden: {},
              }}
            >
              {GAME_MODES.map((m) => (
                <motion.button
                  key={m.id}
                  type="button"
                  onClick={() => handleModeSelect(m)}
                  className="flex flex-col sm:flex-row items-center sm:justify-start gap-4 p-6 rounded-2xl border-2 border-border bg-card text-left hover:border-accent hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-4xl shrink-0" aria-hidden>
                    {modeEmoji[m.id]}
                  </span>
                  <div>
                    <span className="font-serif font-bold text-lg block">{m.name}</span>
                    <span className="text-sm text-muted-foreground">{m.tagline}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- GAME ---
  const snakeSet = new Set(snake.map((p) => `${p.x},${p.y}`));
  const foodSet = new Set(foods.map((p) => `${p.x},${p.y}`));
  const powerUpMap = new Map(powerUps.map((p) => [`${p.pos.x},${p.pos.y}`, p]));

  const effectLabels: Record<PowerUpId, string> = {
    double: "2×",
    shield: "Shield",
    magnet: "Magnet",
    slowmo: "Slow",
    beadrain: "Rain",
    extralife: "Life",
  };
  const effectIcons: Record<PowerUpId, React.ReactNode> = {
    double: <Zap className="h-3.5 w-3.5" aria-hidden />,
    shield: <Shield className="h-3.5 w-3.5" aria-hidden />,
    magnet: <Magnet className="h-3.5 w-3.5" aria-hidden />,
    slowmo: <Clock className="h-3.5 w-3.5" aria-hidden />,
    beadrain: <Sparkles className="h-3.5 w-3.5" aria-hidden />,
    extralife: <Heart className="h-3.5 w-3.5" aria-hidden />,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-6 flex flex-col items-center">
        <div className="w-full max-w-[400px] flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-3xl"
              aria-hidden
              animate={{ scale: lastCollectedBead ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {character === "turtle" ? "🐢" : "🐯"}
            </motion.span>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  Beads
                </span>
                <motion.span
                  key={score}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-xl font-serif font-black text-accent"
                >
                  {snake.length}/{BRACELET_WIN_BEADS}
                </motion.span>
              </div>
              <span className="text-xs text-muted-foreground">High: {highScore}</span>
            </div>
          </div>
          {lives > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Heart className="h-3 w-3" aria-hidden /> {lives}
            </span>
          )}
        </div>

        {/* Active effects bar */}
        {activeEffects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-2 mb-4"
          >
            {activeEffects.map((e) => (
              <span
                key={`${e.id}-${e.expiresAt}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-border"
              >
                {effectIcons[e.id]}
                {effectLabels[e.id]}
                {e.expiresAt > 0 && (
                  <span className="text-muted-foreground tabular-nums">
                    {Math.max(0, Math.ceil((e.expiresAt - Date.now()) / 1000))}s
                  </span>
                )}
              </span>
            ))}
          </motion.div>
        )}

        <motion.div
          className="rounded-2xl overflow-hidden border-2 border-border bg-gradient-to-br from-muted/50 to-muted/20 shadow-lg p-2 relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="grid rounded-xl overflow-hidden relative brace-game-grid-bg"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            }}
            role="img"
            aria-label="Snake game grid"
          >
            {/* Collect burst overlay */}
            <AnimatePresence>
              {collectBurstPos !== null && (
                <motion.div
                  key={`${collectBurstPos.x}-${collectBurstPos.y}`}
                  initial={{ opacity: 0.9, scale: 0.3 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute pointer-events-none rounded-full bg-accent/60 border-2 border-white/70"
                  style={{
                    width: CELL_SIZE * 1.2,
                    height: CELL_SIZE * 1.2,
                    left: collectBurstPos.x * CELL_SIZE + (CELL_SIZE * 0.5) - (CELL_SIZE * 0.6),
                    top: collectBurstPos.y * CELL_SIZE + (CELL_SIZE * 0.5) - (CELL_SIZE * 0.6),
                    boxShadow: "0 0 20px 8px hsl(var(--accent) / 0.6)",
                  }}
                  aria-hidden
                />
              )}
            </AnimatePresence>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const key = `${x},${y}`;
              const isSnake = snakeSet.has(key);
              const isHead = snake.length > 0 && samePos(snake[0], { x, y });
              const isBead = foodSet.has(key);
              const powerUp = powerUpMap.get(key);

              return (
                <div
                  key={key}
                  className="w-full h-full flex items-center justify-center relative"
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                >
                  {isBead && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-[18px] h-[18px] rounded-full bg-accent border-2 border-white/50 bead-glow"
                      aria-hidden
                    />
                  )}
                  {powerUp && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-primary"
                      aria-hidden
                    >
                      {effectIcons[powerUp.id]}
                    </motion.div>
                  )}
                  {isSnake && !powerUp && (
                    <motion.div
                      layout
                      className={`rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bead-segment ${
                        isHead
                          ? "w-[20px] h-[20px] bead-head"
                          : "w-[18px] h-[18px]"
                      } ${
                        isHead
                          ? character === "turtle"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                          : character === "turtle"
                            ? "bg-emerald-400/95"
                            : "bg-amber-400/95"
                      }`}
                      aria-hidden
                      animate={isHead ? { scale: [1, 1.06, 1] } : {}}
                      transition={{ duration: 0.35, repeat: Infinity, repeatDelay: 0.4 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <p className="text-xs text-muted-foreground mt-5 text-center max-w-[400px]">
          Use arrow keys to move. Collect glowing beads so they follow you—get {BRACELET_WIN_BEADS} to complete your bracelet! Power-ups help. Slither for the cause!
        </p>

        {/* Win modal: bracelet complete */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="win-title"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-background border-2 border-accent/50 rounded-2xl p-8 mx-4 text-center max-w-[550px] shadow-2xl"
              >
                <motion.p
                  id="win-title"
                  className="text-3xl font-serif font-black mb-2 text-accent"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  You made your bracelet!
                </motion.p>
                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Support{" "}
                  <a
                    href="https://wyldstone.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent font-bold underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    aria-label="Support wyldstone.ca (opens in new tab)"
                  >
                    wyldstone.ca
                  </a>{" "}
                  for this to make a change.
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => {
                      setGameWon(false);
                      startGame();
                    }}
                    className="rounded-full font-bold"
                    aria-label="Play again"
                  >
                    Play again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={goBackToMode}
                    className="rounded-full"
                    aria-label="Change mode"
                  >
                    Change mode
                  </Button>
                  <a
                    href="https://wyldstone.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                    aria-label="Visit wyldstone.ca"
                  >
                    <Button className="rounded-full w-full sm:w-auto">
                      Support wyldstone.ca
                    </Button>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gameOver && !gameWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-background border-2 border-border rounded-2xl p-8 mx-4 text-center max-w-[450px] shadow-2xl"
              >
                <p className="text-3xl font-serif font-black mb-2">Game over</p>
                <p className="text-muted-foreground mb-1">
                  {mode?.id === "conservation"
                    ? "Beads saved:"
                    : "Your score:"}{" "}
                  <span className="text-foreground font-bold text-xl">{score}</span>
                </p>
                {score >= highScore && score > 0 && (
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-accent font-bold text-sm mb-4"
                  >
                    🎉 New high score!
                  </motion.p>
                )}
                <p className="text-sm text-muted-foreground mb-6">
                  Every bead = impact. Thanks for playing for the cause!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => startGame()}
                    className="rounded-full font-bold"
                    aria-label="Play again"
                  >
                    Play again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={goBackToMode}
                    className="rounded-full"
                    aria-label="Change mode"
                  >
                    Change mode
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="rounded-full w-full sm:w-auto">
                      Back to home
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
