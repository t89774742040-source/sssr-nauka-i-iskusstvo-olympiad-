export const RUSSIAN_ALPHABET = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

export const alphabetLetters = Array.from(RUSSIAN_ALPHABET);

export type AlphabetCipherTask = {
  codes: number[];
  answer: string;
  searchLines: string[];
};

export function letterAt(index: number) {
  return alphabetLetters[index - 1];
}

export function alphabetCipherPairs(codes: number[]) {
  return codes.map(code => {
    const letter = letterAt(code);
    if (letter === undefined) throw new Error(`Нет буквы с номером ${code}`);
    return {code, letter};
  });
}

export function decodeAlphabetCipher(codes: number[]) {
  return alphabetCipherPairs(codes).map(pair => pair.letter).join("");
}

export function alphabetCipherLine(codes: number[]) {
  return codes.join("");
}

const prepareAnswer = (value: string) => value
  .trim()
  .replace(/\.+$/u, "")
  .toLocaleLowerCase("ru-RU");

export function alphabetCipherAnswersMatch(given: string, answer: string) {
  const prepared = prepareAnswer(given);
  if (prepared === "") return false;
  return prepared === prepareAnswer(answer);
}

export const alphabetSearchCommon = [
  "Номера букв — от 1 до 33",
  "Ноль не бывает отдельным номером — он входит в 10, 20 или 30",
  "Числа больше 33 не подходят",
  "Если разделить можно по-разному, проверяем варианты и ищем осмысленное слово",
  "Иногда возможны несколько слов — тогда помогает тема задания",
];

function assertAlphabet() {
  if (alphabetLetters.length !== 33) {
    throw new Error(`В алфавите ${alphabetLetters.length} букв, ожидалось 33`);
  }
  if (letterAt(1) !== "А") throw new Error(`А должна быть 1, получено ${letterAt(1) ?? ""}`);
  if (letterAt(7) !== "Ё") throw new Error(`Ё должна быть 7, получено ${letterAt(7) ?? ""}`);
  if (letterAt(33) !== "Я") throw new Error(`Я должна быть 33, получено ${letterAt(33) ?? ""}`);
}

function assertTask(task: AlphabetCipherTask) {
  const decoded = decodeAlphabetCipher(task.codes);
  if (decoded !== task.answer) {
    throw new Error(`Шифр [${task.codes.join(", ")}] → ${decoded}, ожидалось ${task.answer}`);
  }
}

export const alphabetCipherTasks: AlphabetCipherTask[] = [
  {
    codes: [20, 6, 1, 20, 18],
    answer: "ТЕАТР",
    searchLines: [
      "В строке 20612018 два нуля — каждый входит в число 20",
      "Получаем 20 | 61 | 20 | 18",
      "61 больше 33, поэтому разделяем его на 6 и 1",
      "Последние цифры можно прочитать как 18 → Р или 1 | 8 → АЖ",
      "С буквой Р получается слово ТЕАТР",
      "Итог: 20 | 6 | 1 | 20 | 18",
    ],
  },
  {
    codes: [18, 1, 12, 6, 20, 1],
    answer: "РАКЕТА",
    searchLines: [
      "В строке 181126201 ноль входит в число 20",
      "Последние номера 20 | 1 дают ТА",
      "Начало 18 даёт Р, а 1 | 8 даёт АЖ",
      "Выбираем Р и проверяем середину 1126",
      "Разделение 1 | 12 | 6 даёт АКЕ",
      "Соединяем Р + АКЕ + ТА и получаем РАКЕТА",
    ],
  },
  {
    codes: [19, 17, 21, 20, 15, 10, 12],
    answer: "СПУТНИК",
    searchLines: [
      "В строке 19172120151012 каждый ноль входит в двузначный номер",
      "Получаем участки 191721 | 20 | 15 | 10 | 12",
      "В начале пробуем 19 | 17 | 21 — получается СПУ",
      "Оставшиеся номера 20 | 15 | 10 | 12 дают ТНИК",
      "Соединяем части и получаем СПУТНИК",
    ],
  },
];

assertAlphabet();
alphabetCipherTasks.forEach(assertTask);
