const RUSSIAN_VOWELS = new Set(["а", "е", "ё", "и", "о", "у", "ы", "э", "ю", "я"]);

export type NoVowelsSource = {
  quote: string;
  acceptedAnswers: string[];
  active: boolean;
  book: string;
  page: string;
  hint: string;
  theme?: string;
};

export type NoVowelsTask = NoVowelsSource & {
  encoded: string;
  hasVowelOnlyWord: boolean;
};

export function encodeNoVowels(phrase: string) {
  let hasVowelOnlyWord = false;
  const encoded = phrase.replace(/[а-яёА-ЯЁa-zA-Z]+/gu, word => {
    let kept = "";
    for (const char of word) {
      if (RUSSIAN_VOWELS.has(char.toLocaleLowerCase("ru-RU"))) continue;
      kept += char;
    }
    if (kept === "") {
      hasVowelOnlyWord = true;
      return "□";
    }
    return kept;
  });
  return {encoded, hasVowelOnlyWord};
}

const cipherKey = (text: string) => encodeNoVowels(text).encoded.replace(/\.+$/u, "");

const prepareAnswer = (value: string) => value
  .trim()
  .replace(/\.+$/u, "")
  .toLocaleLowerCase("ru-RU")
  .replace(/ё/g, "е")
  .replace(/[^а-яa-z\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

export function answersMatch(given: string, acceptedAnswers: string[]) {
  const prepared = prepareAnswer(given);
  if (prepared === "") return false;
  return acceptedAnswers.some(answer => prepareAnswer(answer) === prepared);
}

function assertSameCipher(source: NoVowelsSource) {
  const keys = source.acceptedAnswers.map(cipherKey);
  if (keys.length === 0 || keys.some(key => key !== keys[0])) {
    throw new Error(`Допустимые ответы дают разный шифр: ${source.quote}`);
  }
}

const sources: NoVowelsSource[] = [
  {
    quote: "История московских высоток очень интересна.",
    acceptedAnswers: [
      "История московских высоток очень интересна",
      "История московских высоток очень интересная",
    ],
    active: true,
    book: "Наталия и Василий Волковы, «Московские высотки»",
    page: "PDF-страница 3, печатные страницы 2–3",
    hint: "Так книга начинает рассказ о знаменитых зданиях Москвы.",
  },
  {
    quote: "Шпиль павильона венчает золотая звезда.",
    acceptedAnswers: ["Шпиль павильона венчает золотая звезда"],
    active: true,
    book: "Наталия и Василий Волковы, «ВДНХ»",
    page: "PDF-страница 5, печатные страницы 6–7",
    hint: "Так книга описывает Главный павильон",
  },
  {
    quote: "Отец Наталии Сац был выдумщиком.",
    acceptedAnswers: ["Отец Наталии Сац был выдумщиком"],
    active: true,
    book: "Катерина Антонова, «Наталия Сац. Создатель театра для детей»",
    page: "PDF-страница 4, печатная страница 4",
    hint: "Так книга говорит об Илье Саце, отце Наталии Сац.",
  },
  {
    quote: "Ведь выше этой башни нет во всей Европе!",
    acceptedAnswers: [
      "Ведь выше этой башни нет во всей Европе",
      "Ведь выше той башни нет во всей Европе",
    ],
    active: true,
    theme: "Останкинская телебашня",
    book: "Юлия Егорова, «Останкинская телебашня»",
    page: "PDF-страница 3, печатные страницы 4–5",
    hint: "Речь об Останкинской телебашне",
  },
  {
    quote: "А Константин Циолковский был обыкновенным учителем в небольшом городке.",
    acceptedAnswers: ["Константин Циолковский был обыкновенным учителем"],
    active: true,
    book: "Александр Ткаченко, «Циолковский»",
    page: "PDF-страница 3, печатные страницы 2–3",
    hint: "Так книга сразу отличает Циолковского от Королёва и Гагарина.",
  },
  {
    quote: "Летит в космосе спутник.",
    acceptedAnswers: [
      "Летит в космосе спутник",
      "Летит в космос спутник",
    ],
    active: true,
    book: "Александр Ткаченко, «Летающие звёзды»",
    page: "PDF-страница 3, печатная страница 3",
    hint: "Первая фраза книги о том, что видно на ночном небе.",
  },
];

sources.forEach(assertSameCipher);

export const noVowelsRecords = sources;

export const noVowelsTasks: NoVowelsTask[] = sources.filter(source => source.active).map(source => ({
  ...source,
  ...encodeNoVowels(source.acceptedAnswers[0]),
}));
