import { useLayoutEffect, useRef, useState } from "react";
import { displayWithoutFinalPeriod } from "./displayText";
import {
  letterSeriesAnswersMatch,
  letterSeriesSearchCommon,
  letterSeriesTasks,
  seriesPromptParts,
  type LetterSeriesKind,
} from "./letterSeriesData";

const howToRule: Record<LetterSeriesKind, string> = {
  "first-to-end": "На каждом шаге первую букву переносим в конец",
  "last-to-start": "На каждом шаге последнюю букву переносим в начало",
  "first-two-to-end": "На каждом шаге первые две буквы переносим в конец, сохраняя их порядок",
};

const explainStep = (word: string, kind: LetterSeriesKind) => {
  if (kind === "last-to-start") {
    const move = word.slice(-1);
    const rest = word.slice(0, -1);
    return [
      {text: rest},
      {text: "|"},
      {text: move, move: true},
      {text: "→"},
      {text: move, move: true},
      {text: "|"},
      {text: rest},
    ];
  }
  const count = kind === "first-two-to-end" ? 2 : 1;
  const move = word.slice(0, count);
  const rest = word.slice(count);
  return [
    {text: move, move: true},
    {text: "|"},
    {text: rest},
    {text: "→"},
    {text: rest},
    {text: "|"},
    {text: move, move: true},
  ];
};

type Outcome = "first" | "retry" | "revealed";

const emptyOutcomes = () => Array<Outcome | null>(letterSeriesTasks.length).fill(null);

const scrollPracticeStart = (el: HTMLElement | null) => {
  if (!el) return;
  const header = document.querySelector("header");
  const headerH = header instanceof HTMLElement ? header.getBoundingClientRect().height : 72;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
  window.scrollTo({top: Math.max(0, top), behavior: "auto"});
};

export default function LetterSeriesPractice({onBack}:{onBack:()=>void}) {
  const total = letterSeriesTasks.length;
  const startRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [failed, setFailed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resolved, setResolved] = useState<"correct" | "revealed" | null>(null);
  const [outcomes, setOutcomes] = useState<(Outcome | null)[]>(emptyOutcomes);
  const [searchOpen, setSearchOpen] = useState(false);
  const [done, setDone] = useState(false);
  const task = letterSeriesTasks[index];

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
    if (letterSeriesAnswersMatch(value, task.answer)) {
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
          <button ref={startRef} type="button" className="olympiad-back olympiad-practice-start" onClick={onBack}>← К словесной логике</button>
          <span>СЛОВЕСНАЯ ЛОГИКА</span>
          <h1>Буквенные ряды</h1>
          <p className="olympiad-lead">Тренировка завершена</p>
          <div className="olympiad-summary">
            <div><b>Решено с первой попытки</b><strong>{first}</strong></div>
            <div><b>Решено после исправления</b><strong>{retry}</strong></div>
            <div><b>Просмотрено решение</b><strong>{revealed}</strong></div>
          </div>
          <div className="olympiad-actions">
            <button type="button" className="primary" onClick={restart}>Повторить тренировку</button>
            <button type="button" className="secondary" onClick={onBack}>К словесной логике</button>
          </div>
        </section>
      </main>
    );
  }

  const open = resolved === null;

  return (
    <main className="compact olympiad-shell">
      <section className="olympiad-cover">
        <button ref={startRef} type="button" className="olympiad-back olympiad-practice-start" onClick={onBack}>← К словесной логике</button>
        <span>СЛОВЕСНАЯ ЛОГИКА</span>
        <h1>Буквенные ряды</h1>
        <div className="olympiad-progress">
          <span>Задание {index + 1} из {total}</span>
          <div><i style={{width: `${((index + 1) / total) * 100}%`}} /></div>
        </div>
        <p className="olympiad-lead olympiad-instruction">
          <span>Какое сочетание букв следующее?</span>
          <span>Найди правило перестановки и продолжи ряд</span>
          <span>Ответ может не быть настоящим словом</span>
        </p>
        <p className="olympiad-series" aria-label={seriesPromptParts(task.given).join(" ")}>
          {seriesPromptParts(task.given).map((part, partIndex) => (
            <span key={`${part}-${partIndex}`}>{part}</span>
          ))}
        </p>
        {open && (
          <>
            <label className="olympiad-label" htmlFor="olympiad-letter-series-answer">Следующее сочетание букв</label>
            <input
              id="olympiad-letter-series-answer"
              className="olympiad-field"
              autoComplete="off"
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
        {resolved && (
          <div className="olympiad-solution">
            <p><b>{resolved === "correct" ? "Верно" : "Решение открыто"}</b></p>
            <p><b>Как решить</b></p>
            <p>{displayWithoutFinalPeriod(howToRule[task.kind])}</p>
            <div className="olympiad-series-steps">
              {task.given.map((word, stepIndex) => (
                <p key={`${word}-${stepIndex}`} className="olympiad-series-step">
                  {explainStep(word, task.kind).map((part, partIndex) => (
                    part.move
                      ? <b key={`${part.text}-${partIndex}`} className="olympiad-series-move">{part.text}</b>
                      : <span key={`${part.text}-${partIndex}`}>{part.text}</span>
                  ))}
                </p>
              ))}
            </div>
            <p className="olympiad-answer">Ответ: {displayWithoutFinalPeriod(task.answer)}</p>
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
                {letterSeriesSearchCommon.map(line => (
                  <p key={line}>{displayWithoutFinalPeriod(line)}</p>
                ))}
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
