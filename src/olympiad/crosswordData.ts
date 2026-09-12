export type CrosswordDirection = "across" | "down";

export type CrosswordEntry = {
  word: string;
  clue: string;
  direction: CrosswordDirection;
  row: number;
  col: number;
  number: number;
  source: string;
  explain: string;
};

export type CrosswordPuzzle = {
  rows: number;
  cols: number;
  entries: CrosswordEntry[];
};

export type CrosswordCell = {
  row: number;
  col: number;
  letter: string;
  number: number | null;
  across: number | null;
  down: number | null;
};

const LETTER_RE = /^[А-ЯЁ]$/u;
const INPUT_LETTER_RE = /[А-ЯЁа-яё]/gu;

export const crosswordSearchCommon = [
  "Сначала отвечай на самые понятные определения",
  "Вписывай слова, в которых уверен",
  "Используй буквы на пересечениях",
  "Проверяй длину слова по количеству клеток",
  "Если слово не подходит к уже открытым буквам, вернись к определению",
];

export const crosswordPuzzles: CrosswordPuzzle[] = [
  {
    rows: 9,
    cols: 7,
    entries: [
      {
        word: "СКАФАНДР",
        clue: "Космический костюм, название которого переводится как «лодка для человека»",
        direction: "down",
        row: 0,
        col: 6,
        number: 1,
        source: "Александр Ткаченко, «Летающие звёзды»; src/StarsRoute.tsx, урок «Что такое „лодка для человека“?»; финальная экспедиция, задание 23",
        explain: "В книге «скафандр» — греческое слово «лодка для человека»: такой костюм нужен, чтобы жить и работать в космосе",
      },
      {
        word: "СПУТНИК",
        clue: "Искусственный аппарат, который движется вокруг Земли",
        direction: "across",
        row: 1,
        col: 0,
        number: 2,
        source: "Александр Ткаченко, «Летающие звёзды»; src/StarsRoute.tsx, урок «Что называют летающими звёздами?»; финальная экспедиция, задание 4",
        explain: "Летающие звёзды в книге — это искусственные спутники Земли, аппараты на орбите",
      },
      {
        word: "ОРБИТА",
        clue: "Путь спутника вокруг планеты",
        direction: "down",
        row: 3,
        col: 1,
        number: 3,
        source: "Александр Ткаченко, «Летающие звёзды»; src/StarsRoute.tsx, урок «Что называют летающими звёздами?»",
        explain: "Каждый спутник летит по своей невидимой дорожке, и эта дорожка называется орбитой",
      },
      {
        word: "РАКЕТА",
        clue: "Летательный аппарат с реактивным двигателем",
        direction: "across",
        row: 4,
        col: 1,
        number: 4,
        source: "Александр Ткаченко, «Циолковский» и «Летающие звёзды»; src/TsiolkovskyRoute.tsx, урок «Почему его считали фантазёром?»; src/StarsRoute.tsx, урок «Как ракета преодолевает притяжение Земли?»",
        explain: "Циолковский доказал, что притяжение Земли преодолеет только ракета — аппарат с реактивным двигателем",
      },
      {
        word: "ЛАЙКА",
        clue: "Первая космическая пассажирка",
        direction: "across",
        row: 8,
        col: 0,
        number: 5,
        source: "Александр Ткаченко, «Летающие звёзды»; src/StarsRoute.tsx, урок «Первая космическая пассажирка»",
        explain: "Первой космической пассажиркой стала собака Лайка: её полёт показал, что в космосе можно жить",
      },
    ],
  },
  {
    rows: 9,
    cols: 9,
    entries: [
      {
        word: "ФУНДАМЕНТ",
        clue: "Нижняя подземная часть Останкинской телебашни",
        direction: "down",
        row: 0,
        col: 3,
        number: 1,
        source: "Юлия Егорова, «Останкинская телебашня»; src/TowerRoute.tsx, урок «Почему башня не падает и качается ли она?»",
        explain: "Фундамент башни заложен чуть более чем на четыре с половиной метра, а держит сооружение огромный вес",
      },
      {
        word: "ВЫСОТКА",
        clue: "Точная подпись московского высотного здания в олимпиадном задании",
        direction: "down",
        row: 1,
        col: 0,
        number: 2,
        source: "Наталия и Василий Волковы, «Московские высотки»; src/App.tsx, маршрут «Московские высотки»; финальная экспедиция, задание 5",
        explain: "В приложении к программе олимпиады такое здание нужно подписать словом «Высотка»",
      },
      {
        word: "НИКИТИН",
        clue: "Фамилия инженера, который спроектировал конструкцию Останкинской телебашни",
        direction: "down",
        row: 1,
        col: 6,
        number: 3,
        source: "Юлия Егорова, «Останкинская телебашня»; src/TowerRoute.tsx, уроки о железобетоне и опорах; финальная экспедиция, задание 32",
        explain: "Николай Васильевич Никитин предложил железобетон и просчитал, как сделать башню прочной",
      },
      {
        word: "ИОФАН",
        clue: "Фамилия архитектора, чей проект Дворца Советов победил в конкурсе",
        direction: "down",
        row: 3,
        col: 8,
        number: 4,
        source: "Наталия и Василий Волковы, «Московские высотки»; src/App.tsx, урок «Дворец, который не построили»",
        explain: "На международный конкурс поступило более ста работ, а победил проект Бориса Иофана",
      },
      {
        word: "ОСТАНКИНО",
        clue: "Район Москвы, который дал название телебашне",
        direction: "across",
        row: 4,
        col: 0,
        number: 5,
        source: "Юлия Егорова, «Останкинская телебашня»; src/TowerRoute.tsx, урок «Почему выбрали Останкино?»",
        explain: "Башню построили в Останкине, рядом с парком ВДНХ, поэтому она стала Останкинской",
      },
      {
        word: "БЕТОН",
        clue: "Материал, которым укрепляли стальной каркас московских высоток",
        direction: "across",
        row: 8,
        col: 1,
        number: 6,
        source: "Наталия и Василий Волковы, «Московские высотки»; src/App.tsx, урок «Каркасная технология и проектирование»",
        explain: "В основе высоток были стальные балки, дополнительно укреплённые бетоном: такая технология называлась каркасной",
      },
    ],
  },
  {
    rows: 12,
    cols: 7,
    entries: [
      {
        word: "ПАВИЛЬОН",
        clue: "Выставочное здание на ВДНХ",
        direction: "down",
        row: 0,
        col: 3,
        number: 1,
        source: "Наталия и Василий Волковы, «ВДНХ»; src/App.tsx, уроки «Почему Выставка стала любимым местом?» и «Главный павильон»",
        explain: "На территории выставки построили множество павильонов: в них показывали достижения, технику и жизнь разных народов",
      },
      {
        word: "ТЕАТР",
        clue: "Учреждение, которое Наталия Сац создавала для детей",
        direction: "across",
        row: 1,
        col: 1,
        number: 2,
        source: "Катерина Антонова, «Наталия Сац. Создатель театра для детей»; src/SatsRoute.tsx; финальная экспедиция, задание 11",
        explain: "Главное дело Наталии Сац — создание театров для детей, от передвижных спектаклей до Детского музыкального театра",
      },
      {
        word: "СМАЛЬТА",
        clue: "Цветное непрозрачное стекло фонтана «Каменный цветок»",
        direction: "down",
        row: 2,
        col: 0,
        number: 3,
        source: "Наталия и Василий Волковы, «ВДНХ»; src/App.tsx, урок «Фонтан „Каменный цветок“»",
        explain: "Металлические конструкции фонтана украсили цветной смальтой — непрозрачным стеклом",
      },
      {
        word: "МУХИНА",
        clue: "Фамилия скульптора композиции «Рабочий и колхозница»",
        direction: "across",
        row: 3,
        col: 0,
        number: 4,
        source: "Наталия и Василий Волковы, «ВДНХ»; src/App.tsx, урок «Рабочий и колхозница»",
        explain: "В конкурсе на скульптуру для парижского павильона победила Вера Мухина",
      },
      {
        word: "МОРОЗКО",
        clue: "Опера, которой в 1965 году открылся Детский музыкальный театр",
        direction: "down",
        row: 5,
        col: 5,
        number: 5,
        source: "Катерина Антонова, «Наталия Сац. Создатель театра для детей»; src/SatsRoute.tsx, урок «1958–1965 годы: снова Москва»",
        explain: "21 ноября 1965 года театр открылся премьерой оперы Михаила Красева «Морозко»",
      },
      {
        word: "КОЛОС",
        clue: "Последнее слово названия фонтана ВДНХ высотой 16 метров",
        direction: "across",
        row: 6,
        col: 2,
        number: 6,
        source: "Наталия и Василий Волковы, «ВДНХ»; src/App.tsx, урок «Фонтан „Золотой колос“»",
        explain: "Фонтан «Золотой колос» имеет высоту 16 метров, украшен золотой мозаикой и стоит посреди пруда",
      },
      {
        word: "БАЖОВ",
        clue: "Фамилия автора сказов, с которыми связан замысел фонтана «Каменный цветок»",
        direction: "across",
        row: 11,
        col: 2,
        number: 7,
        source: "Наталия и Василий Волковы, «ВДНХ»; src/App.tsx, урок «Фонтан „Каменный цветок“»",
        explain: "Идея фонтана пришла скульптору Прокопию Добрынину после чтения сказок Павла Бажова",
      },
    ],
  },
];

