import { useLayoutEffect, useRef, useState } from "react";
import { displayWithoutFinalPeriod } from "./displayText";
import {
  letterDigitsAnswersMatch,
  letterDigitsEquationParts,
  letterDigitsIsLetter,
  letterDigitsRepeatedInOrder,
  letterDigitsTasks,
  type LetterDigitsTask,
} from "./letterDigitsData";

type Outcome = "first" | "retry" | "revealed";

const REPEAT_BACKGROUNDS = ["#d9e7e5", "#efe4c8", "#ead8e4"] as const;

const emptyOutcomes = () => Array<Outcome | null>(letterDigitsTasks.length).fill(null);

const emptyValues = (task: LetterDigitsTask) =>
  Object.fromEntries(task.fields.map(field => [field.letter, ""])) as Record<string, string>;

const scrollPracticeStart = (el: HTMLElement | null) => {
  if (!el) return;
  const header = document.querySelector("header");
  const headerH = header instanceof HTMLElement ? header.getBoundingClientRect().height : 72;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
  window.scrollTo({top: Math.max(0, top), behavior: "auto"});
};

const acceptDigit = (raw: string) => {
  if (raw === "") return "";
  const digits = raw.match(/[0-9]/g);
  if (!digits) return null;
  return digits[digits.length - 1] ?? "";
};

export default function LetterDigitsPractice({onBack}:{onBack:()=>void}) {
  const total = letterDigitsTasks.length;
  const startRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>(() => emptyValues(letterDigitsTasks[0]!));
  const [failed, setFailed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resolved, setResolved] = useState<"correct" | "revealed" | null>(null);
  const [outcomes, setOutcomes] = useState<(Outcome | null)[]>(emptyOutcomes);
  const [searchOpen, setSearchOpen] = useState(false);
  const [done, setDone] = useState(false);
  const task = letterDigitsTasks[index];

  useLayoutEffect(() => {
    scrollPracticeStart(startRef.current);
  }, [index, done]);

  const resetTask = (nextIndex: number) => {
    const nextTask = letterDigitsTasks[nextIndex];
    setIndex(nextIndex);
    setValues(nextTask ? emptyValues(nextTask) : {});
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

  const allFilled = !!task && task.fields.every(field => (values[field.letter] ?? "").trim() !== "");

  const check = () => {
    if (!task || resolved || !allFilled) return;
    if (letterDigitsAnswersMatch(values, task.fields)) {
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
          <h1>Буквы вместо цифр</h1>
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
  const equationParts = letterDigitsEquationParts(task.letters, task.total);
  const repeated = letterDigitsRepeatedInOrder(task.letters);

  return (
    <main className="compact olympiad-shell">
      <section className="olympiad-cover">
        <button ref={startRef} type="button" className="olympiad-back olympiad-practice-start" onClick={onBack}>← К числам и изображениям</button>
        <span>ЧИСЛА И ИЗОБРАЖЕНИЯ</span>
        <h1>Буквы вместо цифр</h1>
        <div className="olympiad-progress">
          <span>Задание {index + 1} из {total}</span>
          <div><i style={{width: `${((index + 1) / total) * 100}%`}} /></div>
        </div>
        <p className="olympiad-lead olympiad-instruction">
          {task.rules.map(rule => (
            <span key={rule}>{displayWithoutFinalPeriod(rule)}</span>
          ))}
        </p>
        <p className="olympiad-num-series" aria-label={equationParts.join(" ")}>
          {equationParts.map((part, partIndex) => {
            const repeatIndex = letterDigitsIsLetter(part) ? repeated.indexOf(part) : -1;
            const background = repeatIndex >= 0 ? REPEAT_BACKGROUNDS[repeatIndex] : undefined;
            return (
              <span
                key={`${part}-${partIndex}`}
                className="olympiad-num-item"
                style={background ? {background, padding: "0.05em 0.18em", borderRadius: 4} : undefined}
              >
                {part}
              </span>
            );
          })}
        </p>
        {open && (
          <>
            <p className="olympiad-label" id="olympiad-letter-digits-prompt">{displayWithoutFinalPeriod(task.prompt)}</p>
            <div role="group" aria-labelledby="olympiad-letter-digits-prompt" style={{display: "flex", flexWrap: "wrap", gap: 16, maxWidth: "100%"}}>
              {task.fields.map(field => {
                const fieldId = `olympiad-letter-digits-${field.letter}`;
                return (
                  <div key={field.letter} style={{flex: "1 1 120px", minWidth: 108, maxWidth: task.fields.length === 1 ? "100%" : 200}}>
                    <label className="olympiad-label" htmlFor={fieldId}>{field.letter}</label>
                    <input
                      id={fieldId}
                      className="olympiad-field olympiad-num-field"
                      autoComplete="off"
                      inputMode="numeric"
                      maxLength={1}
                      value={values[field.letter] ?? ""}
                      onChange={e => {
                        const next = acceptDigit(e.target.value);
                        if (next === null) return;
                        setValues(prev => ({...prev, [field.letter]: next}));
                        setShowError(false);
                      }}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); check(); } }}
                    />
                  </div>
                );
              })}
            </div>
            {showError && <p className="olympiad-error"><span>Пока не получилось</span><span>Попробуй ещё</span></p>}
            <div className="olympiad-actions">
              <button type="button" className="primary" disabled={!allFilled} onClick={check}>Проверить</button>
              <button type="button" className="secondary" onClick={reveal}>Показать решение</button>
            </div>
          </>
        )}
        {resolved && (
          <div className="olympiad-solution">
            <p><b>Решение открыто</b></p>
            <p className="olympiad-answer">{displayWithoutFinalPeriod(task.answerLine)}</p>
            <p><b>Как решить</b></p>
            {task.explainLines.map(line => (
              <p key={line}>{displayWithoutFinalPeriod(line)}</p>
            ))}
            <button
              type="button"
              className="olympiad-alpha-search-toggle"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(openSearch => !openSearch)}
            >
              Как искать ответ
            </button>
            {searchOpen && task.searchLines.map(line => (
              <p key={line}>{displayWithoutFinalPeriod(line)}</p>
            ))}
            <div className="olympiad-actions">
              <button type="button" className="primary" onClick={goNext}>{index + 1 === total ? "Результат" : "Следующее задание"}</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
