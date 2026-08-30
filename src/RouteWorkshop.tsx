import { useState } from "react";

export type WorkshopData = {
  route: string;
  image: string;
  imageAlt: string;
  identifyPrompt: string;
  identifyAnswer: string;
  matchPrompt: string;
  matchOptions: string[];
  matchAnswer: number;
  orderPrompt?: string;
  events: [string, string][];
  correctOrder: string[];
  errorStatements: string[];
  errorIndexes: number[];
  anagramPrompt: string;
  anagramLetters: string;
  anagramAnswer: string;
  crossword: [string, string][];
  allowBackNavigation?: boolean;
  individualCrosswordFeedback?: boolean;
};

const clean = (value: string) => value.trim().toLocaleLowerCase("ru-RU").replace(/ё/g, "е");
const cleanCrossword = (value: string) => clean(value)
  .replace(/\s*[-‐‑‒–—−]\s*/g, "-")
  .replace(/\s+/g, " ");

export default function RouteWorkshop({ data, onFinish }: { data: WorkshopData; onBack: () => void; onFinish: () => void }) {
  const [task, setTask] = useState(0);
  const [identifyAnswer, setIdentifyAnswer] = useState("");
  const [anagramAnswer, setAnagramAnswer] = useState("");
  const [choice, setChoice] = useState<number | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [errors, setErrors] = useState<number[]>([]);
  const [cross, setCross] = useState(() => data.crossword.map(() => ""));
  const [crossResults, setCrossResults] = useState<(boolean | null)[]>(() => data.crossword.map(() => null));
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const result = (ok: boolean, good: string, bad: string) => { setSuccess(ok); setMessage(ok ? good : bad); };
  const next = () => {
    setTask(task + 1);
    if (!data.allowBackNavigation) {
      setIdentifyAnswer("");
      setAnagramAnswer("");
      setChoice(null);
      setOrder([]);
      setErrors([]);
    }
    setMessage("");
    setSuccess(false);
    window.scrollTo(0, 0);
  };
  const previous = () => {
    if (!data.allowBackNavigation || task === 0) return;
    setTask(task - 1);
    setMessage("");
    setSuccess(false);
    window.scrollTo(0, 0);
  };
  const checkCrossword = () => {
    const results = cross.map((value, index) => data.individualCrosswordFeedback
      ? cleanCrossword(value) === cleanCrossword(data.crossword[index][1])
      : clean(value) === clean(data.crossword[index][1]));
    if (data.individualCrosswordFeedback) setCrossResults(results);
    result(
      results.every(Boolean),
      "Верно! Все слова заполнены.",
      data.individualCrosswordFeedback
        ? "Есть неточности. Исправь ответы, выделенные красным"
        : "Есть неточность. Все ответы встречались в учебных экранах.",
    );
  };

  return <div className="workshop embedded-workshop">
    <div className="workshop-progress"><span>{data.route.toUpperCase()} • ОЛИМПИАДНАЯ МАСТЕРСКАЯ • ЗАДАНИЕ {task + 1} ИЗ 6</span><div><i style={{ width: `${(task + 1) / 6 * 100}%` }} /></div></div>
    <section className="workshop-sheet">
      <div className="chapter-label">ОЛИМПИАДНЫЕ ФОРМАТЫ</div>
      {task === 0 && <><h1>Узнай изображение</h1><div className="portrait-task"><img src={data.image} alt={data.imageAlt} /><div><h2>{data.identifyPrompt}</h2><p className="task-intro">Напиши ответ самостоятельно. Варианты ответа не даются.</p><input value={identifyAnswer} onChange={event => setIdentifyAnswer(event.target.value)} placeholder="Введи название или фамилию" /><button className="primary" onClick={() => result(clean(identifyAnswer) === clean(data.identifyAnswer), "Верно! Изображение узнано.", "Пока нет. Проверь написание и материал маршрута.")}>Проверить</button></div></div></>}
      {task === 1 && <><h1>Установи соответствие</h1><p className="task-intro">{data.matchPrompt}</p><div className="order-bank">{data.matchOptions.map((option, index) => <button className={choice === index ? "selected" : ""} key={option} onClick={() => { setChoice(index); setMessage(""); }}>{option}</button>)}</div><button className="primary" disabled={choice === null} onClick={() => result(choice === data.matchAnswer, "Верно! Соответствие установлено.", "Пока нет. Сопоставь факты с изученным материалом.")}>Проверить</button></>}
      {task === 2 && <><h1>Восстанови хронологию</h1><p className="task-intro">{data.orderPrompt ?? "Нажимай на события от самого раннего к самому позднему."}</p><div className="order-bank">{data.events.map(event => <button key={event[0]} disabled={order.includes(event[0])} onClick={() => setOrder([...order, event[0]])}>{event[1]}</button>)}</div><div className="chosen-order"><b>Твоя последовательность:</b>{order.map((id, index) => <span key={id}>{index + 1}. {data.events.find(event => event[0] === id)?.[1]}</span>)}</div><div className="task-actions"><button className="secondary" onClick={() => { setOrder([]); setMessage(""); }}>Сбросить</button><button className="primary" disabled={order.length < data.correctOrder.length} onClick={() => result(order.join("|") === data.correctOrder.join("|"), "Верно! Хронология восстановлена.", "Пока нет. Проверь последовательность событий по учебным экранам.")}>Проверить</button></div></>}
      {task === 3 && <><h1>Найди ошибки в тексте</h1><p className="task-intro">Отметь два предложения, в которых факты искажены.</p>{data.errorStatements.map((text, index) => <label className="error-row" key={text}><input type="checkbox" checked={errors.includes(index)} onChange={() => setErrors(errors.includes(index) ? errors.filter(item => item !== index) : [...errors, index])} /><span>{text}</span></label>)}<button className="primary" onClick={() => { const selected = [...errors].sort().join("|"); const expected = [...data.errorIndexes].sort().join("|"); result(selected === expected, "Верно! Обе ошибки найдены.", "Пока нет. Нужно отметить ровно два ошибочных предложения."); }}>Проверить текст</button></>}
      {task === 4 && <div className="anagram"><h1>Реши анаграмму</h1><p className="task-intro">{data.anagramPrompt}</p><div className="letter-bank">{data.anagramLetters}</div><input value={anagramAnswer} onChange={event => setAnagramAnswer(event.target.value)} placeholder="Напиши слово" /><button className="primary" onClick={() => result(clean(anagramAnswer) === clean(data.anagramAnswer), "Верно! Анаграмма решена.", "Пока нет. Используй все предложенные буквы.")}>Проверить</button></div>}
      {task === 5 && <><h1>Заполни мини-кроссворд</h1><p className="task-intro">Впиши четыре слова, которые встречались в маршруте.</p>{data.crossword.map((clue, index) => <label className="cross-row" key={clue[0]}><span className={data.route === "Московские высотки" ? "key-fact" : undefined}>{index + 1}. {clue[0]}</span><input className={data.individualCrosswordFeedback && crossResults[index] !== null ? (crossResults[index] ? "right" : "wrong") : undefined} value={cross[index]} onChange={event => { const next = [...cross]; next[index] = event.target.value; setCross(next); if (data.individualCrosswordFeedback) { const nextResults = [...crossResults]; nextResults[index] = null; setCrossResults(nextResults); setMessage(""); setSuccess(false); } }} placeholder={`${clue[1].length} букв`} /></label>)}<button className="primary" onClick={checkCrossword}>Проверить кроссворд</button></>}
      {message && <p className={success ? "workshop-message right-message" : "workshop-message wrong-message"}>{message}</p>}
      <div className="workshop-nav">{data.allowBackNavigation && task > 0 && <button className="secondary" onClick={previous}>← Предыдущее задание</button>} {success && (task < 5 ? <button className="primary" onClick={next}>Следующее задание →</button> : <button className="primary" onClick={onFinish}>К карточкам темы →</button>)}</div>
    </section>
  </div>;
}