export function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

export function entryCells(entry: CrosswordEntry) {
  return Array.from({length: entry.word.length}, (_, index) => ({
    row: entry.row + (entry.direction === "down" ? index : 0),
    col: entry.col + (entry.direction === "across" ? index : 0),
    letter: entry.word[index] ?? "",
  }));
}

export function crosswordSolution(puzzle: CrosswordPuzzle) {
  const letters: Record<string, string> = {};
  for (const entry of puzzle.entries) {
    for (const cell of entryCells(entry)) {
      letters[cellKey(cell.row, cell.col)] = cell.letter;
    }
  }
  return letters;
}

export function crosswordActiveKeys(puzzle: CrosswordPuzzle) {
  return Object.keys(crosswordSolution(puzzle));
}

export function emptyCrosswordGrid(puzzle: CrosswordPuzzle) {
  return Object.fromEntries(crosswordActiveKeys(puzzle).map(key => [key, ""])) as Record<string, string>;
}

export function acceptCrosswordLetter(raw: string) {
  if (raw === "") return "";
  const letters = raw.match(INPUT_LETTER_RE);
  if (!letters) return null;
  return letters[letters.length - 1]!.toLocaleUpperCase("ru-RU");
}

export function crosswordGridFilled(puzzle: CrosswordPuzzle, grid: Record<string, string>) {
  return crosswordActiveKeys(puzzle).every(key => LETTER_RE.test(grid[key] ?? ""));
}

