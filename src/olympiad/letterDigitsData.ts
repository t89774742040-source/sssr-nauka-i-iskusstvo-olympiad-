/**
 * Механика основана на задании №12 раздела „Логика“ ОВИО 2024–2025 для 3–4 классов. Содержание адаптировано под тему „СССР: наука и искусство“
 */

export type LetterDigitsField = {
  letter: string;
  answer: number;
};

export type LetterDigitsTask = {
  letters: string[];
  total: number;
  digitMax: number;
  rules: string[];
  prompt: string;
  fields: LetterDigitsField[];
  answerLine: string;
  explainLines: string[];
  searchLines: string[];
};

const LETTER_RE = /^[А-ЯЁ]$/u;

export function letterDigitsEquationParts(letters: string[], total: number) {
  const parts: string[] = [];
  for (const letter of letters) {
    if (parts.length) parts.push("+");
    parts.push(letter);
  }
  parts.push("=", String(total));
  return parts;
}

export function letterDigitsIsLetter(part: string) {
  return LETTER_RE.test(part);
}

export function letterDigitsRepeatedInOrder(letters: string[]) {
  const counts = countLetters(letters);
  const repeated: string[] = [];
  for (const letter of letters) {
    if ((counts.get(letter) ?? 0) > 1 && !repeated.includes(letter)) {
      repeated.push(letter);
    }
  }
  return repeated;
}

export function letterDigitsAnswersMatch(given: Record<string, string>, fields: LetterDigitsField[]) {
  if (fields.length === 0) return false;
  return fields.every(field => {
    const trimmed = (given[field.letter] ?? "").trim();
    if (!/^\d$/u.test(trimmed)) return false;
    return Number(trimmed) === field.answer;
  });
}

function countLetters(letters: string[]) {
  const counts = new Map<string, number>();
  for (const letter of letters) {
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }
  return counts;
}

function uniqueLetters(letters: string[]) {
  const unique: string[] = [];
  for (const letter of letters) {
    if (!unique.includes(letter)) unique.push(letter);
  }
  return unique;
}

function sumTo(n: number) {
  return (n * (n + 1)) / 2;
}

export const letterDigitsTasks: LetterDigitsTask[] = [
  {
    letters: ["Т", "Е", "Л", "Е", "Б", "А", "Ш", "Н", "Я"],
    total: 42,
    digitMax: 8,
    rules: [
      "Восемь разных букв обозначают разные цифры от 1 до 8",
      "Одинаковые буквы обозначают одинаковую цифру",
    ],
    prompt: "Какая цифра соответствует букве Е",
    fields: [{letter: "Е", answer: 6}],
    answerLine: "Ответ: Е = 6",
    explainLines: [
      "В слове восемь разных букв: Т, Е, Л, Б, А, Ш, Н, Я",
      "Им соответствуют все цифры от 1 до 8",
      "Сумма этих цифр: 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 36",
      "Буква Е встречается дважды, поэтому её значение прибавлено ещё один раз",
      "42 − 36 = 6",
    ],
    searchLines: [
      "Сначала найди сумму цифр от 1 до 8, затем вычти её из указанной суммы",
      "Разница — это значение буквы, которая встречается дважды",
    ],
  },
  {
    letters: ["Г", "А", "Г", "А", "Р", "И", "Н"],
    total: 24,
    digitMax: 5,
    rules: [
      "Пять разных букв обозначают разные цифры от 1 до 5",
      "Г больше А",
    ],
    prompt: "Какие цифры соответствуют буквам Г и А",
    fields: [
      {letter: "Г", answer: 5},
      {letter: "А", answer: 4},
    ],
    answerLine: "Ответ: Г = 5, А = 4",
    explainLines: [
      "В слове пять разных букв: Г, А, Р, И, Н",
      "Им соответствуют все цифры от 1 до 5",
      "Сумма этих цифр: 1 + 2 + 3 + 4 + 5 = 15",
      "Буквы Г и А встречаются дважды, поэтому их значения прибавлены ещё один раз",
      "24 − 15 = 9",
      "Разные цифры от 1 до 5 с суммой 9 — это 4 и 5",
      "Г больше А, поэтому Г = 5, А = 4",
    ],
    searchLines: [
      "Сначала найди сумму цифр от 1 до 5, затем вычти её из указанной суммы",
      "Разница — это сумма букв Г и А, которые встречаются дважды",
      "Подбери две разные цифры с такой суммой, учитывая что Г больше А",
    ],
  },
  {
    letters: ["Ц", "И", "О", "Л", "К", "О", "В", "С", "К", "И", "Й"],
    total: 54,
    digitMax: 8,
    rules: [
      "Восемь разных букв обозначают разные цифры от 1 до 8",
      "И, О и К обозначают три последовательные цифры",
      "И < О < К",
    ],
    prompt: "Какие цифры соответствуют буквам И, О и К",
    fields: [
      {letter: "И", answer: 5},
      {letter: "О", answer: 6},
      {letter: "К", answer: 7},
    ],
    answerLine: "Ответ: И = 5, О = 6, К = 7",
    explainLines: [
      "В слове восемь разных букв: Ц, И, О, Л, К, В, С, Й",
      "Им соответствуют все цифры от 1 до 8",
      "Сумма этих цифр: 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 36",
      "Буквы И, О и К встречаются дважды",
      "54 − 36 = 18",
      "Три последовательные цифры с суммой 18 — это 5, 6 и 7",
      "По условию И < О < К",
    ],
    searchLines: [
      "Сначала найди сумму цифр от 1 до 8, затем вычти её из указанной суммы",
      "Разница — это сумма букв И, О и К, которые встречаются дважды",
      "Подбери три последовательные цифры с такой суммой, учитывая что И < О < К",
    ],
  },
];

