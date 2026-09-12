import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { displayWithoutFinalPeriod } from "./displayText";
import "./CrosswordPractice.css";
import {
  acceptCrosswordLetter,
  cellKey,
  crosswordAnswersMatch,
  crosswordCellMap,
  crosswordGridFilled,
  crosswordPuzzles,
  crosswordSearchCommon,
  crosswordSolution,
  crosswordWrongKeys,
  emptyCrosswordGrid,
  entriesByDirection,
  entryByNumber,
  entryCells,
  type CrosswordDirection,
  type CrosswordEntry,
  type CrosswordPuzzle,
} from "./crosswordData";

type Outcome = "first" | "retry" | "revealed";
type Selection = {number: number; direction: CrosswordDirection};

const emptyOutcomes = () => Array<Outcome | null>(crosswordPuzzles.length).fill(null);

const scrollPracticeStart = (el: HTMLElement | null) => {
  if (!el) return;
  const header = document.querySelector("header");
  const headerH = header instanceof HTMLElement ? header.getBoundingClientRect().height : 72;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
  window.scrollTo({top: Math.max(0, top), behavior: "auto"});
};

const firstSelection = (puzzle: CrosswordPuzzle): Selection => {
  const first = [...puzzle.entries].sort((a, b) => a.number - b.number || (a.direction === "across" ? -1 : 1))[0];
  return {number: first?.number ?? 1, direction: first?.direction ?? "across"};
};

const entryOf = (puzzle: CrosswordPuzzle, selection: Selection) =>
  entryByNumber(puzzle, selection.number, selection.direction);

const cellBelongs = (entry: CrosswordEntry, row: number, col: number) =>
  entryCells(entry).some(cell => cell.row === row && cell.col === col);

