import { useLayoutEffect, useRef, useState } from "react";
import { displayWithoutFinalPeriod } from "./displayText";
import {
  figureCountAnswersMatch,
  figureCountTasks,
  type FigureCountTask,
  type FigureShape,
} from "./figureCountData";

type Outcome = "first" | "retry" | "revealed";

const emptyOutcomes = () => Array<Outcome | null>(figureCountTasks.length).fill(null);
const PAD = 18;

const scrollPracticeStart = (el: HTMLElement | null) => {
  if (!el) return;
  const header = document.querySelector("header");
  const headerH = header instanceof HTMLElement ? header.getBoundingClientRect().height : 72;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
  window.scrollTo({top: Math.max(0, top), behavior: "auto"});
};

const pointsAttr = (figure: FigureShape) => figure.points.map(point => `${point.x},${point.y}`).join(" ");

function RocketSvg({highlight, style}:{highlight: FigureShape | null; style: FigureCountTask["highlightStyle"]}) {
  return (
    <svg
      className="olympiad-rocket-svg"
      viewBox="0 0 600 600"
      overflow="visible"
      role="img"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="600" height="600" fill="white" />
      {highlight && style && (
        <polygon
          points={pointsAttr(highlight)}
          fill={style.fill}
          fillOpacity={style.fillOpacity}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          strokeLinejoin="round"
          pointerEvents="none"
        />
      )}
      <g fill="none" stroke="#202020" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="300,45 230,180 370,180" />
        <polyline points="230,180 230,420 370,420 370,180" />
        <line x1="230" y1="270" x2="370" y2="270" />
        <line x1="230" y1="340" x2="370" y2="340" />
        <polygon points="265,210 335,210 335,245 265,245" />
        <polygon points="230,330 165,480 230,480" />
        <polygon points="370,330 435,480 370,480" />
        <polyline points="255,420 240,460 360,460 345,420" />
        <polygon points="125,480 475,480 475,505 125,505" />
        <polyline points="155,505 155,550 445,550 445,505" />
        <line x1="225" y1="505" x2="225" y2="550" />
        <line x1="375" y1="505" x2="375" y2="550" />
      </g>
    </svg>
  );
}

function PavilionSvg({highlight, style}:{highlight: FigureShape | null; style: FigureCountTask["highlightStyle"]}) {
  return (
    <svg
      viewBox="0 0 540 450"
      overflow="visible"
      role="img"
      aria-hidden="true"
      style={{display: "block", width: "100%", height: "auto"}}
    >
      <rect x="0" y="0" width="540" height="450" fill="white" />
      {highlight && style && (
        <polygon
          points={pointsAttr(highlight)}
          fill={style.fill}
          fillOpacity={style.fillOpacity}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          strokeLinejoin="miter"
          pointerEvents="none"
        />
      )}
      <g fill="none" stroke="#000000" strokeWidth={3} strokeLinecap="square" strokeLinejoin="miter">
        <rect x="100" y="400" width="340" height="25" />
        <rect x="100" y="230" width="340" height="30" />
        <rect x="220" y="160" width="100" height="70" />
        <rect x="250" y="115" width="40" height="45" />
        <line x1="140" y1="260" x2="140" y2="400" />
        <line x1="160" y1="260" x2="160" y2="400" />
        <line x1="220" y1="260" x2="220" y2="400" />
        <line x1="240" y1="260" x2="240" y2="400" />
        <line x1="300" y1="260" x2="300" y2="400" />
        <line x1="320" y1="260" x2="320" y2="400" />
        <line x1="380" y1="260" x2="380" y2="400" />
        <line x1="400" y1="260" x2="400" y2="400" />
        <polyline points="250,115 270,55 290,115" />
        <polygon points="270,24 274,35 286,35 276,42 280,54 270,47 260,54 264,42 254,35 266,35" />
      </g>
    </svg>
  );
}

