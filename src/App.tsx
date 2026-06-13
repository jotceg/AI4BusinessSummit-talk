import { useEffect, useMemo, useRef, useState } from "react";
import {
  type Participant,
  ratePerSecond,
  totalCost,
  burnPerMinute,
  formatPLN,
  formatClock,
} from "./lib/cost";
import { getVerdict } from "./lib/verdict";

let nextId = 100;
const uid = () => String(nextId++);

const PRESETS: { label: string; rate: number }[] = [
  { label: "Junior", rate: 90 },
  { label: "Mid", rate: 130 },
  { label: "Senior", rate: 180 },
  { label: "Manager", rate: 220 },
  { label: "C-level", rate: 400 },
];

const INITIAL: Participant[] = [
  { id: "1", name: "Senior", ratePerHour: 180 },
  { id: "2", name: "Manager", ratePerHour: 220 },
  { id: "3", name: "C-level", ratePerHour: 400 },
];

type Status = "idle" | "running" | "paused";

export function App() {
  const [participants, setParticipants] = useState<Participant[]>(INITIAL);
  const [elapsed, setElapsed] = useState(0); // sekundy (float)
  const [status, setStatus] = useState<Status>("idle");
  const lastTick = useRef<number | null>(null);

  // Pętla zegara — liczona z realnych znaczników czasu, więc nie dryfuje.
  useEffect(() => {
    if (status !== "running") {
      lastTick.current = null;
      return;
    }
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      if (lastTick.current != null) {
        setElapsed((e) => e + (now - lastTick.current!) / 1000);
      }
      lastTick.current = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [status]);

  const cost = totalCost(elapsed, participants);
  const perSec = ratePerSecond(participants);
  const perMin = burnPerMinute(participants);
  const totalPerHour = participants.reduce((s, p) => s + Math.max(0, p.ratePerHour), 0);
  const verdict = useMemo(() => getVerdict(cost), [cost]);

  const tier: "calm" | "warn" | "alarm" =
    cost < 300 ? "calm" : cost < 1500 ? "warn" : "alarm";

  function addPreset(p: { label: string; rate: number }) {
    setParticipants((list) => [...list, { id: uid(), name: p.label, ratePerHour: p.rate }]);
  }
  function removeParticipant(id: string) {
    setParticipants((list) => list.filter((p) => p.id !== id));
  }
  function updateRate(id: string, rate: number) {
    setParticipants((list) =>
      list.map((p) => (p.id === id ? { ...p, ratePerHour: rate } : p))
    );
  }
  function updateName(id: string, name: string) {
    setParticipants((list) => list.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  function start() {
    if (participants.length === 0) return;
    setStatus("running");
  }
  function pause() {
    setStatus("paused");
  }
  function reset() {
    setStatus("idle");
    setElapsed(0);
  }

  return (
    <div className={`app tier-${tier}`}>
      <header className="topbar">
        <div className="brand">
          <span className="dot" aria-hidden />
          Spotkaniomierz
        </div>
        <div className={`status status-${status}`}>
          {status === "running" ? "Licznik bije" : status === "paused" ? "Wstrzymane" : "Gotowe"}
        </div>
      </header>

      <main className="stage">
        <section className="meter" aria-live="off">
          <div className="meter-label">Koszt tego spotkania</div>
          <div className="meter-value" key={tier}>
            {formatPLN(cost)}
          </div>
          <div className="burnbar" aria-hidden>
            <div
              className="burnfill"
              style={{ width: `${Math.min(100, (cost / 3000) * 100)}%` }}
            />
          </div>

          <div className="stats">
            <Stat label="Czas" value={formatClock(elapsed)} />
            <Stat label="Spalanie" value={`${formatPLN(perMin)}/min`} />
            <Stat label="Osób" value={String(participants.length)} />
            <Stat label="Stawka" value={`${formatPLN(totalPerHour)}/h`} />
          </div>
        </section>

        <section className="verdict">
          <div className="verdict-emoji">{verdict.emoji}</div>
          <div className="verdict-body">
            <div className="verdict-title">{verdict.title}</div>
            <div className="verdict-msg">{verdict.message}</div>
          </div>
        </section>

        <section className="people">
          <div className="people-head">
            <h2>Uczestnicy</h2>
            <div className="rate-hint">{formatPLN(perSec)}/s łącznie</div>
          </div>

          <ul className="people-list">
            {participants.map((p) => (
              <li key={p.id} className="person">
                <input
                  className="person-name"
                  value={p.name}
                  onChange={(e) => updateName(p.id, e.target.value)}
                  aria-label="Imię / rola"
                />
                <div className="rate-input">
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={p.ratePerHour}
                    onChange={(e) => updateRate(p.id, Number(e.target.value))}
                    aria-label="Stawka na godzinę"
                  />
                  <span>zł/h</span>
                </div>
                <button
                  className="ghost"
                  onClick={() => removeParticipant(p.id)}
                  aria-label={`Usuń ${p.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className="presets">
            {PRESETS.map((p) => (
              <button key={p.label} className="chip" onClick={() => addPreset(p)}>
                + {p.label} <span className="chip-rate">{p.rate} zł/h</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="controls">
        {status !== "running" ? (
          <button className="primary" onClick={start} disabled={participants.length === 0}>
            {status === "paused" ? "Wznów" : "Start"}
          </button>
        ) : (
          <button className="primary" onClick={pause}>
            Pauza
          </button>
        )}
        <button className="secondary" onClick={reset}>
          Reset
        </button>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