export default function CrosswordPractice({onBack}:{onBack:()=>void}) {
  const total = crosswordPuzzles.length;
  const startRef = useRef<HTMLButtonElement>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [index, setIndex] = useState(0);
  const [grid, setGrid] = useState(() => emptyCrosswordGrid(crosswordPuzzles[0]!));
  const [selection, setSelection] = useState<Selection>(() => firstSelection(crosswordPuzzles[0]!));
  const [failed, setFailed] = useState(false);
  const [wrongKeys, setWrongKeys] = useState<string[]>([]);
  const [resolved, setResolved] = useState<"correct" | "revealed" | null>(null);
  const [outcomes, setOutcomes] = useState<(Outcome | null)[]>(emptyOutcomes);
  const [searchOpen, setSearchOpen] = useState(false);
  const [done, setDone] = useState(false);
  const puzzle = crosswordPuzzles[index];

  useLayoutEffect(() => {
    scrollPracticeStart(startRef.current);
  }, [index, done]);

  const resetTask = (nextIndex: number) => {
    const nextPuzzle = crosswordPuzzles[nextIndex];
    setIndex(nextIndex);
    setGrid(nextPuzzle ? emptyCrosswordGrid(nextPuzzle) : {});
    setSelection(nextPuzzle ? firstSelection(nextPuzzle) : {number: 1, direction: "across"});
    setFailed(false);
    setWrongKeys([]);
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

  const cells = useMemo(() => puzzle ? crosswordCellMap(puzzle) : new Map(), [puzzle]);
  const selectedEntry = puzzle ? entryOf(puzzle, selection) : undefined;
  const allFilled = !!puzzle && crosswordGridFilled(puzzle, grid);

  const focusCell = (row: number, col: number) => {
    const node = inputRefs.current[cellKey(row, col)];
    if (node) node.focus();
  };

  const selectWord = (next: Selection, row?: number, col?: number) => {
    setSelection(next);
    const entry = puzzle ? entryOf(puzzle, next) : undefined;
    if (!entry) return;
    if (row != null && col != null) {
      focusCell(row, col);
      return;
    }
    const firstEmpty = entryCells(entry).find(cell => (grid[cellKey(cell.row, cell.col)] ?? "") === "");
    const target = firstEmpty ?? entryCells(entry)[0];
    if (target) focusCell(target.row, target.col);
  };

  const onCellClick = (row: number, col: number) => {
    if (!puzzle || resolved) return;
    const cell = cells.get(cellKey(row, col));
    if (!cell) return;
    const options: Selection[] = [];
    if (cell.across != null) options.push({number: cell.across, direction: "across"});
    if (cell.down != null) options.push({number: cell.down, direction: "down"});
    if (options.length === 0) return;
    const current = options.find(item => item.number === selection.number && item.direction === selection.direction);
    const next = current && options.length > 1
      ? options.find(item => item !== current) ?? options[0]!
      : current ?? options[0]!;
    selectWord(next, row, col);
  };

  const moveInWord = (entry: CrosswordEntry, row: number, col: number, step: number) => {
    const list = entryCells(entry);
    const at = list.findIndex(cell => cell.row === row && cell.col === col);
    const next = list[at + step];
    if (next) focusCell(next.row, next.col);
  };

  const setLetter = (row: number, col: number, letter: string) => {
    setGrid(prev => ({...prev, [cellKey(row, col)]: letter}));
    setWrongKeys([]);
  };

  const check = () => {
    if (!puzzle || resolved || !allFilled) return;
    if (crosswordAnswersMatch(puzzle, grid)) {
      setOutcome(failed ? "retry" : "first");
      setResolved("correct");
      setWrongKeys([]);
    } else {
      setFailed(true);
      setWrongKeys(crosswordWrongKeys(puzzle, grid));
    }
  };

  const reveal = () => {
    if (!puzzle || resolved) return;
    setOutcome("revealed");
    setResolved("revealed");
    setGrid(crosswordSolution(puzzle));
    setWrongKeys([]);
    setSearchOpen(false);
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
          <button ref={startRef} type="button" className="olympiad-back olympiad-practice-start" onClick={onBack}>← К разделам олимпиады</button>
          <span>КРОССВОРДЫ</span>
          <h1>Кроссворды</h1>
          <p className="olympiad-lead">Тренировка завершена</p>
          <div className="olympiad-summary">
            <div><b>Решено с первой попытки</b><strong>{first}</strong></div>
            <div><b>Решено после исправления</b><strong>{retry}</strong></div>
            <div><b>Просмотрено решение</b><strong>{revealed}</strong></div>
          </div>
          <div className="olympiad-actions">
            <button type="button" className="primary" onClick={restart}>Повторить тренировку</button>
            <button type="button" className="secondary" onClick={onBack}>К разделам олимпиады</button>
          </div>
        </section>
      </main>
    );
  }

  if (!puzzle) return null;

  const open = resolved === null;
  const shownGrid = resolved ? crosswordSolution(puzzle) : grid;

  const renderGrid = (readOnly: boolean) => (
    <div
      className="olympiad-crossword"
      style={{"--crossword-cols": puzzle.cols} as CSSProperties}
      role="grid"
      aria-label="Сетка кроссворда"
    >
      {Array.from({length: puzzle.rows}, (_, row) => (
        Array.from({length: puzzle.cols}, (_, col) => {
          const key = cellKey(row, col);
          const cell = cells.get(key);
          if (!cell) {
            return <div key={key} className="olympiad-crossword-empty" role="presentation" />;
          }
          const selected = !!selectedEntry && !readOnly && cellBelongs(selectedEntry, row, col);
          const wrong = !readOnly && wrongKeys.includes(key);
          return (
            <div
              key={key}
              className={[
                "olympiad-crossword-cell",
                selected ? "is-selected" : "",
                wrong ? "is-wrong" : "",
              ].filter(Boolean).join(" ")}
            >
              {cell.number != null && <span className="olympiad-crossword-num">{cell.number}</span>}
              <input
                ref={node => { inputRefs.current[key] = node; }}
                className="olympiad-crossword-input"
                aria-label={`Строка ${row + 1}, столбец ${col + 1}`}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={1}
                readOnly={readOnly}
                value={shownGrid[key] ?? ""}
                onClick={() => onCellClick(row, col)}
                onChange={event => {
                  if (readOnly || !selectedEntry) return;
                  const next = acceptCrosswordLetter(event.target.value);
                  if (next === null) return;
                  setLetter(row, col, next);
                  if (next !== "") moveInWord(selectedEntry, row, col, 1);
                }}
                onKeyDown={event => {
                  if (readOnly || !selectedEntry) return;
                  if (event.key === "Enter") {
                    event.preventDefault();
                    check();
                    return;
                  }
                  if (event.key === "Backspace") {
                    event.preventDefault();
                    const current = grid[key] ?? "";
                    if (current) setLetter(row, col, "");
                    else moveInWord(selectedEntry, row, col, -1);
                    return;
                  }
                  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                    event.preventDefault();
                    moveInWord(selectedEntry, row, col, 1);
                    return;
                  }
                  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                    event.preventDefault();
                    moveInWord(selectedEntry, row, col, -1);
                  }
                }}
              />
            </div>
          );
        })
      ))}
    </div>
  );

  const renderClues = (interactive: boolean) => (
    <div className="crossword-layout-clues olympiad-crossword-clues">
      {([
        ["across", "По горизонтали"],
        ["down", "По вертикали"],
      ] as const).map(([direction, title]) => (
        <div key={direction}>
          <p className="olympiad-crossword-clue-title">{title}</p>
          {entriesByDirection(puzzle, direction).map(entry => {
            const active = interactive && selection.number === entry.number && selection.direction === entry.direction;
            const text = `${entry.number}. ${displayWithoutFinalPeriod(entry.clue)}`;
            return interactive ? (
              <button
                type="button"
                key={`${direction}-${entry.number}`}
                className={active ? "olympiad-crossword-clue is-active" : "olympiad-crossword-clue"}
                onClick={() => selectWord({number: entry.number, direction})}
              >
                {text}
              </button>
            ) : (
              <p key={`${direction}-${entry.number}`}>{text}</p>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderAnswers = () => (
    <div className="crossword-layout-clues">
      {([
        ["across", "По горизонтали"],
        ["down", "По вертикали"],
      ] as const).map(([direction, title]) => (
        <div key={direction}>
          <p><b>{title}</b></p>
          {entriesByDirection(puzzle, direction).map(entry => (
            <p key={`${direction}-${entry.number}`}>
              {entry.number}. {displayWithoutFinalPeriod(entry.word)} — {displayWithoutFinalPeriod(entry.explain)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <main className="compact olympiad-shell">
      <section className="olympiad-cover">
        <button ref={startRef} type="button" className="olympiad-back olympiad-practice-start" onClick={onBack}>← К разделам олимпиады</button>
        <span>КРОССВОРДЫ</span>
        <h1>Кроссворды</h1>
        <div className="olympiad-progress">
          <span>Задание {index + 1} из {total}</span>
          <div><i style={{width: `${((index + 1) / total) * 100}%`}} /></div>
        </div>
        <p className="olympiad-lead olympiad-instruction">
          <span>Впиши в сетку слова по определениям</span>
        </p>
        {open && (
          <div className="crossword-layout">
            <div className="crossword-layout-main">
              <div className="crossword-layout-board">
                {renderGrid(false)}
              </div>
              {renderClues(true)}
            </div>
            {wrongKeys.length > 0 && (
              <p className="olympiad-error">
                <span>Пока не получилось</span>
                <span>Попробуй ещё</span>
              </p>
            )}
            <div className="olympiad-actions">
              <button type="button" className="primary" disabled={!allFilled} onClick={check}>Проверить</button>
              <button type="button" className="secondary" onClick={reveal}>Показать решение</button>
            </div>
          </div>
        )}
        {resolved && (
          <div className="olympiad-solution">
            <p><b>Решение открыто</b></p>
            <div className="crossword-layout crossword-layout-solved">
              <div className="crossword-layout-main">
                <div className="crossword-layout-board">
                  {renderGrid(true)}
                </div>
                {renderAnswers()}
              </div>
            </div>
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
                {crosswordSearchCommon.map(line => (
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
