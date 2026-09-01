export type LetterSeriesKind = "first-to-end" | "last-to-start" | "first-two-to-end";

export type LetterSeriesTask = {
  given: string[];
  answer: string;
  rule: string;
  show: string;
  kind: LetterSeriesKind;
};

export function applyLetterSeriesMove(word: string, kind: LetterSeriesKind) {
  if (kind === "first-to-end") return word.slice(1) + word.slice(0, 1);
  if (kind === "last-to-start") return word.slice(-1) + word.slice(0, -1);
  return word.slice(2) + word.slice(0, 2);
}

export function seriesPromptParts(given: string[]) {
  const parts: string[] = [];
  for (const word of given) {
    if (parts.length) parts.push("→");
    parts.push(word);
  }
  parts.push("→", "?");
  return parts;
}

export function seriesShowParts(show: string) {
  return show.split(/\s*(→|\|)\s*/u).filter(part => part !== "");
}

const prepareAnswer = (value: string) => value
  .trim()
  .replace(/\.+$/u, "")
  .toLocaleLowerCase("ru-RU");

export function letterSeriesAnswersMatch(given: string, answer: string) {
  const prepared = prepareAnswer(given);
  if (prepared === "") return false;
  return prepared === prepareAnswer(answer);
}

function expectedShow(word: string, kind: LetterSeriesKind) {
  if (kind === "first-to-end") {
    const move = word.slice(0, 1);
    const rest = word.slice(1);
    return `${move} | ${rest} → ${rest} | ${move}`;
  }
  if (kind === "last-to-start") {
    const move = word.slice(-1);
    const rest = word.slice(0, -1);
    return `${rest} | ${move} → ${move} | ${rest}`;
  }
  const move = word.slice(0, 2);
  const rest = word.slice(2);
  return `${move} | ${rest} → ${rest} | ${move}`;
}

export function letterSeriesTransitions(task: LetterSeriesTask) {
  const chain = [...task.given, task.answer];
  return chain.slice(0, -1).map((from, index) => {
    const expected = chain[index + 1];
    if (expected === undefined) throw new Error(`Неполный ряд: ${task.given[0] ?? ""}`);
    return {
      from,
      expected,
      applied: applyLetterSeriesMove(from, task.kind),
    };
  });
}

function assertSeries(task: LetterSeriesTask) {
  if (task.given.length === 0) {
    throw new Error("В ряде нет исходных слов");
  }
  for (const step of letterSeriesTransitions(task)) {
    if (step.applied !== step.expected) {
      throw new Error(`Ряд ${task.given[0]}: ${step.from} → ${step.applied}, ожидалось ${step.expected}`);
    }
  }
  const lastGiven = task.given[task.given.length - 1];
  if (lastGiven === undefined) throw new Error("В ряде нет исходных слов");
  const show = expectedShow(lastGiven, task.kind);
  if (show !== task.show) {
    throw new Error(`Разбор ряда ${task.given[0]}: «${task.show}», ожидалось «${show}»`);
  }
}

export const letterSeriesTasks: LetterSeriesTask[] = [
  {
    given: ["КОСМОС", "ОСМОСК", "СМОСКО"],
    answer: "МОСКОС",
    rule: "Первую букву переносим в конец",
    show: "С | МОСКО → МОСКО | С",
    kind: "first-to-end",
  },
  {
    given: ["ТЕАТР", "РТЕАТ", "ТРТЕА"],
    answer: "АТРТЕ",
    rule: "Последнюю букву переносим в начало",
    show: "ТРТЕ | А → А | ТРТЕ",
    kind: "last-to-start",
  },
  {
    given: ["СПУТНИК", "УТНИКСП", "НИКСПУТ"],
    answer: "КСПУТНИ",
    rule: "Первые две буквы переносим в конец, сохраняя их порядок",
    show: "НИ | КСПУТ → КСПУТ | НИ",
    kind: "first-two-to-end",
  },
];

letterSeriesTasks.forEach(assertSeries);
