import rocketData from "./rocket-data.json";

export type Point = {x: number; y: number};

export type FigureShape = {
  id: string;
  points: Point[];
  label: string;
};

export type FigureHighlightStyle = {
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeWidth: number;
};

export type FigureCountTask = {
  prompt: string;
  note?: string;
  drawing?: "grid" | "rocket" | "pavilion" | "pennant";
  reviewHeading?: string;
  reviewLead?: string;
  counterKind?: "figure" | "rectangle" | "triangle";
  width: number;
  height: number;
  verticals: number[];
  horizontals: number[];
  diagonals: Array<[Point, Point]>;
  figures: FigureShape[];
  answer: number;
  explainLines: string[];
  searchLines: string[];
  highlightStyle?: FigureHighlightStyle;
};

export function figureCountAnswersMatch(given: string, answer: number) {
  const trimmed = given.trim();
  if (trimmed === "") return false;
  if (!/^-?\d+$/u.test(trimmed)) return false;
  return Number(trimmed) === answer;
}

const toPoint = (pair: number[]): Point => ({x: pair[0]!, y: pair[1]!});

export const rocketFigures: FigureShape[] = rocketData.figures.map(figure => ({
  id: `rocket-${figure.id}`,
  label: figure.label,
  points: figure.points.map(toPoint),
}));

const rocketSegments: Array<[Point, Point]> = rocketData.segments.map(segment => [toPoint(segment[0]!), toPoint(segment[1]!)]);

export function rectanglesFromLines(verticals: number[], horizontals: number[]) {
  const xs = [...verticals].sort((a, b) => a - b);
  const ys = [...horizontals].sort((a, b) => a - b);
  const rects: Array<{x1: number; y1: number; x2: number; y2: number; cellsW: number; cellsH: number}> = [];
  for (let i = 0; i < xs.length; i += 1) {
    for (let j = i + 1; j < xs.length; j += 1) {
      for (let k = 0; k < ys.length; k += 1) {
        for (let l = k + 1; l < ys.length; l += 1) {
          const x1 = xs[i]!;
          const x2 = xs[j]!;
          const y1 = ys[k]!;
          const y2 = ys[l]!;
          rects.push({
            x1,
            y1,
            x2,
            y2,
            cellsW: (x2 - x1) / 120,
            cellsH: (y2 - y1) / 120,
          });
        }
      }
    }
  }
  return rects;
}

const rectFigure = (id: string, x1: number, y1: number, x2: number, y2: number, label: string): FigureShape => ({
  id,
  label,
  points: [
    {x: x1, y: y1},
    {x: x2, y: y1},
    {x: x2, y: y2},
    {x: x1, y: y2},
  ],
});

const uniqueKeys = (figures: FigureShape[]) => {
  const keys = figures.map(figure => figure.points.map(point => `${point.x},${point.y}`).sort().join("|"));
  return new Set(keys).size === figures.length;
};

const PAVILION_X = [140, 160, 220, 240, 300, 320, 380, 400];
const PAVILION_COLUMN_KEYS = new Set(["140,160", "220,240", "300,320", "380,400"]);
const PAVILION_GAP_KEYS = new Set(["160,220", "240,300", "320,380"]);

const pavilionStripLabel = (x1: number, x2: number, span: number) => {
  if (span === 1) {
    const key = `${x1},${x2}`;
    if (PAVILION_COLUMN_KEYS.has(key)) return "Одна полоса — колонна";
    if (PAVILION_GAP_KEYS.has(key)) return "Одна полоса — промежуток";
  }
  return `Прямоугольник из ${span} соседних полос`;
};

const pavilionFigures: FigureShape[] = [];
(() => {
  let n = 0;
  for (let span = 1; span <= 7; span += 1) {
    for (let i = 0; i + span < PAVILION_X.length; i += 1) {
      const x1 = PAVILION_X[i]!;
      const x2 = PAVILION_X[i + span]!;
      n += 1;
      pavilionFigures.push(rectFigure(`pavilion-${n}`, x1, 260, x2, 400, pavilionStripLabel(x1, x2, span)));
    }
  }
  pavilionFigures.push(rectFigure("pavilion-29", 100, 400, 440, 425, "Нижнее основание"));
  pavilionFigures.push(rectFigure("pavilion-30", 100, 230, 440, 260, "Перекрытие над колоннами"));
  pavilionFigures.push(rectFigure("pavilion-31", 220, 160, 320, 230, "Нижний ярус башни"));
  pavilionFigures.push(rectFigure("pavilion-32", 250, 115, 290, 160, "Верхний ярус башни"));
})();

