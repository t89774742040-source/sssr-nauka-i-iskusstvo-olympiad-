import { useLayoutEffect, useRef, useState } from "react";
import { displayWithoutFinalPeriod } from "./displayText";
import {
  oddPictureAnswersMatch,
  oddPictureTasks,
  PAVILION_AXIS_X,
  PAVILION_WINDOW_CY,
  PAVILION_WINDOW_H,
  PAVILION_WINDOW_OFFSETS,
  PAVILION_WINDOW_W,
  PENNANT_RADIUS,
  PENNANT_VARIANTS,
  ROCKET_AXIS_X,
  ROCKET_COMMON_YS,
  ROCKET_EXTRA_Y,
  ROCKET_PORTHOLE_R,
  ROCKET_PORTHOLES,
  pennantShape,
  type OddPictureTask,
} from "./oddPictureData";

type Outcome = "first" | "retry" | "revealed";

const emptyOutcomes = () => Array<Outcome | null>(oddPictureTasks.length).fill(null);
const OPTIONS = [1, 2, 3, 4, 5] as const;
const CHOOSE_LINE = "Выбери лишний рисунок";
const MARK = "#b74335";
const LINE = "#000000";

const scrollPracticeStart = (el: HTMLElement | null) => {
  if (!el) return;
  const header = document.querySelector("header");
  const headerH = header instanceof HTMLElement ? header.getBoundingClientRect().height : 72;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
  window.scrollTo({top: Math.max(0, top), behavior: "auto"});
};

function RocketOption({option, showMark}:{option: number; showMark: boolean}) {
  const count = ROCKET_PORTHOLES[option - 1] ?? 2;
  const ys = count === 3 ? [...ROCKET_COMMON_YS, ROCKET_EXTRA_Y] : [...ROCKET_COMMON_YS];
  return (
    <svg viewBox="150 25 300 470" role="img" aria-hidden="true" style={{display: "block", width: "100%", height: "auto"}}>
      <rect x="150" y="25" width="300" height="470" fill="white" />
      <g fill="none" stroke={LINE} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="300,45 230,180 370,180" />
        <polyline points="230,180 230,420 370,420 370,180" />
        <polygon points="230,330 165,480 230,480" />
        <polygon points="370,330 435,480 370,480" />
        <polyline points="255,420 240,460 360,460 345,420" />
      </g>
      {ys.map((y, holeIndex) => {
        const mark = showMark && holeIndex === 2;
        return (
          <circle
            key={y}
            cx={ROCKET_AXIS_X}
            cy={y}
            r={ROCKET_PORTHOLE_R}
            fill={mark ? MARK : "white"}
            fillOpacity={mark ? 0.28 : 1}
            stroke={mark ? MARK : LINE}
            strokeWidth={mark ? 6 : 4}
          />
        );
      })}
    </svg>
  );
}

function PennantOption({option, tipUp, showMark}:{option: number; tipUp: boolean; showMark: boolean}) {
  const stored = PENNANT_VARIANTS[option - 1] ?? PENNANT_VARIANTS[0];
  const variant = tipUp ? {reflect: stored.reflect, rotate: 0} : stored;
  const shape = pennantShape(variant);
  const triangle = shape.triangle.map(point => `${point.x},${point.y}`).join(" ");
  const mark = showMark;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-hidden="true" style={{display: "block", width: "100%", height: "auto"}}>
      <rect x="0" y="0" width="200" height="200" fill="white" />
      <polygon
        points={triangle}
        fill="none"
        stroke={mark ? MARK : LINE}
        strokeWidth={3}
        strokeLinejoin="miter"
      />
      <circle cx={shape.filled.x} cy={shape.filled.y} r={PENNANT_RADIUS} fill={LINE} stroke={LINE} strokeWidth={3} />
      <circle cx={shape.empty.x} cy={shape.empty.y} r={PENNANT_RADIUS} fill="white" stroke={mark ? MARK : LINE} strokeWidth={3} />
    </svg>
  );
}