function assertLetterDigits() {
  if (letterDigitsTasks.length !== 3) throw new Error("Нужны три задания «Буквы вместо цифр»");

  const expected = [
    {word: "ТЕЛЕБАШНЯ", total: 42, digitMax: 8, extra: 6, fieldLetters: ["Е"], answers: [6]},
    {word: "ГАГАРИН", total: 24, digitMax: 5, extra: 9, fieldLetters: ["Г", "А"], answers: [5, 4]},
    {word: "ЦИОЛКОВСКИЙ", total: 54, digitMax: 8, extra: 18, fieldLetters: ["И", "О", "К"], answers: [5, 6, 7]},
  ] as const;

  if (42 - 36 !== 6) throw new Error("Проверка: 42 − 36 должно быть 6");
  if (24 - 15 !== 9) throw new Error("Проверка: 24 − 15 должно быть 9");
  if (54 - 36 !== 18) throw new Error("Проверка: 54 − 36 должно быть 18");
  if (5 + 4 !== 9) throw new Error("Проверка: Г = 5 и А = 4 должны давать сумму 9");
  if (5 + 6 + 7 !== 18) throw new Error("Проверка: И = 5, О = 6, К = 7 должны давать сумму 18");

  letterDigitsTasks.forEach((task, index) => {
    const check = expected[index];
    if (!check) throw new Error(`Нет эталона для задания ${index + 1}`);
    if (task.letters.join("") !== check.word) {
      throw new Error(`Задание ${index + 1}: запись ${task.letters.join("")}, ожидалось ${check.word}`);
    }
    if (task.letters.some(letter => !LETTER_RE.test(letter))) {
      throw new Error(`Задание ${index + 1}: в записи должны быть только буквы`);
    }
    if (task.total !== check.total) {
      throw new Error(`Задание ${index + 1}: сумма ${task.total}, ожидалось ${check.total}`);
    }
    if (task.digitMax !== check.digitMax) {
      throw new Error(`Задание ${index + 1}: диапазон 1–${task.digitMax}, ожидалось 1–${check.digitMax}`);
    }

    const unique = uniqueLetters(task.letters);
    if (unique.length !== task.digitMax) {
      throw new Error(`Задание ${index + 1}: разных букв ${unique.length}, ожидалось ${task.digitMax}`);
    }

    const counts = countLetters(task.letters);
    const repeated = letterDigitsRepeatedInOrder(task.letters);
    if (repeated.join("") !== check.fieldLetters.join("")) {
      throw new Error(`Задание ${index + 1}: повторы ${repeated.join(", ")}, ожидалось ${check.fieldLetters.join(", ")}`);
    }
    if (repeated.some(letter => counts.get(letter) !== 2)) {
      throw new Error(`Задание ${index + 1}: каждая повторяющаяся буква должна встречаться ровно дважды`);
    }
    if (unique.some(letter => (counts.get(letter) ?? 0) !== (repeated.includes(letter) ? 2 : 1))) {
      throw new Error(`Задание ${index + 1}: буквы без повтора должны встречаться один раз`);
    }

    if (task.fields.length !== check.fieldLetters.length) {
      throw new Error(`Задание ${index + 1}: полей ${task.fields.length}, ожидалось ${check.fieldLetters.length}`);
    }

    const fieldLetters = task.fields.map(field => field.letter);
    if (fieldLetters.join("") !== check.fieldLetters.join("")) {
      throw new Error(`Задание ${index + 1}: поля ${fieldLetters.join(", ")}, ожидалось ${check.fieldLetters.join(", ")}`);
    }

    const answers = task.fields.map(field => field.answer);
    if (answers.join(",") !== check.answers.join(",")) {
      throw new Error(`Задание ${index + 1}: ответы ${answers.join(", ")}, ожидалось ${check.answers.join(", ")}`);
    }
    if (new Set(answers).size !== answers.length) {
      throw new Error(`Задание ${index + 1}: ответы должны быть разными цифрами`);
    }
    if (answers.some(answer => answer < 1 || answer > task.digitMax)) {
      throw new Error(`Задание ${index + 1}: ответы должны быть от 1 до ${task.digitMax}`);
    }

    const baseSum = sumTo(task.digitMax);
    const extra = task.total - baseSum;
    if (extra !== check.extra) {
      throw new Error(`Задание ${index + 1}: ${task.total} − ${baseSum} = ${extra}, ожидалось ${check.extra}`);
    }
    const extraFromAnswers = answers.reduce((sum, answer) => sum + answer, 0);
    if (extraFromAnswers !== extra) {
      throw new Error(`Задание ${index + 1}: сумма ответов ${extraFromAnswers} не равна ${extra}`);
    }

    const taskText = [
      ...task.letters,
      ...task.fields.map(field => field.letter),
      ...task.rules,
      task.prompt,
      task.answerLine,
      ...task.explainLines,
      ...task.searchLines,
    ].join("");
    if (taskText.includes("\u0045")) {
      throw new Error(`Задание ${index + 1}: найдена латинская E вместо русской Е`);
    }
    if (task.explainLines.some(line => /^Ответ:/u.test(line))) {
      throw new Error(`Задание ${index + 1}: строка «Ответ:» должна быть только после «Решение открыто»`);
    }
    const listed = unique.join(", ");
    if (!task.explainLines[0]?.includes(listed)) {
      throw new Error(`Задание ${index + 1}: объяснение должно начинаться с перечисления разных букв`);
    }
    if (!task.explainLines.some(line => line.includes("Сумма этих цифр"))) {
      throw new Error(`Задание ${index + 1}: объяснение должно содержать сумму цифр`);
    }

    const given = Object.fromEntries(task.fields.map(field => [field.letter, String(field.answer)]));
    if (!letterDigitsAnswersMatch(given, task.fields)) {
      throw new Error(`Задание ${index + 1}: проверка не принимает верные цифры`);
    }
    if (letterDigitsAnswersMatch({}, task.fields) || letterDigitsAnswersMatch({[task.fields[0]!.letter]: "0"}, task.fields)) {
      throw new Error(`Задание ${index + 1}: проверка должна отклонять пустой и неверный ввод`);
    }
    if (task.fields.length > 1) {
      const partial = {[task.fields[0]!.letter]: String(task.fields[0]!.answer)};
      if (letterDigitsAnswersMatch(partial, task.fields)) {
        throw new Error(`Задание ${index + 1}: проверка должна требовать все поля`);
      }
    }
  });

  const gagarin = letterDigitsTasks[1];
  const g = gagarin?.fields.find(field => field.letter === "Г")?.answer;
  const a = gagarin?.fields.find(field => field.letter === "А")?.answer;
  if (g == null || a == null || !(g > a)) {
    throw new Error("Задание 2: должно выполняться Г больше А");
  }

  const tsiolkovsky = letterDigitsTasks[2];
  const i = tsiolkovsky?.fields.find(field => field.letter === "И")?.answer;
  const o = tsiolkovsky?.fields.find(field => field.letter === "О")?.answer;
  const k = tsiolkovsky?.fields.find(field => field.letter === "К")?.answer;
  if (i == null || o == null || k == null) {
    throw new Error("Задание 3: нужны ответы для И, О и К");
  }
  if (!(i < o && o < k)) {
    throw new Error("Задание 3: должно выполняться И < О < К");
  }
  if (o !== i + 1 || k !== o + 1) {
    throw new Error("Задание 3: И, О и К должны быть последовательными цифрами");
  }
}

assertLetterDigits();