const rectOutline = (x1: number, y1: number, x2: number, y2: number): Array<[Point, Point]> => [
  [{x: x1, y: y1}, {x: x2, y: y1}],
  [{x: x2, y: y1}, {x: x2, y: y2}],
  [{x: x2, y: y2}, {x: x1, y: y2}],
  [{x: x1, y: y2}, {x: x1, y: y1}],
];

const pavilionSegments: Array<[Point, Point]> = [
  ...rectOutline(100, 400, 440, 425),
  ...rectOutline(100, 230, 440, 260),
  ...rectOutline(220, 160, 320, 230),
  ...rectOutline(250, 115, 290, 160),
  ...PAVILION_X.map(x => [{x, y: 260}, {x, y: 400}] as [Point, Point]),
];

const triangle = (id: string, p1: Point, p2: Point, p3: Point, label: string): FigureShape => ({
  id,
  label,
  points: [p1, p2, p3],
});

const pennantA: Point = {x: 100, y: 100};
const pennantB: Point = {x: 380, y: 100};
const pennantC: Point = {x: 240, y: 420};
const pennantD: Point = {x: 170, y: 260};
const pennantE: Point = {x: 310, y: 260};
const pennantF: Point = {x: 240, y: 100};
const pennantG: Point = {x: 240, y: 260};

const pennantFigures: FigureShape[] = [
  triangle("pennant-1", pennantD, pennantG, pennantC, "Маленький треугольник слева"),
  triangle("pennant-2", pennantG, pennantE, pennantC, "Маленький треугольник справа"),
  triangle("pennant-3", pennantD, pennantE, pennantC, "Нижний треугольник целиком"),
  triangle("pennant-4", pennantA, pennantF, pennantC, "Левая половина вымпела"),
  triangle("pennant-5", pennantF, pennantB, pennantC, "Правая половина вымпела"),
  triangle("pennant-6", pennantA, pennantB, pennantC, "Весь вымпел"),
];

const pennantSegments: Array<[Point, Point]> = [
  [pennantA, pennantB],
  [pennantB, pennantC],
  [pennantC, pennantA],
  [pennantD, pennantE],
  [pennantF, pennantC],
  [{x: 80, y: 60}, {x: 400, y: 60}],
  [{x: 100, y: 60}, pennantA],
  [{x: 380, y: 60}, pennantB],
];

const samePoint = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

const onSegment = (p: Point, a: Point, b: Point) => {
  const cross = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y);
  if (cross !== 0) return false;
  const minX = Math.min(a.x, b.x);
  const maxX = Math.max(a.x, b.x);
  const minY = Math.min(a.y, b.y);
  const maxY = Math.max(a.y, b.y);
  return p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY;
};

const cross3 = (a: Point, b: Point, c: Point) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

const edgeCoveredBySegments = (a: Point, b: Point, segments: Array<[Point, Point]>) => {
  if (samePoint(a, b)) return false;
  const axis: 0 | 1 = a.x !== b.x ? 0 : 1;
  const coord = (point: Point) => (axis === 0 ? point.x : point.y);
  const lo = Math.min(coord(a), coord(b));
  const hi = Math.max(coord(a), coord(b));
  const intervals = segments
    .filter(([c, d]) => cross3(a, b, c) === 0 && cross3(a, b, d) === 0)
    .map(([c, d]) => [Math.min(coord(c), coord(d)), Math.max(coord(c), coord(d))] as const)
    .sort((left, right) => left[0] - right[0]);
  let reach = lo;
  for (const [start, end] of intervals) {
    if (end < reach) continue;
    if (start > reach) return false;
    reach = Math.max(reach, end);
    if (reach >= hi) return true;
  }
  return false;
};

const isAxisRectangle = (points: Point[]) => {
  const xs = new Set(points.map(point => point.x));
  const ys = new Set(points.map(point => point.y));
  return points.length === 4 && xs.size === 2 && ys.size === 2;
};

const properIntersect = (a: Point, b: Point, c: Point, d: Point) => {
  const d1 = cross3(a, b, c);
  const d2 = cross3(a, b, d);
  const d3 = cross3(c, d, a);
  const d4 = cross3(c, d, b);
  return d1 * d2 < 0 && d3 * d4 < 0;
};

