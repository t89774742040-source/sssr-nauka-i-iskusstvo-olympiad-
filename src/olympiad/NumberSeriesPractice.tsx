import { useLayoutEffect, useRef, useState } from "react";
import { displayWithoutFinalPeriod } from "./displayText";
import {
  numberSeriesAnswersMatch,
  numberSeriesTasks,
} from "./numberSeriesData";

type Outcome = "first" | "retry" | "revealed";

const emptyOutcomes = () => Array<Outcome | null>(numberSeriesTasks.length).fill(null);

const scrollPracticeStart = (el: HTMLElement | null) => {
  if (!el) return;
  const header = document.querySelector("header");
  const headerH = header instanceof HTMLElement ? header.getBoundingClientRect().height : 72;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
  window.scrollTo({top: Math.max(0, top), behavior: "auto"});
};

const renderTokens = (tokens: string[], withArrows: boolean) => {
  const parts: string[] = [];
  for (const token of tokens) {
    if (parts.length && withArrows) parts.push("→");
    parts.push(token);
  }
  return parts;
};

export default function NumberSeriesPractice({onBack}:{onBack:()=>void}) {
  const total = numberSeriesTasks.length;
  const startRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [failed, setFailed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resolved, setResolved] = useState<"correct" | "revealed" | null>(null);
  const [outcomes, setOutcomes] = useState<(Outcome | null)[]>(emptyOutcomes);
  const [searchOpen, setSearchOpen] = useState(false);
  const [done, setDone] = useState(false);
  const task = numberSeriesTasks[index];

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
    if (numberSeriesAnswersMatch(value, task.answer)) {
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
          <h1>Числовые ряды</h1>
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
  const withArrows = task.kind !== "doubling-digits";
  const promptParts = [...renderTokens(task.tokens, withArrows), ...(withArrows ? ["→"] : []), "?"];

  return (
    <main className="compact olympiad-shell">
      <section className="olympiad-cover">
        <button ref={startRef} type="button" className="olympiad-back olympiad-practice-start" onClick={onBack}>← К числам и изображениям</button>
        <span>ЧИСЛА И ИЗОБРАЖЕНИЯ</span>
        <h1>Числовые ряды</h1>
        <div className="olympiad-progress">
          <span>Задание {index + 1} из {total}</span>
          <div><i style={{width: `${((index + 1) / total) * 100}%`}} /></div>
        </div>
        <p className="olympiad-lead olympiad-instruction">
          <span>{displayWithoutFinalPeriod(task.prompt)}</span>
        </p>
        <p className={`olympiad-num-series${withArrows ? "" : " olympiad-num-digits"}`} aria-label={promptParts.join(" ")}>
          {promptParts.map((part, partIndex) => (
            <span key={`${part}-${partIndex}`} className="olympiad-num-item">{part}</span>
          ))}
        </p>
        {open && (
          <>
            <label className="olympiad-label" htmlFor="olympiad-number-series-answer">{task.kind === "doubling-digits" ? "Следующая цифра" : "Следующее число"}</label>
            <input
              id="olympiad-number-series-answer"
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
        {resolved && (
          <div className="olympiad-solution">
            <p><b>{resolved === "correct" ? "Верно" : "Решение открыто"}</b></p>
            {task.kind === "two-tracks" && task.oddTrack && task.evenTrack ? (
              <>
                <p className="olympiad-num-caption olympiad-num-odd">Нечётные места</p>
                <p className="olympiad-num-track olympiad-num-odd">
                  {renderTokens(task.oddTrack, true).map((part, partIndex) => (
                    <span key={`odd-${part}-${partIndex}`} className="olympiad-num-item">{part}</span>
                  ))}
                </p>
                <p className="olympiad-num-caption olympiad-num-even">Чётные места</p>
                <p className="olympiad-num-track olympiad-num-even">
                  {renderTokens(task.evenTrack, true).map((part, partIndex) => (
                    <span key={`even-${part}-${partIndex}`} className="olympiad-num-item">{part}</span>
                  ))}
                </p>
              </>
            ) : (
              <>
                {task.groupedTokens && (
                  <p className="olympiad-num-track">
                    {renderTokens(task.groupedTokens, true).map((part, partIndex) => (
                      <span key={`group-${part}-${partIndex}`} className="olympiad-num-item">{part}</span>
                    ))}
                  </p>
                )}
                <div className="olympiad-num-steps">
                  {task.explainLines.map(line => (
                    <p key={line} className="olympiad-num-step">{displayWithoutFinalPeriod(line)}</p>
                  ))}
                </div>
              </>
            )}
            <p className="olympiad-answer">Ответ: <span className="olympiad-num-item">{task.answer}</span></p>
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
