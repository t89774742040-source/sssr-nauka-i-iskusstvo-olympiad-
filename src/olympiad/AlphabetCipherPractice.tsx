import { useLayoutEffect, useRef, useState } from "react";
import { displayWithoutFinalPeriod } from "./displayText";
import {
  alphabetCipherAnswersMatch,
  alphabetCipherPairs,
  alphabetCipherTasks,
  alphabetLetters,
} from "./alphabetCipherData";

type Outcome = "first" | "retry" | "revealed";

const emptyOutcomes = () => Array<Outcome | null>(alphabetCipherTasks.length).fill(null);

const scrollPracticeStart = (el: HTMLElement | null) => {
  if (!el) return;
  const header = document.querySelector("header");
  const headerH = header instanceof HTMLElement ? header.getBoundingClientRect().height : 72;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
  window.scrollTo({top: Math.max(0, top), behavior: "auto"});
};

export default function AlphabetCipherPractice({onBack}:{onBack:()=>void}) {
  const total = alphabetCipherTasks.length;
  const startRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [failed, setFailed] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resolved, setResolved] = useState<"correct" | "revealed" | null>(null);
  const [outcomes, setOutcomes] = useState<(Outcome | null)[]>(emptyOutcomes);
  const [done, setDone] = useState(false);
  const task = alphabetCipherTasks[index];

  useLayoutEffect(() => {
    scrollPracticeStart(startRef.current);
  }, [index, done]);

  const resetTask = (nextIndex: number) => {
    setIndex(nextIndex);
    setValue("");
    setFailed(false);
    setShowError(false);
    setResolved(null);
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
    if (alphabetCipherAnswersMatch(value, task.answer)) {
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
          <h1>Шифр по алфавиту</h1>
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
  const pairs = alphabetCipherPairs(task.codes);

  return (
    <main className="compact olympiad-shell">
      <section className="olympiad-cover">
        <button ref={startRef} type="button" className="olympiad-back olympiad-practice-start" onClick={onBack}>← К словесной логике</button>
        <span>СЛОВЕСНАЯ ЛОГИКА</span>
        <h1>Шифр по алфавиту</h1>
        <div className="olympiad-progress">
          <span>Задание {index + 1} из {total}</span>
          <div><i style={{width: `${((index + 1) / total) * 100}%`}} /></div>
        </div>
        <p className="olympiad-lead olympiad-instruction">
          <span>Каждое число обозначает номер буквы в русском алфавите</span>
          <span>Расшифруй слово</span>
        </p>
        <div className="olympiad-alpha-table">
          {alphabetLetters.map((letter, letterIndex) => (
            <div
              key={letter}
              className={letter === "Ё" ? "olympiad-alpha-cell olympiad-alpha-yo" : "olympiad-alpha-cell"}
            >
              <span>{letterIndex + 1}</span>
              <b>{letter}</b>
            </div>
          ))}
        </div>
        <p className="olympiad-alpha-note">Ё — седьмая буква</p>
        <div className="olympiad-alpha-codes" aria-label={task.codes.join(" ")}>
          {task.codes.map((code, codeIndex) => (
            <span key={`${code}-${codeIndex}`} className="olympiad-alpha-code">{code}</span>
          ))}
        </div>
        {open && (
          <>
            <label className="olympiad-label" htmlFor="olympiad-alphabet-cipher-answer">Полный ответ</label>
            <input
              id="olympiad-alphabet-cipher-answer"
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
            <div className="olympiad-alpha-pairs">
              {pairs.map((pair, pairIndex) => (
                <span key={`${pair.code}-${pair.letter}-${pairIndex}`} className="olympiad-alpha-pair">
                  {pair.code} → {pair.letter}
                </span>
              ))}
            </div>
            <p className="olympiad-answer">{displayWithoutFinalPeriod(task.answer)}</p>
            <div className="olympiad-actions">
              <button type="button" className="primary" onClick={goNext}>{index + 1 === total ? "Результат" : "Следующее задание"}</button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