function PavilionOption({option, showReview}:{option: number; showReview: boolean}) {
  const offsets = PAVILION_WINDOW_OFFSETS[option - 1] ?? PAVILION_WINDOW_OFFSETS[0];
  const markInner = showReview && option === 5;
  const leftInner = offsets[1] ?? 0;
  const rightInner = offsets[2] ?? 0;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-hidden="true" style={{display: "block", width: "100%", height: "auto"}}>
      <rect x="0" y="0" width="200" height="200" fill="white" />
      <g fill="none" stroke={LINE} strokeWidth={3} strokeLinecap="square" strokeLinejoin="miter">
        <rect x="20" y="105" width="160" height="60" />
        <rect x="15" y="95" width="170" height="10" />
        <rect x="70" y="60" width="60" height="35" />
        <rect x="90" y="40" width="20" height="20" />
        <polygon points="100,15 90,40 110,40" />
        {offsets.map((offset, windowIndex) => {
          const cx = PAVILION_AXIS_X + offset;
          const isInner = windowIndex === 1 || windowIndex === 2;
          const mark = markInner && isInner;
          return (
            <rect
              key={`${offset}-${windowIndex}`}
              x={cx - PAVILION_WINDOW_W / 2}
              y={PAVILION_WINDOW_CY - PAVILION_WINDOW_H / 2}
              width={PAVILION_WINDOW_W}
              height={PAVILION_WINDOW_H}
              fill={mark ? MARK : "white"}
              fillOpacity={mark ? 0.28 : 1}
              stroke={mark ? MARK : LINE}
              strokeWidth={mark ? 4 : 3}
            />
          );
        })}
      </g>
      {showReview && (
        <line
          x1={PAVILION_AXIS_X}
          y1="12"
          x2={PAVILION_AXIS_X}
          y2="168"
          stroke={MARK}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
      )}
      {markInner && (
        <g fill="none" stroke={MARK} strokeWidth={2} strokeLinecap="square">
          <line x1={PAVILION_AXIS_X + leftInner} y1="168" x2={PAVILION_AXIS_X} y2="168" />
          <line x1={PAVILION_AXIS_X + leftInner} y1="164" x2={PAVILION_AXIS_X + leftInner} y2="172" />
          <line x1={PAVILION_AXIS_X} y1="164" x2={PAVILION_AXIS_X} y2="172" />
          <line x1={PAVILION_AXIS_X} y1="176" x2={PAVILION_AXIS_X + rightInner} y2="176" />
          <line x1={PAVILION_AXIS_X + rightInner} y1="172" x2={PAVILION_AXIS_X + rightInner} y2="180" />
          <line x1={PAVILION_AXIS_X} y1="172" x2={PAVILION_AXIS_X} y2="180" />
        </g>
      )}
    </svg>
  );
}

function OptionPicture({
  task,
  option,
  resolved,
  tipUp,
}:{
  task: OddPictureTask;
  option: number;
  resolved: boolean;
  tipUp: boolean;
}) {
  if (task.kind === "rockets") return <RocketOption option={option} showMark={resolved && option === task.answer} />;
  if (task.kind === "pennants") return <PennantOption option={option} tipUp={tipUp} showMark={resolved && option === task.answer} />;
  return <PavilionOption option={option} showReview={resolved} />;
}