const isSimpleQuad = (points: Point[]) => {
  if (points.length !== 4) return false;
  const [p0, p1, p2, p3] = points;
  if (!p0 || !p1 || !p2 || !p3) return false;
  if (new Set([p0, p1, p2, p3].map(point => `${point.x},${point.y}`)).size !== 4) return false;
  const area = Math.abs(
    [p0, p1, p2, p3].reduce((sum, point, index, all) => {
      const next = all[(index + 1) % 4]!;
      return sum + point.x * next.y - next.x * point.y;
    }, 0),
  );
  if (area === 0) return false;
  if (properIntersect(p0, p1, p2, p3) || properIntersect(p1, p2, p3, p0)) return false;
  return [p0, p1, p2, p3].every((point, index) => {
    const prev = [p0, p1, p2, p3][(index + 3) % 4]!;
    const next = [p0, p1, p2, p3][(index + 1) % 4]!;
    return cross3(prev, point, next) !== 0;
  });
};

function assertRocket() {
  if (rocketData.answer !== 19) throw new Error("Ракета: ответ должен быть 19");
  if (rocketData.viewBox.join(" ") !== "0 0 600 600") throw new Error("Ракета: viewBox должен быть 0 0 600 600");
  if (rocketFigures.length !== 19) throw new Error(`Ракета: фигур ${rocketFigures.length}, ожидалось 19`);
  if (!uniqueKeys(rocketFigures)) throw new Error("Ракета: есть дубли контуров");
  const ids = rocketData.figures.map(figure => figure.id);
  if (ids.join(",") !== "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19") {
    throw new Error("Ракета: порядок фигур изменён");
  }
  let rectangles = 0;
  for (const figure of rocketFigures) {
    if (!isSimpleQuad(figure.points)) throw new Error(`Ракета: ${figure.id} не простой четырёхугольник`);
    const [p1, p2, p3, p4] = figure.points;
    const sides: Array<[Point, Point]> = [[p1!, p2!], [p2!, p3!], [p3!, p4!], [p4!, p1!]];
    for (const [start, end] of sides) {
      if (!edgeCoveredBySegments(start, end, rocketSegments)) {
        throw new Error(`Ракета: сторона ${figure.id} не лежит на линиях рисунка`);
      }
    }
    if (isAxisRectangle(figure.points)) rectangles += 1;
  }
  if (rectangles !== 18) throw new Error(`Ракета: прямоугольников ${rectangles}, ожидалось 18`);
  const trapezoids = rocketFigures.filter(figure => !isAxisRectangle(figure.points));
  if (trapezoids.length !== 1 || trapezoids[0]?.id !== "rocket-12") {
    throw new Error("Ракета: должна быть одна трапеция — сопло");
  }
  const groups = rocketData.groups;
  if (
    groups["Корпус и пространство под ним"] !== 10
    || groups["Окно"] !== 1
    || groups["Сопло"] !== 1
    || groups["Верхняя плита площадки"] !== 1
    || groups["Опоры площадки"] !== 6
  ) {
    throw new Error("Ракета: группы 10 + 1 + 1 + 1 + 6 не сходятся");
  }
}

function assertPavilion() {
  const pairCount = PAVILION_X.length * (PAVILION_X.length - 1) / 2;
  if (pairCount !== 28) throw new Error(`Павильон: пар вертикалей ${pairCount}, ожидалось 28`);
  if (pavilionFigures.length !== 32) throw new Error(`Павильон: фигур ${pavilionFigures.length}, ожидалось 32`);
  if (!uniqueKeys(pavilionFigures)) throw new Error("Павильон: есть дубли контуров");
  const ids = pavilionFigures.map(figure => figure.id);
  const expectedIds = Array.from({length: 32}, (_, i) => `pavilion-${i + 1}`);
  if (ids.join(",") !== expectedIds.join(",")) throw new Error("Павильон: порядок фигур изменён");

  const stripKeys = new Set<string>();
  for (let i = 0; i < PAVILION_X.length; i += 1) {
    for (let j = i + 1; j < PAVILION_X.length; j += 1) {
      stripKeys.add(`${PAVILION_X[i]},260,${PAVILION_X[j]},400`);
    }
  }
  const listedStrips = pavilionFigures.slice(0, 28).map(figure => {
    const xs = figure.points.map(point => point.x);
    const ys = figure.points.map(point => point.y);
    return `${Math.min(...xs)},${Math.min(...ys)},${Math.max(...xs)},${Math.max(...ys)}`;
  });
  if (listedStrips.length !== 28 || listedStrips.some(key => !stripKeys.has(key))) {
    throw new Error("Павильон: 28 контуров колонн не совпадают с парами вертикалей");
  }

  const singles = pavilionFigures.slice(0, 7);
  const columnLabels = singles.filter(figure => figure.label === "Одна полоса — колонна");
  const gapLabels = singles.filter(figure => figure.label === "Одна полоса — промежуток");
  if (columnLabels.length !== 4 || gapLabels.length !== 3) {
    throw new Error("Павильон: среди узких полос должно быть 4 колонны и 3 промежутка");
  }

  for (const figure of pavilionFigures) {
    if (!isSimpleQuad(figure.points) || !isAxisRectangle(figure.points)) {
      throw new Error(`Павильон: ${figure.id} не прямоугольник`);
    }
    const [p1, p2, p3, p4] = figure.points;
    const sides: Array<[Point, Point]> = [[p1!, p2!], [p2!, p3!], [p3!, p4!], [p4!, p1!]];
    for (const [start, end] of sides) {
      if (!edgeCoveredBySegments(start, end, pavilionSegments)) {
        throw new Error(`Павильон: сторона ${figure.id} не лежит на линиях рисунка`);
      }
    }
  }
}

