export const RUSSIAN_ALPHABET = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

export const alphabetLetters = Array.from(RUSSIAN_ALPHABET);

export type AlphabetCipherTask = {
  codes: number[];
  answer: string;
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

const prepareAnswer = (value: string) => value
  .trim()
  .replace(/\.+$/u, "")
  .toLocaleLowerCase("ru-RU");

export function alphabetCipherAnswersMatch(given: string, answer: string) {
  const prepared = prepareAnswer(given);
  if (prepared === "") return false;
  return prepared === prepareAnswer(answer);
}

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
  {codes: [20, 6, 1, 20, 18], answer: "ТЕАТР"},
  {codes: [18, 1, 12, 6, 20, 1], answer: "РАКЕТА"},
  {codes: [19, 17, 21, 20, 15, 10, 12], answer: "СПУТНИК"},
];

assertAlphabet();
alphabetCipherTasks.forEach(assertTask);