export function crosswordAnswersMatch(puzzle: CrosswordPuzzle, grid: Record<string, string>) {
  const solution = crosswordSolution(puzzle);
  const keys = Object.keys(solution);
  if (keys.length === 0) return false;
  return keys.every(key => grid[key] === solution[key]);
}

export function crosswordWrongKeys(puzzle: CrosswordPuzzle, grid: Record<string, string>) {
  const solution = crosswordSolution(puzzle);
  return Object.keys(solution).filter(key => {
    const given = grid[key] ?? "";
    return given !== "" && given !== solution[key];
  });
}

export function crosswordCellMap(puzzle: CrosswordPuzzle) {
  const cells = new Map<string, CrosswordCell>();
  for (const entry of puzzle.entries) {
    for (const [index, cell] of entryCells(entry).entries()) {
      const key = cellKey(cell.row, cell.col);
      const current = cells.get(key) ?? {
        row: cell.row,
        col: cell.col,
        letter: cell.letter,
        number: null,
        across: null,
        down: null,
      };
      if (index === 0) current.number = entry.number;
      if (entry.direction === "across") current.across = entry.number;
      else current.down = entry.number;
      cells.set(key, current);
    }
  }
  return cells;
}

export function entriesByDirection(puzzle: CrosswordPuzzle, direction: CrosswordDirection) {
  return puzzle.entries
    .filter(entry => entry.direction === direction)
    .slice()
    .sort((a, b) => a.number - b.number);
}

export function entryByNumber(puzzle: CrosswordPuzzle, number: number, direction: CrosswordDirection) {
  return puzzle.entries.find(entry => entry.number === number && entry.direction === direction);
}

function expectedNumbers(puzzle: CrosswordPuzzle) {
  const starts = new Map<string, number[]>();
  for (const entry of puzzle.entries) {
    const key = cellKey(entry.row, entry.col);
    const list = starts.get(key) ?? [];
    list.push(entry.number);
    starts.set(key, list);
  }
  const assigned = new Map<string, number>();
  let next = 1;
  for (let row = 0; row < puzzle.rows; row++) {
    for (let col = 0; col < puzzle.cols; col++) {
      const key = cellKey(row, col);
      if (!starts.has(key)) continue;
      assigned.set(key, next);
      next += 1;
    }
  }
  return assigned;
}