function assertPennant() {
  if (pennantFigures.length !== 6) throw new Error(`Вымпел: фигур ${pennantFigures.length}, ожидалось 6`);
  if (!uniqueKeys(pennantFigures)) throw new Error("Вымпел: есть дубли контуров");
  if (pennantFigures.map(figure => figure.id).join(",") !== "pennant-1,pennant-2,pennant-3,pennant-4,pennant-5,pennant-6") {
    throw new Error("Вымпел: порядок фигур изменён");
  }

  const vertices: Point[] = [];
  const addVertex = (point: Point) => {
    if (!vertices.some(existing => samePoint(existing, point))) vertices.push(point);
  };
  for (const [start, end] of pennantSegments) {
    addVertex(start);
    addVertex(end);
  }
  for (let i = 0; i < pennantSegments.length; i += 1) {
    for (let j = i + 1; j < pennantSegments.length; j += 1) {
      const [a, b] = pennantSegments[i]!;
      const [c, d] = pennantSegments[j]!;
      const den = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
      if (den === 0) continue;
      const t = ((c.x - a.x) * (d.y - c.y) - (c.y - a.y) * (d.x - c.x)) / den;
      const hit = {
        x: Math.round(a.x + t * (b.x - a.x)),
        y: Math.round(a.y + t * (b.y - a.y)),
      };
      if (onSegment(hit, a, b) && onSegment(hit, c, d)) addVertex(hit);
    }
  }

  const found: string[] = [];
  for (let i = 0; i < vertices.length; i += 1) {
    for (let j = i + 1; j < vertices.length; j += 1) {
      for (let k = j + 1; k < vertices.length; k += 1) {
        const p1 = vertices[i]!;
        const p2 = vertices[j]!;
        const p3 = vertices[k]!;
        if (cross3(p1, p2, p3) === 0) continue;
        if (
          edgeCoveredBySegments(p1, p2, pennantSegments)
          && edgeCoveredBySegments(p2, p3, pennantSegments)
          && edgeCoveredBySegments(p3, p1, pennantSegments)
        ) {
          found.push([p1, p2, p3].map(point => `${point.x},${point.y}`).sort().join("|"));
        }
      }
    }
  }
  if (new Set(found).size !== 6) {
    throw new Error(`Вымпел: перебор по линиям дал ${new Set(found).size}, ожидалось 6`);
  }

  const listed = new Set(pennantFigures.map(figure => figure.points.map(point => `${point.x},${point.y}`).sort().join("|")));
  if (listed.size !== 6 || [...listed].some(key => !found.includes(key))) {
    throw new Error("Вымпел: подсветки не совпадают с перебором треугольников");
  }

  for (const figure of pennantFigures) {
    const [p1, p2, p3] = figure.points;
    if (!p1 || !p2 || !p3) throw new Error(`Вымпел: ${figure.id} неполный`);
    if (samePoint(p1, p2) || samePoint(p2, p3) || samePoint(p1, p3)) {
      throw new Error(`Вымпел: ${figure.id} вырожден`);
    }
    if (cross3(p1, p2, p3) === 0) throw new Error(`Вымпел: ${figure.id} коллинеарен`);
    if (
      !edgeCoveredBySegments(p1, p2, pennantSegments)
      || !edgeCoveredBySegments(p2, p3, pennantSegments)
      || !edgeCoveredBySegments(p3, p1, pennantSegments)
    ) {
      throw new Error(`Вымпел: сторона ${figure.id} не лежит на линиях рисунка`);
    }
  }
}

assertRocket();
assertPavilion();
assertPennant();