export default function OddPicturePractice({onBack}:{onBack:()=>void}) {
  const total = oddPictureTasks.length;
  const startRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resolved, setResolved] = useState<"correct" | "revealed" | null>(null);
  const [outcomes, setOutcomes] = useState<(Outcome | null)[]>(emptyOutcomes);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tipUp, setTipUp] = useState(false);
  const [done, setDone] = useState(false);
  const task = oddPictureTasks[index];

  useLayoutEffect(() => {
    scrollPracticeStart(startRef.current);
  }, [index, done]);

  const resetTask = (nextIndex: number) => {
    setIndex(nextIndex);
    setSelected(null);
    setFailed(false);
    setShowError(false);
    setResolved(null);
    setSearchOpen(false);
    setTipUp(false);
  };

  const restart = () => {
    setOutcomes(emptyOutcomes());
    setDone(false);
    resetTask(0);
  };

  const setOutcome = (outcome: Outcome) => {
    setOutcomes(prev => {
      const next = [...prev];
      next[index] = outcome;
      return next;
    });
  };

  const check = () => {
    if (resolved || selected === null || !task) return;
    if (oddPictureAnswersMatch(selected, task.answer)) {
      setOutcome(failed ? "retry" : "first");
      setResolved("correct");
      setShowError(false);
    } else {
      setFailed(true);
      setShowError(true);
    }
  };

  const reveal = () => {
    if (resolved) return;
    setOutcome("revealed");
    setResolved("revealed");
    setShowError(false);
  };

  const goNext = () => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    resetTask(index + 1);
  };

  if (done) {
    const first = outcomes.filter(item => item === "first").length;
    const retry = outcomes.filter(item => item === "retry").length;
    const revealed = outcomes.filter(item => item === "revealed").length;
    return (
      <main className="compact olympiad-shell">
        <section className="olympiad-cover">
          <button ref={startRef} type="button" className="olympiad-back olympiad-practice-start" onClick={onBack}>← К числам и изображениям</button>
          <span>ЧИСЛА И ИЗОБРАЖЕНИЯ</span>
          <h1>Лишний рисунок</h1>
          <p className="olympiad-lead">Тренировка завершена</p>
          <div className="olympiad-summary">
            <div><b>Решено с первой попытки</b><strong>{first}</strong></div>
            <div><b>Решено после исправления</b><strong>{retry}</strong></div>
            <div><b>Просмотрено решение</b><strong>{revealed}</strong></div>
          </div>
          <div className="olympiad-actions">
            <button type="button" className="primary" onClick={restart}>Повторить тренировку</button>
            <button type="button" className="secondary" onClick={onBack}>К числам и изображениям</button>
          </div>
        </section>
      </main>
    );
  }

  if (!task) return null;

  const open = resolved === null;
  const showTipUp = task.kind === "pennants" && resolved !== null && tipUp;

  return (
    <main className="compact olympiad-shell">
      <section className="olympiad-cover">
        <button ref={startRef} type="button" className="olympiad-back olympiad-practice-start" onClick={onBack}>← К числам и изображениям</button>
        <span>ЧИСЛА И ИЗОБРАЖЕНИЯ</span>
        <h1>Лишний рисунок</h1>
        <div className="olympiad-progress">
          <span>Задание {index + 1} из {total}</span>
          <div><i style={{width: `${((index + 1) / total) * 100}%`}} /></div>
        </div>
        <p className="olympiad-lead olympiad-instruction">
          <span>{displayWithoutFinalPeriod(task.prompt)}</span>
          <span>{displayWithoutFinalPeriod(CHOOSE_LINE)}</span>
          {task.note && <span>{displayWithoutFinalPeriod(task.note)}</span>}
        </p>
        {resolved && (
          <div className="olympiad-solution">
            <p><b>Разбор решения</b></p>
            <p className="olympiad-answer">Ответ: рисунок №<span className="olympiad-num-item">{task.answer}</span></p>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            width: "100%",
            margin: "0 0 8px",
          }}
        >
          {OPTIONS.map(option => {
            const isSelected = selected === option;
            const isAnswer = resolved !== null && option === task.answer;
            const markInner = resolved !== null && task.kind === "pavilions" && option === 5;
            return (
              <button
                key={option}
                type="button"
                aria-label={`Рисунок ${option}`}
                aria-pressed={isSelected}
                onClick={() => {
                  if (resolved) return;
                  setSelected(option);
                  setShowError(false);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 8,
                  flex: "0 1 148px",
                  width: 148,
                  maxWidth: "100%",
                  minWidth: 0,
                  margin: 0,
                  padding: 10,
                  background: "#fffaf0",
                  color: "#263d3b",
                  font: "inherit",
                  textAlign: "center",
                  cursor: resolved ? "default" : "pointer",
                  boxSizing: "border-box",
                  border: isAnswer ? `3px solid ${MARK}` : isSelected ? "4px solid #263d3b" : "2px solid #263d3b",
                  boxShadow: isSelected && open ? "3px 3px 0 #263d3b" : "none",
                }}
              >
                <OptionPicture task={task} option={option} resolved={resolved !== null} tipUp={showTipUp} />
                <span className="olympiad-num-item">{option}</span>
                {isSelected && open && <span>Выбрано</span>}
                {markInner && (
                  <span>
                    <span className="olympiad-num-item">20</span>
                    {" и "}
                    <span className="olympiad-num-item">30</span>
                    {" «Разные расстояния до середины»"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {open && (
          <>
            {showError && <p className="olympiad-error"><span>Подумай ещё</span></p>}
            <div className="olympiad-actions">
              <button type="button" className="primary" disabled={selected === null} onClick={check}>Проверить</button>
              <button type="button" className="secondary" onClick={reveal}>Показать решение</button>
            </div>
          </>
        )}
        {resolved && (
          <div className="olympiad-solution">
            <p className="olympiad-num-caption">Как решить</p>
            {task.explainLines.map(line => (
              <p key={line}>{displayWithoutFinalPeriod(line)}</p>
            ))}
            {task.kind === "pennants" && (
              <button
                type="button"
                className="olympiad-alpha-search-toggle"
                aria-pressed={tipUp}
                onClick={() => setTipUp(openTip => !openTip)}
              >
                {tipUp ? "Вернуть исходные повороты" : "Сравнить остриём вверх"}
              </button>
            )}
            <button
              type="button"
              className="olympiad-alpha-search-toggle"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(openSearch => !openSearch)}
            >
              Как искать ответ
            </button>
            {searchOpen && (
              <div className="olympiad-alpha-search">
                {task.searchLines.map(line => (
                  <p key={line}>{displayWithoutFinalPeriod(line)}</p>
                ))}
              </div>
            )}
            <div className="olympiad-actions">
              <button type="button" className="primary" onClick={goNext}>{index + 1 === total ? "Результат" : "Следующее задание"}</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