function assertCrosswordData() {
  if (crosswordPuzzles.length !== 3) {
    throw new Error("Нужны три кроссворда");
  }

  const allWords: string[] = [];

  crosswordPuzzles.forEach((puzzle, puzzleIndex) => {
    const label = `Кроссворд ${puzzleIndex + 1}`;
    if (puzzle.entries.length < 5 || puzzle.entries.length > 7) {
      throw new Error(`${label}: нужно 5–7 слов, сейчас ${puzzle.entries.length}`);
    }
    if (puzzle.rows < 1 || puzzle.cols < 1) {
      throw new Error(`${label}: пустая сетка`);
    }

    const hasAcross = puzzle.entries.some(entry => entry.direction === "across");
    const hasDown = puzzle.entries.some(entry => entry.direction === "down");
    if (!hasAcross || !hasDown) {
      throw new Error(`${label}: нужны слова и по горизонтали, и по вертикали`);
    }

    const numbers = new Set<number>();
    const occupancy = new Map<string, string>();
    const owners = new Map<string, CrosswordEntry[]>();

    for (const entry of puzzle.entries) {
      if ([...entry.word].some(letter => !LETTER_RE.test(letter))) {
        throw new Error(`${label}: слово ${entry.word} содержит недопустимый знак`);
      }
      if (entry.word !== entry.word.toLocaleUpperCase("ru-RU")) {
        throw new Error(`${label}: слово ${entry.word} должно быть в верхнем регистре`);
      }
      if (allWords.includes(entry.word)) {
        throw new Error(`${label}: слово ${entry.word} уже использовано`);
      }
      allWords.push(entry.word);

      if (entry.row < 0 || entry.col < 0) {
        throw new Error(`${label}: слово ${entry.word} выходит за сетку`);
      }

      const cells = entryCells(entry);
      if (cells.length !== entry.word.length) {
        throw new Error(`${label}: у ${entry.word} длина не совпадает с клетками`);
      }

      const last = cells[cells.length - 1];
      if (!last || last.row >= puzzle.rows || last.col >= puzzle.cols) {
        throw new Error(`${label}: слово ${entry.word} не помещается в сетку`);
      }

      for (const cell of cells) {
        if (cell.row < 0 || cell.col < 0 || cell.row >= puzzle.rows || cell.col >= puzzle.cols) {
          throw new Error(`${label}: слово ${entry.word} не помещается в сетку`);
        }
        const key = cellKey(cell.row, cell.col);
        const prev = occupancy.get(key);
        if (prev && prev !== cell.letter) {
          throw new Error(`${label}: в клетке ${key} встречаются ${prev} и ${cell.letter}`);
        }
        occupancy.set(key, cell.letter);
        const list = owners.get(key) ?? [];
        list.push(entry);
        owners.set(key, list);
      }

      if (numbers.has(entry.number)) {
        const sameStart = puzzle.entries.some(other => (
          other !== entry
          && other.number === entry.number
          && other.row === entry.row
          && other.col === entry.col
        ));
        if (!sameStart) {
          throw new Error(`${label}: номер ${entry.number} повторяется`);
        }
      }
      numbers.add(entry.number);
    }

    for (const entry of puzzle.entries) {
      const crossed = entryCells(entry).some(cell => (owners.get(cellKey(cell.row, cell.col)) ?? []).length > 1);
      if (!crossed) {
        throw new Error(`${label}: слово ${entry.word} не имеет пересечений`);
      }
    }

    const numbered = expectedNumbers(puzzle);
    for (const entry of puzzle.entries) {
      const expected = numbered.get(cellKey(entry.row, entry.col));
      if (expected !== entry.number) {
        throw new Error(`${label}: у ${entry.word} номер ${entry.number}, по сетке должен быть ${expected ?? "—"}`);
      }
    }

    const solution = crosswordSolution(puzzle);
    if (Object.keys(solution).length !== occupancy.size) {
      throw new Error(`${label}: решение заполняет не только активные клетки`);
    }
    for (const [key, letter] of occupancy) {
      if (solution[key] !== letter) {
        throw new Error(`${label}: решение в клетке ${key} не совпадает с сеткой`);
      }
    }

    const filled = {...solution};
    if (!crosswordGridFilled(puzzle, filled) || !crosswordAnswersMatch(puzzle, filled)) {
      throw new Error(`${label}: проверка не принимает точное заполнение`);
    }

    const empty = emptyCrosswordGrid(puzzle);
    if (crosswordGridFilled(puzzle, empty) || crosswordAnswersMatch(puzzle, empty)) {
      throw new Error(`${label}: пустая сетка не должна считаться решением`);
    }

    const broken = {...filled};
    const firstKey = Object.keys(broken)[0];
    if (firstKey) {
      broken[firstKey] = broken[firstKey] === "А" ? "Б" : "А";
      if (crosswordAnswersMatch(puzzle, broken)) {
        throw new Error(`${label}: проверка приняла сетку с ошибкой`);
      }
      const wrong = crosswordWrongKeys(puzzle, broken);
      if (!wrong.includes(firstKey)) {
        throw new Error(`${label}: ошибочная клетка не найдена`);
      }
    }

    if (crosswordAnswersMatch(puzzle, {})) {
      throw new Error(`${label}: проверка приняла пустой объект`);
    }
  });

  if (new Set(allWords).size !== allWords.length) {
    throw new Error("Ответы кроссвордов должны быть уникальными");
  }
}

assertCrosswordData();