export const figureCountTasks: FigureCountTask[] = [
  {
    prompt: rocketData.prompt,
    drawing: "rocket",
    width: 600,
    height: 600,
    verticals: [],
    horizontals: [],
    diagonals: [],
    figures: rocketFigures,
    answer: rocketData.answer,
    explainLines: [...rocketData.solution],
    searchLines: [...rocketData.searchLogic],
    highlightStyle: {
      fill: rocketData.highlightInstructions.fill,
      fillOpacity: rocketData.highlightInstructions.fillOpacity,
      stroke: rocketData.highlightInstructions.stroke,
      strokeWidth: rocketData.highlightInstructions.strokeWidth,
    },
  },
  {
    prompt: "Сколько прямоугольников на рисунке?",
    note: "Условная схема по мотивам Главного павильона ВДНХ",
    drawing: "pavilion",
    reviewHeading: "Разбор решения",
    reviewLead: "На рисунке 32 прямоугольника — посмотри каждый из них",
    counterKind: "rectangle",
    width: 540,
    height: 450,
    verticals: [],
    horizontals: [],
    diagonals: [],
    figures: pavilionFigures,
    answer: 32,
    explainLines: [
      "Между перекрытием и основанием видны семь вертикальных полос — четыре колонны и три промежутка",
      "Промежутки тоже считаются: их границы образуют прямоугольники",
      "Из одной полосы получается 7 прямоугольников",
      "Из двух соседних полос — 6",
      "Из трёх — 5, из четырёх — 4",
      "Из пяти — 3, из шести — 2, из всех семи — 1",
      "Всего в этой части: 7 + 6 + 5 + 4 + 3 + 2 + 1 = 28",
      "Ещё считаем основание, перекрытие и два яруса башни — 4 прямоугольника",
      "Всего: 28 + 4 = 32",
    ],
    searchLines: [
      "Ищи замкнутые фигуры с четырьмя прямыми углами",
      "Считай не только детали здания, но и фигуры в промежутках между ними",
      "Сначала считай самые узкие прямоугольники слева направо",
      "Затем объединяй соседние полосы по две, по три и так далее",
      "Внутренние линии не мешают считать большой прямоугольник",
      "После колонн отдельно проверь основание, перекрытие и башню",
      "Не продолжай линии через пустые места",
      "Шпиль и звезда не являются прямоугольниками",
    ],
    highlightStyle: {
      fill: rocketData.highlightInstructions.fill,
      fillOpacity: rocketData.highlightInstructions.fillOpacity,
      stroke: rocketData.highlightInstructions.stroke,
      strokeWidth: rocketData.highlightInstructions.strokeWidth,
    },
  },
  {
    prompt: "Сколько треугольников на рисунке?",
    note: "Вымпел «СССР»",
    drawing: "pennant",
    reviewHeading: "Разбор решения",
    reviewLead: "На рисунке 6 треугольников — посмотри каждый из них",
    counterKind: "triangle",
    width: 480,
    height: 460,
    verticals: [],
    horizontals: [],
    diagonals: [],
    figures: pennantFigures,
    answer: 6,
    explainLines: [
      "Внизу находятся два маленьких треугольника — слева и справа",
      "Вместе они образуют ещё один треугольник",
      "Левая половина всего вымпела — тоже треугольник",
      "Правая половина — ещё один",
      "Не забудь весь внешний треугольник",
      "Всего: 2 + 1 + 2 + 1 = 6",
    ],
    searchLines: [
      "Начни с самых маленьких треугольников",
      "Затем ищи большие фигуры, составленные из нескольких частей",
      "Линии внутри треугольника не мешают считать его целиком",
      "Мысленно обведи контур: должно получиться ровно три прямые стороны",
      "Верхние отдельные части не подходят — у каждой четыре стороны",
      "Не забудь внешний контур всего вымпела",
      "Считай каждую фигуру только один раз",
    ],
    highlightStyle: {
      fill: rocketData.highlightInstructions.fill,
      fillOpacity: rocketData.highlightInstructions.fillOpacity,
      stroke: rocketData.highlightInstructions.stroke,
      strokeWidth: rocketData.highlightInstructions.strokeWidth,
    },
  },
];

figureCountTasks.forEach(task => {
  if (task.figures.length !== task.answer) {
    throw new Error(`${task.prompt}: подсветок ${task.figures.length}, ответ ${task.answer}`);
  }
});

if (figureCountTasks.map(task => task.answer).join(",") !== "19,32,6") {
  throw new Error("Ответы тренировки должны быть 19, 32 и 6");
}
