export type OddPictureKind = "rockets" | "pennants" | "pavilions";

export type OddPictureTask = {
  kind: OddPictureKind;
  prompt: string;
  note?: string;
  answer: number;
  explainLines: string[];
  searchLines: string[];
};

export function oddPictureAnswersMatch(given: number | null, answer: number) {
  return given === answer;
}

export const ROCKET_PORTHOLES = [2, 2, 3, 2, 2] as const;
export const ROCKET_COMMON_YS = [235, 300] as const;
export const ROCKET_EXTRA_Y = 365;
export const ROCKET_PORTHOLE_R = 14;
export const ROCKET_AXIS_X = 300;

export type Point = {x: number; y: number};

export const PENNANT_TRIANGLE: Point[] = [
  {x: 0, y: -65},
  {x: -45, y: 65},
  {x: 45, y: 65},
];
export const PENNANT_FILLED: Point = {x: -15, y: 10};
export const PENNANT_EMPTY: Point = {x: 15, y: 35};
export const PENNANT_RADIUS = 5;

export type PennantVariant = {reflect: boolean; rotate: number};

export const PENNANT_VARIANTS: PennantVariant[] = [
  {reflect: false, rotate: 0},
  {reflect: true, rotate: 90},
  {reflect: false, rotate: 180},
  {reflect: false, rotate: 270},
  {reflect: false, rotate: 90},
];

export function transformLocal(point: Point, reflect: boolean, degrees: number): Point {
  const x0 = reflect ? -point.x : point.x;
  const y0 = point.y;
  const rad = degrees * Math.PI / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: x0 * cos - y0 * sin,
    y: x0 * sin + y0 * cos,
  };
}

export function toPennantCanvas(point: Point): Point {
  return {x: point.x + 100, y: point.y + 100};
}

export function pennantShape(variant: PennantVariant) {
  return {
    triangle: PENNANT_TRIANGLE.map(point => toPennantCanvas(transformLocal(point, variant.reflect, variant.rotate))),
    filled: toPennantCanvas(transformLocal(PENNANT_FILLED, variant.reflect, variant.rotate)),
    empty: toPennantCanvas(transformLocal(PENNANT_EMPTY, variant.reflect, variant.rotate)),
  };
}

const roundKey = (point: Point) => `${Math.round(point.x * 1000) / 1000},${Math.round(point.y * 1000) / 1000}`;

const shapeKey = (variant: PennantVariant) => {
  const shape = pennantShape(variant);
  return [
    shape.triangle.map(roundKey).sort().join("|"),
    `f:${roundKey(shape.filled)}`,
    `e:${roundKey(shape.empty)}`,
  ].join(";");
};

export function pennantMatchesRotationOfBase(variant: PennantVariant) {
  const key = shapeKey(variant);
  return [0, 90, 180, 270].some(degrees => shapeKey({reflect: false, rotate: degrees}) === key);
}

export const PAVILION_WINDOW_OFFSETS: number[][] = [
  [-60, -20, 20, 60],
  [-70, -30, 30, 70],
  [-50, -15, 15, 50],
  [-65, -25, 25, 65],
  [-60, -20, 30, 60],
];
export const PAVILION_WINDOW_W = 12;
export const PAVILION_WINDOW_H = 26;
export const PAVILION_WINDOW_CY = 135;
export const PAVILION_AXIS_X = 100;

export function pavilionOffsetsSymmetric(offsets: number[]) {
  const reflected = [...offsets].map(value => -value).sort((a, b) => a - b);
  const sorted = [...offsets].sort((a, b) => a - b);
  return reflected.every((value, index) => value === sorted[index]);
}

function assertOddPictures() {
  if (ROCKET_PORTHOLES.filter(count => count === 3).length !== 1 || ROCKET_PORTHOLES[2] !== 3) {
    throw new Error("Ракеты: только вариант 3 должен иметь три иллюминатора");
  }
  if (ROCKET_PORTHOLES.some((count, index) => index !== 2 && count !== 2)) {
    throw new Error("Ракеты: остальные варианты должны иметь два иллюминатора");
  }

  const rotationMatches = PENNANT_VARIANTS.map(pennantMatchesRotationOfBase);
  if (rotationMatches[1] !== false) throw new Error("Вымпелы: вариант 2 не должен совпадать с поворотами базы");
  if ([0, 2, 3, 4].some(index => rotationMatches[index] !== true)) {
    throw new Error("Вымпелы: варианты 1, 3, 4 и 5 должны совпадать с поворотами базы");
  }

  const symmetry = PAVILION_WINDOW_OFFSETS.map(pavilionOffsetsSymmetric);
  if (symmetry[4] !== false) throw new Error("Павильоны: вариант 5 не должен быть симметричным");
  if (symmetry.slice(0, 4).some(value => value !== true)) {
    throw new Error("Павильоны: варианты 1–4 должны быть симметричными");
  }
  if (PAVILION_WINDOW_OFFSETS.some(offsets => offsets.length !== 4)) {
    throw new Error("Павильоны: в каждом варианте ровно четыре окна");
  }
}

assertOddPictures();

export const oddPictureTasks: OddPictureTask[] = [
  {
    kind: "rockets",
    prompt: "Четыре рисунка подчиняются одному правилу",
    answer: 3,
    explainLines: [
      "У четырёх ракет по два иллюминатора",
      "У ракеты №3 три иллюминатора",
      "Лишний рисунок — №3",
    ],
    searchLines: [
      "Сравни одинаковые детали на всех рисунках",
      "Посчитай иллюминаторы у каждой ракеты",
      "Найди правило, которое выполняется у четырёх рисунков",
      "Проверь, что только один рисунок ему не соответствует",
    ],
  },
  {
    kind: "pennants",
    prompt: "Четыре рисунка подчиняются одному правилу",
    note: "Условные вымпелы по теме СССР",
    answer: 2,
    explainLines: [
      "Мысленно повернём все вымпелы остриём вверх",
      "У рисунков №1, №3, №4 и №5 закрашенный кружок окажется слева, а незакрашенный — справа",
      "У рисунка №2 они расположены наоборот",
      "Этот вымпел зеркально отражён",
      "Лишний рисунок — №2",
    ],
    searchLines: [
      "Не выбирай рисунок только потому, что он повёрнут в другую сторону",
      "Мысленно поверни все вымпелы одинаково — остриём вверх",
      "Сравни расположение закрашенного и незакрашенного кружков",
      "Поворот и зеркальное отражение — разные изменения",
      "Проверь, совпадают ли после поворота четыре рисунка",
    ],
  },
  {
    kind: "pavilions",
    prompt: "Четыре рисунка подчиняются одному правилу",
    note: "Условные схемы по мотивам Главного павильона ВДНХ",
    answer: 5,
    explainLines: [
      "Мысленно проведём вертикальную линию через середину здания",
      "У четырёх рисунков окна слева и справа расположены зеркально",
      "На рисунке №5 внутреннее правое окно дальше от середины, чем внутреннее левое",
      "Симметрия нарушена",
      "Лишний рисунок — №5",
    ],
    searchLines: [
      "Сначала проверь количество окон — оно одинаковое",
      "Найди середину здания по башне и шпилю",
      "Сравни окна парами: крайнее левое с крайним правым, внутреннее левое с внутренним правым",
      "У симметричного рисунка парные окна находятся на одинаковом расстоянии от середины",
    ],
  },
];

if (oddPictureTasks.map(task => task.answer).join(",") !== "3,2,5") {
  throw new Error("Ответы «Лишний рисунок» должны быть 3, 2 и 5");
}
if (oddPictureTasks.length !== 3) throw new Error("Нужно три задания");
