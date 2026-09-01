export type NumberSeriesKind = "add-growing" | "two-tracks" | "doubling-digits";

export type NumberSeriesTask = {
  prompt: string;
  tokens: string[];
  answer: number;
  kind: NumberSeriesKind;
  explainLines: string[];
  searchLines: string[];
  oddTrack?: string[];
  evenTrack?: string[];
  groupedTokens?: string[];
};

export function numberSeriesAnswersMatch(given: string, answer: number) {
  const trimmed = given.trim();
  if (trimmed === "") return false;
  if (!/^-?\d+$/u.test(trimmed)) return false;
  return Number(trimmed) === answer;
}

export const numberSeriesTasks: NumberSeriesTask[] = [
  {
    prompt: "Какое число следующее?",
    tokens: ["2", "5", "9", "14", "20"],
    answer: 27,
    kind: "add-growing",
    explainLines: [
      "2 + 3 = 5",
      "5 + 4 = 9",
      "9 + 5 = 14",
      "14 + 6 = 20",
      "20 + 7 = 27",
    ],
    searchLines: [
      "Сравни соседние числа — на сколько каждое больше предыдущего",
      "Получаем прибавления 3, 4, 5, 6",
      "Каждый раз прибавляем на единицу больше",
      "Следующее прибавление — 7, поэтому 20 + 7 = 27",
    ],
  },
  {
    prompt: "Какое число следующее?",
    tokens: ["1", "9", "2", "8", "3", "7", "4"],
    answer: 6,
    kind: "two-tracks",
    explainLines: [],
    oddTrack: ["1", "2", "3", "4"],
    evenTrack: ["9", "8", "7", "6"],
    searchLines: [
      "Числа то увеличиваются, то уменьшаются — попробуй читать через одно",
      "На первом, третьем, пятом и седьмом местах стоят 1, 2, 3, 4",
      "На втором, четвёртом и шестом — 9, 8, 7",
      "Пропуск находится на восьмом месте, поэтому продолжаем второй ряд числом 6",
    ],
  },
  {
    prompt: "Какая цифра следующая?",
    tokens: ["1", "2", "4", "8", "1", "6", "3", "2", "6"],
    answer: 4,
    kind: "doubling-digits",
    groupedTokens: ["1", "2", "4", "8", "16", "32", "64"],
    explainLines: [
      "Каждое число умножаем на 2",
      "Последнее число начинается с 6 — для завершения 64 нужна цифра 4",
    ],
    searchLines: [
      "Первые числа 1, 2, 4, 8 каждый раз удваиваются",
      "После 8 должно быть 16 — в задании его цифры записаны отдельно",
      "Затем идут 32 и 64",
      "Значит, после последней показанной цифры 6 нужна цифра 4",
      "В ответ записываем одну цифру, а не число 64",
    ],
  },
];

function assertNumberSeries() {
  const first = numberSeriesTasks[0];
  const second = numberSeriesTasks[1];
  const third = numberSeriesTasks[2];
  if (!first || !second || !third) throw new Error("Нужны три числовых ряда");

  const start = first.tokens.map(Number);
  const diffs = start.slice(1).map((value, index) => value - start[index]!);
  if (JSON.stringify(diffs) !== JSON.stringify([3, 4, 5, 6])) {
    throw new Error(`Ряд 1: прибавления ${diffs.join(", ")}`);
  }
  if (start[start.length - 1]! + 7 !== first.answer) {
    throw new Error(`Ряд 1: 20 + 7 должно дать ${first.answer}`);
  }

  const odd = second.tokens.filter((_, index) => index % 2 === 0).map(Number);
  const even = second.tokens.filter((_, index) => index % 2 === 1).map(Number);
  if (JSON.stringify(odd) !== JSON.stringify([1, 2, 3, 4])) {
    throw new Error(`Ряд 2: нечётные места ${odd.join(", ")}`);
  }
  if (JSON.stringify(even) !== JSON.stringify([9, 8, 7])) {
    throw new Error(`Ряд 2: чётные места ${even.join(", ")}`);
  }
  if (even[even.length - 1]! - 1 !== second.answer) {
    throw new Error(`Ряд 2: следующее чётное должно быть ${second.answer}`);
  }

  const doubled = [1, 2, 4, 8, 16, 32, 64];
  const joined = doubled.join("");
  const shown = third.tokens.join("");
  if (!joined.startsWith(shown)) {
    throw new Error(`Ряд 3: показанные цифры ${shown} не совпадают с удвоением`);
  }
  if (joined.slice(shown.length) !== String(third.answer)) {
    throw new Error(`Ряд 3: после ${shown} должна быть цифра ${third.answer}`);
  }
  if (JSON.stringify(third.groupedTokens) !== JSON.stringify(["1", "2", "4", "8", "16", "32", "64"])) {
    throw new Error("Ряд 3: в разборе должны быть 1 → 2 → 4 → 8 → 16 → 32 → 64");
  }
}

assertNumberSeries();
