import { ChevronRight, Shield, Trophy, Users, Zap } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onPlay: () => void;
}

const topClaimers = [
  { name: "NEONHAWK", pct: 34, color: "#00D6FF" },
  { name: "PHANTOMX", pct: 28, color: "#FF3FD1" },
  { name: "GRID_GOD", pct: 21, color: "#37FF6B" },
  { name: "VOLT_RUN", pct: 17, color: "#FF8C00" },
];

const howItWorks = [
  {
    icon: <Zap size={32} />,
    title: "RUN & CLAIM",
    desc: "Sprint across the grid to paint territory in your color. Every cell you touch is yours.",
  },
  {
    icon: <Shield size={32} />,
    title: "TRAP RIVALS",
    desc: "Cut off opponents' paths. Steal their cells by running over them. Leave no escape route.",
  },
  {
    icon: <Trophy size={32} />,
    title: "DOMINATE",
    desc: "Hold the most territory when the timer runs out. The grid belongs to the boldest.",
  },
];

export function LandingPage({ onPlay }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-game-bg text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-game-bg/90 backdrop-blur-md border-b border-game-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="font-orbitron font-black text-xl text-glow-cyan"
            style={{ color: "#00D6FF" }}
          >
            GLOW<span style={{ color: "#FF3FD1" }}>GRID</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {["HOME", "PLAY NOW", "LEADERBOARD", "COMMUNITY", "STORE"].map(
              (item) => (
                <button
                  type="button"
                  key={item}
                  onClick={item === "PLAY NOW" ? onPlay : undefined}
                  className="font-orbitron text-xs font-semibold tracking-widest text-gray-400 hover:text-white transition-colors"
                  data-ocid={`nav.${item.toLowerCase().replace(" ", "_")}.link`}
                >
                  {item}
                </button>
              ),
            )}
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="font-orbitron text-xs font-semibold tracking-widest text-gray-400 hover:text-white transition-colors"
              data-ocid="nav.login.link"
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={onPlay}
              className="btn-cta text-sm"
              data-ocid="nav.start_playing.button"
            >
              START PLAYING
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-glowgrid.dim_1920x900.jpg"
            alt="GlowGrid Arena"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-game-bg via-game-bg/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-game-bg via-transparent to-game-bg/60" />
          <div className="absolute inset-0 scanlines" />
          <div className="absolute inset-0 grid-overlay" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="flex flex-col lg:flex-row items-start gap-12 justify-between">
            {/* Left: Hero copy */}
            <motion.div
              className="flex-1 max-w-2xl"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div
                className="font-orbitron text-xs font-semibold tracking-[0.3em] mb-4 animate-flicker"
                style={{ color: "#00D6FF" }}
              >
                ◆ ONLINE TERRITORY BATTLE ◆
              </div>
              <h1 className="font-orbitron font-black text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6 uppercase">
                CLAIM YOUR
                <br />
                DOMAIN IN THE{" "}
                <span className="text-glow-cyan" style={{ color: "#00D6FF" }}>
                  GLOW
                </span>
                <span
                  className="text-glow-magenta"
                  style={{ color: "#FF3FD1" }}
                >
                  GRID
                </span>
                <span style={{ color: "#FF3FD1" }}>!</span>
              </h1>
              <p className="font-rajdhani text-xl text-gray-300 font-medium tracking-wide mb-10">
                Vibrant. Fast. Competitive Territory Capture.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={onPlay}
                  className="btn-cta text-base"
                  data-ocid="hero.play_now.primary_button"
                >
                  PLAY NOW <ChevronRight className="inline" size={16} />
                </button>
                <button
                  type="button"
                  className="btn-outline-cyan text-sm"
                  data-ocid="hero.learn_more.secondary_button"
                >
                  HOW IT WORKS
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { label: "ACTIVE PLAYERS", value: "12,847" },
                  { label: "ARENAS LIVE", value: "234" },
                  { label: "TERRITORIES WON", value: "1.2M" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      className="font-orbitron font-bold text-2xl"
                      style={{ color: "#00D6FF" }}
                    >
                      {s.value}
                    </div>
                    <div className="font-rajdhani text-xs text-gray-500 tracking-widest mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Live leaderboard card */}
            <motion.div
              className="w-full lg:w-80 flex-shrink-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <div
                className="neon-border-cyan rounded-sm p-5"
                style={{
                  background: "rgba(27,35,48,0.85)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="font-orbitron text-xs font-bold tracking-widest"
                    style={{ color: "#00D6FF" }}
                  >
                    TOP CLAIMERS
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: "#37FF6B" }}
                    />
                    <span
                      className="font-orbitron text-xs"
                      style={{ color: "#37FF6B" }}
                    >
                      LIVE
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {topClaimers.map((player, i) => (
                    <div
                      key={player.name}
                      className="flex items-center gap-3"
                      data-ocid={`leaderboard.item.${i + 1}`}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-orbitron text-xs font-black"
                        style={{
                          background: `${player.color}22`,
                          border: `1px solid ${player.color}`,
                          color: player.color,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-orbitron text-xs font-bold text-white mb-1">
                          {player.name}
                        </div>
                        <div className="h-1.5 rounded-full bg-game-border overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${player.pct}%`,
                              background: player.color,
                              boxShadow: `0 0 6px ${player.color}`,
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="font-orbitron text-xs font-bold"
                        style={{ color: player.color }}
                      >
                        {player.pct}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match HUD strip */}
              <div
                className="mt-3 rounded-sm px-4 py-2.5 flex items-center justify-between text-xs font-orbitron"
                style={{
                  background: "rgba(0,214,255,0.08)",
                  border: "1px solid rgba(0,214,255,0.2)",
                }}
              >
                <span className="text-gray-400">Arena Alpha</span>
                <span style={{ color: "#00D6FF" }}>08:34</span>
                <div className="flex items-center gap-1">
                  <Users size={10} className="text-gray-400" />
                  <span className="text-gray-400">18/24</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative" id="how-it-works">
        <div className="absolute inset-0 grid-overlay" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="font-orbitron text-xs tracking-[0.4em] mb-3 text-gray-500">
              MECHANICS
            </div>
            <h2 className="font-orbitron font-black text-4xl text-white">
              HOW IT{" "}
              <span className="text-glow-cyan" style={{ color: "#00D6FF" }}>
                WORKS
              </span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="group relative rounded-sm p-8 text-center"
                style={{
                  background: "rgba(27,35,48,0.6)",
                  border: "1px solid rgba(0,214,255,0.15)",
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-sm mb-6 mx-auto transition-all group-hover:scale-110"
                  style={{
                    background: "rgba(0,214,255,0.1)",
                    border: "1px solid rgba(0,214,255,0.4)",
                    color: "#00D6FF",
                  }}
                >
                  {item.icon}
                </div>
                <div className="font-orbitron font-bold text-sm tracking-widest text-white mb-3">
                  {item.title}
                </div>
                <p className="font-rajdhani text-gray-400 text-base leading-relaxed">
                  {item.desc}
                </p>
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #00D6FF, transparent)",
                  }}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button
              type="button"
              onClick={onPlay}
              className="btn-cta text-base"
              data-ocid="howitworks.play.primary_button"
            >
              ENTER THE ARENA
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-game-border py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div
            className="font-orbitron font-black text-2xl text-glow-cyan mb-4 animate-flicker"
            style={{ color: "#00D6FF" }}
          >
            GLOW<span style={{ color: "#FF3FD1" }}>GRID</span>
          </div>
          <div className="flex justify-center gap-8 mb-6">
            {["About", "Privacy", "Terms", "Support"].map((l) => (
              <span
                key={l}
                className="font-rajdhani text-sm text-gray-500 hover:text-gray-300 transition-colors tracking-wide cursor-pointer"
              >
                {l}
              </span>
            ))}
          </div>
          <p className="font-rajdhani text-sm text-gray-600">
            &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="text-gray-500 hover:text-gray-300 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