function PennantSvg({highlight, style}:{highlight: FigureShape | null; style: FigureCountTask["highlightStyle"]}) {
  return (
    <svg
      viewBox="0 0 480 460"
      overflow="visible"
      role="img"
      aria-hidden="true"
      style={{display: "block", width: "100%", height: "auto"}}
    >
      <rect x="0" y="0" width="480" height="460" fill="white" />
      {highlight && style && (
        <polygon
          points={pointsAttr(highlight)}
          fill={style.fill}
          fillOpacity={style.fillOpacity}
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
          strokeLinejoin="miter"
          pointerEvents="none"
        />
      )}
      <g fill="none" stroke="#000000" strokeWidth={3} strokeLinecap="square" strokeLinejoin="miter">
        <polygon points="100,100 380,100 240,420" />
        <line x1="170" y1="260" x2="310" y2="260" />
        <line x1="240" y1="100" x2="240" y2="420" />
        <line x1="80" y1="60" x2="400" y2="60" />
        <line x1="100" y1="60" x2="100" y2="100" />
        <line x1="380" y1="60" x2="380" y2="100" />
      </g>
    </svg>
  );
}

function GridSvg({task, highlight}:{task: FigureCountTask; highlight: FigureShape | null}) {
  return (
    <svg
      className="olympiad-figure-svg"
      viewBox={`${-PAD} ${-PAD} ${task.width + PAD * 2} ${task.height + PAD * 2}`}
      overflow="visible"
      role="img"
      aria-hidden="true"
    >
      {highlight && (
        <polygon
          className="olympiad-figure-hit"
          points={pointsAttr(highlight)}
        />
      )}
      {task.verticals.map(x => (
        <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={task.height} fill="none" stroke="#285670" strokeWidth={5} strokeLinecap="square" />
      ))}
      {task.horizontals.map(y => (
        <line key={`h-${y}`} x1={0} y1={y} x2={task.width} y2={y} fill="none" stroke="#285670" strokeWidth={5} strokeLinecap="square" />
      ))}
      {task.diagonals.map(([start, end], diagIndex) => (
        <line key={`d-${diagIndex}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} fill="none" stroke="#285670" strokeWidth={5} strokeLinecap="square" />
      ))}
    </svg>
  );
}

function FigureSvg({task, highlight}:{task: FigureCountTask; highlight: FigureShape | null}) {
  if (task.drawing === "rocket") return <RocketSvg highlight={highlight} style={task.highlightStyle} />;
  if (task.drawing === "pavilion") return <PavilionSvg highlight={highlight} style={task.highlightStyle} />;
  if (task.drawing === "pennant") return <PennantSvg highlight={highlight} style={task.highlightStyle} />;
  return <GridSvg task={task} highlight={highlight} />;
}

function FigureNav({
  title,
  figure,
  onPrev,
  onNext,
}:{
  title: string;
  figure: FigureShape;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <p className="olympiad-figure-caption">
        <span className="olympiad-num-item">{title}</span>
        <span className="olympiad-num-item">{displayWithoutFinalPeriod(figure.label)}</span>
      </p>
      <div className="olympiad-actions">
        <button type="button" className="secondary" onClick={onPrev}>Предыдущая фигура</button>
        <button type="button" className="secondary" onClick={onNext}>Следующая фигура</button>
      </div>
    </>
  );
}

export default function FigureCountPractice({onBack}:{onBack:()=>void}) {
  const total = figureCountTasks.length;
  const startRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [failed, setFailed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resolved, setResolved] = useState<"correct" | "revealed" | null>(null);
  const [outcomes, setOutcomes] = useState<(Outcome | null)[]>(emptyOutcomes);
  const [searchOpen, setSearchOpen] = useState(false);
  const [figureIndex, setFigureIndex] = useState(0);
  const [done, setDone] = useState(false);
  const task = figureCountTasks[index];

  useLayoutEffect(() => {
    scrollPracticeStart(startRef.current);
  }, [index, done]);

  const resetTask = (nextIndex: number) => {
    setIndex(nextIndex);
    setValue("");
    setFailed(false);
    setShowError(false);
    setResolved(null);
    setSearchOpen(false);
    setFigureIndex(0);
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
    if (resolved || value.trim() === "") return;
    if (figureCountAnswersMatch(value, task.answer)) {
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
          <h1>Сколько фигур</h1>
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

  const open = resolved === null;
  const isRocket = task.drawing === "rocket";
  const isPavilion = task.drawing === "pavilion";
  const isPennant = task.drawing === "pennant";
  const isInteractive = isRocket || isPavilion || isPennant;
  const isReviewed = isPavilion || isPennant;
  const figures = task.figures;
  const currentFigure = figures[figureIndex] ?? null;
  const figureCount = figures.length;
  const frameClass = isInteractive ? "olympiad-figure-rocket" : "olympiad-figure-frame";
  const goPrevFigure = () => setFigureIndex(prev => (prev - 1 + figureCount) % figureCount);
  const goNextFigure = () => setFigureIndex(prev => (prev + 1) % figureCount);
  const navTitle = task.counterKind === "rectangle"
    ? `Показываем прямоугольник ${figureIndex + 1} из ${figureCount}`
    : task.counterKind === "triangle"
      ? `Показываем треугольник ${figureIndex + 1} из ${figureCount}`
      : `Фигура ${figureIndex + 1} из ${figureCount}`;
  const frameStyle = isPavilion
    ? {width: 400, maxWidth: "100%"}
    : isPennant
      ? {width: 360, maxWidth: "100%"}
      : undefined;

  return (
    <main className="compact olympiad-shell">
      <section className="olympiad-cover">
        <button ref={startRef} type="button" className="olympiad-back olympiad-practice-start" onClick={onBack}>← К числам и изображениям</button>
        <span>ЧИСЛА И ИЗОБРАЖЕНИЯ</span>
        <h1>Сколько фигур</h1>
        <div className="olympiad-progress">
          <span>Задание {index + 1} из {total}</span>
          <div><i style={{width: `${((index + 1) / total) * 100}%`}} /></div>
        </div>
        <p className="olympiad-lead olympiad-instruction">
          <span>{displayWithoutFinalPeriod(task.prompt)}</span>
          {task.note && <span>{displayWithoutFinalPeriod(task.note)}</span>}
        </p>
        {isReviewed && resolved && (
          <div className="olympiad-solution">
            <p><b>{displayWithoutFinalPeriod(task.reviewHeading ?? "Разбор решения")}</b></p>
          </div>
        )}
        <div className={frameClass} style={frameStyle}>
          <FigureSvg task={task} highlight={isInteractive && resolved && currentFigure ? currentFigure : null} />
        </div>
        {isRocket && resolved && currentFigure && (
          <FigureNav
            title={navTitle}
            figure={currentFigure}
            onPrev={goPrevFigure}
            onNext={goNextFigure}
          />
        )}
        {isReviewed && resolved && currentFigure && (
          <div className="olympiad-solution">
            {task.reviewLead && <p>{displayWithoutFinalPeriod(task.reviewLead)}</p>}
            <FigureNav
              title={navTitle}
              figure={currentFigure}
              onPrev={goPrevFigure}
              onNext={goNextFigure}
            />
          </div>
        )}
        {open && (
          <>
            <label className="olympiad-label" htmlFor="olympiad-figure-count-answer">Количество фигур</label>
            <input
              id="olympiad-figure-count-answer"
              className="olympiad-field olympiad-num-field"
              autoComplete="off"
              inputMode="numeric"
              value={value}
              onChange={e => { setValue(e.target.value); setShowError(false); }}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); check(); } }}
            />
            {showError && <p className="olympiad-error"><span>Пока не получилось</span><span>Попробуй ещё</span></p>}
            <div className="olympiad-actions">
              <button type="button" className="primary" disabled={value.trim() === ""} onClick={check}>Проверить</button>
              <button type="button" className="secondary" onClick={reveal}>Показать решение</button>
            </div>
          </>
        )}
        {resolved && currentFigure && (
          <div className="olympiad-solution">
            <p><b>{resolved === "correct" ? "Верно" : "Решение открыто"}</b></p>
            <p className="olympiad-answer">Ответ: <span className="olympiad-num-item">{task.answer}</span></p>
            {isInteractive && <p className="olympiad-num-caption">Как решить</p>}
            {task.explainLines.map(line => (
              <p key={line}>{displayWithoutFinalPeriod(line)}</p>
            ))}
            {!isInteractive && (
              <>
                <div className="olympiad-figure-frame">
                  <FigureSvg task={task} highlight={currentFigure} />
                </div>
                <FigureNav
                  title={navTitle}
                  figure={currentFigure}
                  onPrev={goPrevFigure}
                  onNext={goNextFigure}
                />
              </>
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
