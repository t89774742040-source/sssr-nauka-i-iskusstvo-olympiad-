import { useMemo, useState, type ReactNode } from "react";
import RouteWorkshop, { type WorkshopData } from "./RouteWorkshop";

type Page = "plan" | "lesson" | "mini" | "workshop" | "cards" | "final";
type Lesson = { title: string; text: string; fact: string };
type Question = { title: string; options: string[]; answer: number };

const partTitles = [
  "Кто он",
  "Детство и Москва",
  "Чудак и ракета",
  "К звёздам",
] as const;

const partTags = [
  "Памятник и учитель",
  "Скарлатина и библиотека",
  "Опыты и расчёт",
  "Города и зеркала",
] as const;

const lessons: Lesson[] = [
  {
    title: "Памятник в Калуге",
    text: "В Калуге стоит необычный памятник: ракета и бородатый человек. Это не Сергей Королёв — инженер, который создал первую ракету, вышедшую в открытый космос. И не Юрий Гагарин — первый космонавт Земли. Это Константин Эдуардович Циолковский. Он ни разу не поднимался в воздух даже на самолёте. Дорогу к звёздам открыли его идеи.",
    fact: "Памятник в Калуге — ракета и бородатый человек; Королёв — первая ракета в открытый космос; Гагарин — первый космонавт; Циолковский ни разу не летал даже на самолёте.",
  },
  {
    title: "Учитель, к которому приезжали",
    text: "Циолковский был обыкновенным учителем в небольшом городке. Сергей Павлович Королёв и Юрий Алексеевич Гагарин считали за честь побывать в его маленьком домике на берегу реки. В Москве возле Музея космонавтики ему тоже стоит памятник: взлетающая ракета и учитель, который смотрит на её полёт.",
    fact: "Обыкновенный учитель; Королёв и Гагарин бывали в его домике на берегу реки; в Москве возле Музея космонавтики — памятник с ракетой.",
  },
  {
    title: "Почему его считали фантазёром",
    text: "Современники часто называли Циолковского фантазёром и чудаком. Диплома о высшем образовании у него не было: в университете он не учился. Научные работы почти не публиковал и на конференции в Москву и Петербург не ездил. Техники для космического полёта тогда ещё не существовало. Но простой калужский учитель уже придумал ракету — летательный аппарат с реактивным двигателем.",
    fact: "Современники считали фантазёром; не было диплома; почти не публиковался; ракета — аппарат с реактивным двигателем.",
  },
  {
    title: "Скарлатина и глухота",
    text: "В десять лет Костя заболел скарлатиной. Болезнь дала тяжёлое осложнение на уши, и он почти целиком утратил слух. Учиться вместе с другими детьми уже не мог: не слышал учителя. Многие бы сдались, а он часами занимался дома — решал задачи, рисовал чертежи, запоминал формулы.",
    fact: "В десять лет — скарлатина; почти целиком утратил слух; учиться со всеми не мог; занимался дома.",
  },
  {
    title: "Москва, хлеб и библиотека",
    text: "В шестнадцать лет Константин приехал в Москву. Ни в каком институте он не учился: три года сам занимался в Румянцевской библиотеке — сейчас это Российская государственная библиотека. Раз в три дня покупал чёрного хлеба на девять копеек и запивал водой. Деньги берёг на книги и опыты. За три года без профессоров освоил сложные университетские курсы.",
    fact: "В шестнадцать лет — Москва; ни в каком институте не учился; три года в Румянцевской библиотеке; чёрный хлеб на девять копеек и вода.",
  },
  {
    title: "Экзамен и любимый учитель",
    text: "Закончив обучение, он блестяще сдал экзамен на звание учителя уездных школ и получил право преподавать арифметику, физику и геометрию. Из-за глухоты давал только письменные задания и проверял тетради. На уроках летали модели аэростатов, сверкали рукотворные молнии, гремели искусственные громы, на столе плясали бумажные куколки, а электрический осьминог хватал за пальцы и нос. За учительское дело его наградили двумя орденами. Дети такого учителя очень любили.",
    fact: "Экзамен на учителя уездных школ; арифметика, физика и геометрия; письменные задания; аэростаты, молнии, громы, бумажные куколки, электрический осьминог; два ордена.",
  },
  {
    title: "Коньки, мотоцикл и «слухачи»",
    text: "Окружающим его привычки казались странными. Зимой Константин катался на коньках с раскрытым зонтом, и городовой принимал его за чудака. Сам собрал велосипед, потом самодельный мотоцикл и однажды врезался в орешник. Чтобы лучше слышать, мастерил «слухачи» — железные воронки: таких труб у него было больше десятка. Так дома он общался со своей женой и детьми.",
    fact: "Коньки с зонтом; городовой; велосипед и самодельный мотоцикл; врезался в орешник; «слухачи» — железные воронки, больше десятка; жена и семеро детей.",
  },
  {
    title: "Шарик и ракета",
    text: "Надуй обыкновенный шарик и отпусти, не завязывая хвостик: выходящий воздух толкает его вперёд. Это и есть реактивное движение. Ракету толкает уже не воздух, а струя раскалённого газа. И летит она не как попало, а по строго рассчитанному курсу.",
    fact: "Шарик — простейший реактивный двигатель; ракету толкает струя раскалённого газа; полёт по строго рассчитанному курсу.",
  },
  {
    title: "Восемь километров в секунду",
    text: "Земля притягивает к себе всё. Чтобы выйти за пределы этого притяжения, корабль должен разогнаться примерно до восьми километров в секунду — почти до 29 тысяч километров в час. Раньше ракеты запускали только для фейерверков и салютов. Циолковский доказал: именно ракета откроет людям дорогу к звёздам.",
    fact: "8 км/с — почти 29 000 км/ч; раньше ракеты — для фейерверков и салютов; доказал необходимость ракеты для полёта в космос.",
  },
  {
    title: "Города во Вселенной",
    text: "Ракета была для него средством открыть человечеству дорогу к звёздам. Он считал, что обитатели Земли смогут расселиться по всей Вселенной и жить в целых космических городах. Придумывал, чем люди будут питаться и как восстанавливать запасы воды и воздуха. Почти все эти идеи потом использовали при создании орбитальных станций, где космонавты живут долгое время.",
    fact: "Дорога к звёздам; города в космическом пространстве; вода и воздух; орбитальные станции.",
  },
  {
    title: "Зеркальные пластинки",
    text: "В космосе Солнце нагревает металлический корпус ракеты до трёхсот градусов: живому существу такое не пережить. Циолковский предложил покрывать корабли тонкими зеркальными пластинками. Лучи отражаются, ракета остаётся холодной, а с Земли корпус кажется маленькой сверкающей звёздочкой.",
    fact: "Солнце нагревает корпус до 300 градусов; зеркальные пластинки отражают лучи; ракета остаётся холодной.",
  },
  {
    title: "Отец космонавтики",
    text: "Циолковского по праву называют отцом космонавтики. Он стриг на крыльце ребятишек со всей улицы и запускал для них воздушных змеев. Однажды разбросал по комнате светящиеся гнилушки — и в темноте получилось звёздное небо. Сам он не успел воплотить свои идеи, но они стали основой для учёных и инженеров, которые пришли после него.",
    fact: "Отец космонавтики; стриг ребят на крыльце; воздушные змеи; гнилушки — как звёздное небо; идеи стали основой для последователей.",
  },
];

const miniTours: Question[][] = [
  [
    { title: "Кого изображает памятник в Калуге?", options: ["Циолковского рядом с ракетой", "Первого космонавта Земли", "Инженера первой космической ракеты"], answer: 0 },
    { title: "Кто создал первую ракету, вышедшую в открытый космос?", options: ["Сергей Королёв", "Юрий Гагарин", "Константин Циолковский"], answer: 0 },
    { title: "Кто стал первым космонавтом Земли?", options: ["Юрий Гагарин", "Сергей Королёв", "Константин Циолковский"], answer: 0 },
    { title: "Летал ли Циолковский на самолёте?", options: ["Ни разу даже на самолёте", "Один раз вокруг Земли", "Только на воздушном шаре"], answer: 0 },
    { title: "Где Королёв и Гагарин бывали у Циолковского?", options: ["В его домике на берегу реки", "В Румянцевской библиотеке", "На орбитальной станции"], answer: 0 },
  ],
  [
    { title: "После какой болезни он почти полностью потерял слух?", options: ["После скарлатины", "После кори", "После гриппа"], answer: 0 },
    { title: "В каком возрасте он потерял слух?", options: ["В десять лет", "В шестнадцать лет", "В три года"], answer: 0 },
    { title: "В каком возрасте он приехал в Москву?", options: ["В шестнадцать лет", "В десять лет", "В семь лет"], answer: 0 },
    { title: "Где он самостоятельно занимался в Москве?", options: ["В Румянцевской библиотеке", "В Московском университете", "В лётном училище"], answer: 0 },
    { title: "Сколько стоил хлеб, который он покупал в Москве?", options: ["Девять копеек", "Три рубля", "Двадцать копеек"], answer: 0 },
  ],
  [
    { title: "Что Циолковский называл «слухачами»?", options: ["Железные воронки", "Воздушные змеи", "Зеркальные пластинки"], answer: 0 },
    { title: "Сколько детей было в его семье?", options: ["Семеро", "Двое", "Десятеро"], answer: 0 },
    { title: "Что происходит, если отпустить незавязанный шарик?", options: ["Выходящий воздух толкает шарик вперёд", "Шарик падает камнем вниз", "Шарик летит только там, где нет воздуха"], answer: 0 },
    { title: "До какой скорости нужно разогнаться, чтобы выйти за пределы земного притяжения?", options: ["8 км/с — почти 29 000 км/ч", "8 км/с — 800 км/ч", "8 км/с — 29 км/ч"], answer: 0 },
    { title: "Для чего раньше запускали ракеты?", options: ["Для фейерверков и салютов", "Для полётов на Луну", "Для перевозки хлеба"], answer: 0 },
  ],
  [
    { title: "О чём думал Циолковский кроме самого полёта?", options: ["О городах во Вселенной и орбитальных станциях", "О строительстве московских высоток", "О театре для детей"], answer: 0 },
    { title: "Зачем покрывать корабль зеркальными пластинками?", options: ["Чтобы лучи отражались и ракета оставалась холодной", "Чтобы нагреть ракету до 300 градусов", "Чтобы ракета стала воздушным шаром"], answer: 0 },
    { title: "Как называют Циолковского?", options: ["Отец космонавтики", "Первый космонавт Земли", "Создатель первой ракеты, вышедшей в космос"], answer: 0 },
    { title: "Что в темноте дало впечатление звёздного неба?", options: ["Гнилушки", "Фейерверки", "Электрический осьминог"], answer: 0 },
    { title: "Сколько орденов он получил за учительское дело?", options: ["Два ордена", "Семь орденов", "Десять орденов"], answer: 0 },
  ],
];

const finalQuestions: Question[] = [
  { title: "Как нужно подписать портрет учёного в олимпиадном задании?", options: ["Циолковский", "Королёв", "Гагарин"], answer: 0 },
  { title: "Кем работал Циолковский?", options: ["Учителем арифметики, физики и геометрии", "Инженером первой космической ракеты", "Первым космонавтом Земли"], answer: 0 },
  { title: "Какая последовательность верна?", options: ["Скарлатина — Москва — экзамен на учителя — идея ракеты", "Экзамен на учителя — скарлатина — первый полёт", "Полёт в космос — институт — работа учителем"], answer: 0 },
  { title: "Где Циолковский самостоятельно занимался в Москве?", options: ["В Румянцевской библиотеке", "В Московском университете", "В техническом училище"], answer: 0 },
  { title: "Сколько лет он занимался в московской библиотеке?", options: ["Три года", "Десять лет", "Один месяц"], answer: 0 },
  { title: "Что означает опыт с шариком?", options: ["Выходящий воздух толкает шарик вперёд — это реактивное движение", "Шарик становится невесомым", "Двигаться можно только в воздухе"], answer: 0 },
  { title: "Какую роль выполнял Сергей Королёв?", options: ["Создал первую ракету, вышедшую в открытый космос", "Доказал необходимость ракеты", "Стал первым космонавтом Земли"], answer: 0 },
  { title: "До какой скорости должен разогнаться корабль, чтобы выйти в космос?", options: ["8 км/с — почти 29 000 км/ч", "8 км/с — 800 км/ч", "8 км/с — 29 км/ч"], answer: 0 },
  { title: "Что Циолковский называл «слухачами»?", options: ["Железные воронки", "Модели ракет", "Зеркальные пластинки"], answer: 0 },
  { title: "Найди верное соответствие.", options: ["Циолковский — доказал необходимость ракеты; Королёв — первая ракета в космос; Гагарин — первый космонавт", "Циолковский — первый космонавт; Королёв — учитель; Гагарин — конструктор ракеты", "Циолковский — создатель первой ракеты в космосе; Королёв — фантазёр; Гагарин — библиотекарь"], answer: 0 },
];

const finalMiniQuestions: Question[] = [
  { title: "Летал ли Циолковский на самолёте?", options: ["Ни разу даже на самолёте", "Один раз вокруг Земли", "Только вместе с Гагариным"], answer: 0 },
  { title: "Сколько стоил хлеб, который он покупал в Москве?", options: ["Девять копеек", "Три года", "300 градусов"], answer: 0 },
  { title: "Сколько «слухачей» он смастерил?", options: ["Больше десятка", "Два", "Семь"], answer: 0 },
  { title: "Сколько детей было в его семье?", options: ["Семеро", "Трое", "Десятеро"], answer: 0 },
  { title: "Для чего раньше запускали ракеты?", options: ["Для фейерверков и салютов", "Для полётов на орбитальные станции", "Для перевозки книг"], answer: 0 },
  { title: "До какой температуры Солнце нагревает корпус ракеты в космосе?", options: ["До 300 градусов", "До 8 градусов", "До 29 градусов"], answer: 0 },
  { title: "Как называют Циолковского?", options: ["Отец космонавтики", "Первый космонавт Земли", "Городовой"], answer: 0 },
  { title: "Что в темноте дало впечатление звёздного неба?", options: ["Гнилушки", "Зеркальные пластинки", "Фейерверки"], answer: 0 },
  { title: "Сколько орденов он получил за учительское дело?", options: ["Два ордена", "Семь орденов", "Девять орденов"], answer: 0 },
  { title: "Почему современники считали его фантазёром?", options: ["Техники для космических идей ещё не было", "Он не интересовался наукой", "Он утверждал, что ракете не нужен двигатель"], answer: 0 },
];

function mixQuestion(question: Question): Question {
  const variants = question.options.map((text, index) => ({ text, right: index === question.answer }));
  for (let index = variants.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [variants[index], variants[swap]] = [variants[swap], variants[index]];
  }
  return { title: question.title, options: variants.map(item => item.text), answer: variants.findIndex(item => item.right) };
}

const cards = [
  ["Кем работал Циолковский?", "Учителем арифметики, физики и геометрии"],
  ["В каком возрасте он потерял слух?", "В десять лет после скарлатины"],
  ["Где он самостоятельно учился в Москве?", "В Румянцевской библиотеке"],
  ["Сколько лет он занимался в московской библиотеке?", "Три года"],
  ["На что он тратил девять копеек в Москве?", "На хлеб; воду пил, а деньги берёг на книги и опыты"],
  ["Что Циолковский называл «слухачами»?", "Железные воронки; таких труб было больше десятка"],
  ["До какой скорости нужно разогнаться, чтобы выйти в космос?", "8 км/с — почти 29 000 км/ч"],
  ["Для чего раньше запускали ракеты?", "Для фейерверков и салютов"],
  ["Кто создал первую ракету, вышедшую в открытый космос?", "Сергей Королёв"],
  ["Кто стал первым космонавтом Земли?", "Юрий Гагарин"],
  ["Зачем корабль покрывают зеркальными пластинками?", "Чтобы солнечные лучи отражались и ракета оставалась холодной"],
  ["Как называют Циолковского?", "Отец космонавтики"],
  ["Сколько детей было в его семье?", "Семеро"],
];

const workshopData: WorkshopData = {
  route: "Циолковский",
  image: "./assets/tsiolkovsky-portrait.png",
  imageAlt: "Константин Эдуардович Циолковский",
  identifyPrompt: "Как нужно подписать это изображение в олимпиадном задании?",
  identifyAnswer: "Циолковский",
  matchPrompt: "Выбери верное соответствие ролей.",
  matchOptions: [
    "Циолковский — доказал необходимость ракеты; Королёв — первая ракета в космос; Гагарин — первый космонавт",
    "Циолковский — первый космонавт; Королёв — учитель; Гагарин — конструктор ракеты",
    "Циолковский — создатель первой ракеты в космосе; Королёв — фантазёр; Гагарин — библиотекарь",
  ],
  matchAnswer: 0,
  events: [
    ["space", "Доказал необходимость ракеты для полёта в космос"],
    ["illness", "В десять лет потерял слух после скарлатины"],
    ["teacher", "Сдал экзамен и получил право работать учителем"],
    ["moscow", "В шестнадцать лет приехал учиться в Москву"],
  ],
  correctOrder: ["illness", "moscow", "teacher", "space"],
  errorStatements: [
    "В десять лет Циолковский почти полностью потерял слух после скарлатины.",
    "В Москве Циолковский стал студентом технического училища.",
    "Он самостоятельно занимался в Румянцевской библиотеке.",
    "Циолковский был первым человеком, полетевшим в космос.",
  ],
  errorIndexes: [1, 3],
  anagramPrompt: "Составь слово из перемешанных букв.",
  anagramLetters: "О • К • Й • И • В • Л • Ц • О • С • К • И",
  anagramAnswer: "Циолковский",
  crossword: [
    ["Город, где стоит памятник с ракетой", "КАЛУГА"],
    ["Основная профессия Циолковского", "УЧИТЕЛЬ"],
    ["Главное место его самостоятельной учёбы в Москве", "БИБЛИОТЕКА"],
    ["Что Константин предложил отправить в космос вместо фейерверка?", "РАКЕТА"],
  ],
  allowBackNavigation: true,
  individualCrosswordFeedback: true,
};

const tsiolkovskyKeyFacts = [
  "Константин Эдуардович Циолковский",
  "Сергей Королёв",
  "Юрий Гагарин",
  "Румянцевской библиотеке",
  "Румянцевской библиотеки",
  "открытый космос",
  "открытый космос",
  "первый космонавт Земли",
  "первый космонавт",
  "даже на самолёте",
  "домике на берегу реки",
  "Музея космонавтики",
  "не было диплома",
  "почти не печатал",
  "В десять лет",
  "в десять лет",
  "скарлатиной",
  "скарлатины",
  "почти полностью потерял слух",
  "В шестнадцать лет",
  "в шестнадцать лет",
  "Три года",
  "три года",
  "девять копеек",
  "учителя уездных школ",
  "арифметику, физику и геометрию",
  "письменные задания",
  "электрического осьминога",
  "бумажные куколки",
  "остаётся холодной",
  "трёхсот градусов",
  "Российская государственная библиотека",
  "чёрного хлеба",
  "реактивным двигателем",
  "реактивное движение",
  "два ордена",
  "железные воронки",
  "больше десятка",
  "семеро детей",
  "восьми километров в секунду",
  "29 тысяч километров в час",
  "29 000 км/ч",
  "фейерверков и салютов",
  "орбитальные станции",
  "Зеркальные пластинки",
  "зеркальные пластинки",
  "300 градусов",
  "отцом космонавтики",
  "Отец космонавтики",
  "воздушных змеев",
  "гнилушки",
  "Калуге",
].sort((a, b) => b.length - a.length);

const tsiolkovskyPattern = new RegExp(`(${tsiolkovskyKeyFacts.map(x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
const tsiolkovskyExact = new Set(tsiolkovskyKeyFacts);

function mark(text: string): ReactNode {
  return text.split(tsiolkovskyPattern).map((part, index) => tsiolkovskyExact.has(part) ? <strong className="key-fact" key={`${part}-${index}`}>{part}</strong> : part);
}

const lessonMedia = [
  ["tsiolkovsky-portrait.png", "Памятник идеям калужского учителя"],
  ["tsiolkovsky-portrait.png", "Константин Эдуардович Циолковский"],
  ["tsiolkovsky-portrait.png", "Учитель, которого считали фантазёром"],
  ["tsiolkovsky-portrait.png", "Мальчик, который не сдался"],
  ["tsiolkovsky-portrait.png", "Самостоятельные занятия в Москве"],
  ["tsiolkovsky-portrait.png", "Учитель арифметики, физики и геометрии"],
  ["tsiolkovsky-portrait.png", "Человек с необычными привычками"],
  ["tsiolkovsky-portrait.png", "Опыт, который объясняет ракету"],
  ["tsiolkovsky-portrait.png", "Дорога к космическому полёту"],
  ["tsiolkovsky-portrait.png", "Идеи о жизни за пределами Земли"],
  ["tsiolkovsky-portrait.png", "Зеркальные пластинки"],
  ["tsiolkovsky-portrait.png", "Отец космонавтики"],
] as const;

export default function TsiolkovskyRoute({ onBack, onMatching, onNext }: { onBack: () => void; onMatching: () => void; onNext: () => void }) {
  const [page, setPage] = useState<Page>("plan");
  const [part, setPart] = useState(0);
  const [step, setStep] = useState(0);
  const [miniIndex, setMiniIndex] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [miniFirstTry, setMiniFirstTry] = useState(0);
  const [miniWrongAttempts, setMiniWrongAttempts] = useState(0);
  const [miniWrongChoices, setMiniWrongChoices] = useState<number[]>([]);
  const [miniDone, setMiniDone] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [finalIndex, setFinalIndex] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finalWrongChoices, setFinalWrongChoices] = useState<number[]>([]);
  const [testVersion, setTestVersion] = useState(0);

  const mixedMiniTours = useMemo(() => miniTours.map(block => block.map(mixQuestion)), []);
  const finalSet = useMemo(
    () => [...finalQuestions, ...finalMiniQuestions, ...miniTours.flat()].sort(() => Math.random() - 0.5).slice(0, 10).map(mixQuestion),
    [testVersion],
  );

  const jump = (next: Page) => { setPage(next); setPick(null); setFinalWrongChoices([]); window.scrollTo(0, 0); };
  const currentFinal = finalSet[finalIndex];
  const chooseFinalAnswer = (index: number) => {
    if (pick === currentFinal.answer) return;
    setPick(index);
    if (index === currentFinal.answer) {
      if (finalWrongChoices.length === 0) setFinalScore(value => value + 1);
      return;
    }
    if (!finalWrongChoices.includes(index)) setFinalWrongChoices(choices => [...choices, index]);
  };
  const nextFinal = () => {
    if (pick !== currentFinal.answer) return;
    setFinalIndex(finalIndex + 1);
    setFinalWrongChoices([]);
    setPick(null);
  };
  const startPart = (index: number) => { setPart(index); setStep(index * 3); jump("lesson"); };
  const resetMini = () => { setMiniIndex(0); setMiniFirstTry(0); setMiniWrongAttempts(0); setMiniWrongChoices([]); setMiniDone(false); setPick(null); };
  const startMini = () => { resetMini(); jump("mini"); };
  const currentMini = mixedMiniTours[part][miniIndex];
  const chooseMiniAnswer = (index: number) => {
    if (pick === currentMini.answer) return;
    setPick(index);
    if (index === currentMini.answer) {
      if (miniWrongChoices.length === 0) setMiniFirstTry(value => value + 1);
      return;
    }
    if (!miniWrongChoices.includes(index)) {
      setMiniWrongChoices(choices => [...choices, index]);
      setMiniWrongAttempts(value => value + 1);
    }
  };
  const nextMini = () => {
    if (pick !== currentMini.answer) return;
    if (miniIndex < 4) { setMiniIndex(miniIndex + 1); setMiniWrongChoices([]); setPick(null); return; }
    setMiniDone(true);
  };
  const continueAfterMini = () => { if (part < 3) startPart(part + 1); else jump("workshop"); };

  return <main className="compact highrise-module route-start sats-module">
    <button className="back" onClick={page === "plan" ? onBack : () => jump("plan")}>← {page === "plan" ? "Карта тем" : "План темы"}</button>
    {page === "plan" && <>
      <div className="label">ТЕМА • КОНСТАНТИН ЭДУАРДОВИЧ ЦИОЛКОВСКИЙ</div>
      <section className="route-cover person-cover">
        <img src="./assets/tsiolkovsky-portrait.png" alt="Константин Эдуардович Циолковский" />
        <div>
          <span>НАУКА СССР • КОСМОНАВТИКА</span>
          <h1>Константин Эдуардович Циолковский</h1>
          <p><strong>Калужский учитель и учёный-самоучка</strong>, идеи которого открыли людям дорогу к звёздам.</p>
          <dl>
            <div><dt>Главная профессия</dt><dd><strong>Учитель</strong> арифметики, физики и геометрии</dd></div>
            <div><dt>Образование</dt><dd><strong>Учёный-самоучка</strong>: три года самостоятельно занимался в Румянцевской библиотеке</dd></div>
            <div><dt>Чем знаменит</dt><dd>Предложил и научно доказал необходимость <strong>ракеты для полётов в космос</strong></dd></div>
            <div className="architects"><dt>Источник школьного тура</dt><dd>книга <strong>«Циолковский»</strong> Александра Ткаченко</dd></div>
          </dl>
        </div>
      </section>
      <div className="route-rule"><b>Как будем учиться</b><p>Три учебных экрана → пять олимпиадных заданий. После четырёх частей — олимпиадная мастерская, карточки и итоговая проверка.</p></div>
      <div className="part-list">
        {partTitles.map((title, index) => <button className="part-row" key={title} onClick={() => startPart(index)}><span><b>Часть {index + 1}. {title}</b><small>3 учебных экрана → 5 заданий</small></span><span>Открыть →</span></button>)}
        <button className="part-row final-row" onClick={() => jump("workshop")}><span><b>Олимпиадная мастерская</b><small>Изображение • соответствие • хронология • ошибки • анаграмма • кроссворд</small></span><span>Открыть →</span></button>
        <button className="part-row final-row" onClick={() => jump("cards")}><span><b>Карточки темы — ответить вслух</b><small>Люди, числа, опыты и идеи</small></span><span>Открыть →</span></button>
        <button className="part-row writing-row" onClick={onMatching}><span><b>20 изображений — вписать названия</b><small>Обязательные подписи муниципального и регионального туров</small></span><span>Писать ответы →</span></button>
        <button className="part-row final-row" onClick={() => jump("final")}><span><b>Итоговая олимпиадная проверка</b><small>10 вопросов с выбором ответа по материалам четырёх мини-туров</small></span><span>Открыть →</span></button>
      </div>
    </>}
    {page === "lesson" && <>
      <div className="progress"><span>ЦИОЛКОВСКИЙ • ЧАСТЬ {part + 1} ИЗ 4 • ЭКРАН {step % 3 + 1} ИЗ 3</span><div><i style={{ width: `${(step + 1) / 12 * 100}%` }} /></div></div>
      <section className="spread"><aside><img src={`./assets/${lessonMedia[step][0]}`} alt={lessonMedia[step][1]} /><small>ИЛЛЮСТРАЦИЯ ИЗ КНИГИ МАРШРУТА</small><p><strong>{lessonMedia[step][1]}</strong></p><div className="part-tag">ЧАСТЬ {part + 1}<br /><b>{partTags[part]}</b></div></aside><article><div className="chapter-label">УЧЕБНЫЙ ЭКРАН • СНАЧАЛА ПОЙМИ, ПОТОМ ПРОВЕРЬ</div><h1>{mark(lessons[step].title)}</h1><p className="lesson-text">{mark(lessons[step].text)}</p><div className="fact-strip"><b>Опорная запись</b><span>{mark(lessons[step].fact)}</span></div><div className="lesson-nav"><button className="secondary" disabled={step % 3 === 0} onClick={() => setStep(step - 1)}>← Назад</button>{step % 3 < 2 ? <button className="primary" onClick={() => setStep(step + 1)}>Следующий экран →</button> : <button className="primary" onClick={startMini}>Мини-тур: 5 заданий →</button>}</div></article></section>
    </>}
    {page === "mini" && <section className="quiz">{miniDone ? <><h1>Мини-тур завершён!</h1><p><strong>Без ошибок: {miniFirstTry} из 5</strong></p><p><strong>Неправильных попыток: {miniWrongAttempts}</strong></p><div className="task-actions"><button className="primary" onClick={resetMini}>Повторить мини-тур</button><button className="primary" onClick={continueAfterMini}>Продолжить маршрут</button></div></> : <><span>МИНИ-ТУР • ЧАСТЬ {part + 1} • {miniIndex + 1} ИЗ 5</span><h1>{mark(currentMini.title)}</h1>{currentMini.options.map((option, index) => <button key={option} disabled={pick === currentMini.answer} className={pick === index ? (index === currentMini.answer ? "right" : "wrong") : ""} onClick={() => chooseMiniAnswer(index)}>{option}</button>)}{pick !== null && <p className="explain">{pick === currentMini.answer ? "Верно!" : "Пока неверно. Попробуй ещё раз"}</p>}{pick === currentMini.answer && <button className="primary" onClick={nextMini}>{miniIndex < 4 ? "Следующее задание →" : "Завершить мини-тур →"}</button>}</>}</section>}
    {page === "workshop" && <RouteWorkshop data={workshopData} onBack={() => jump("plan")} onFinish={() => jump("cards")} />}
    {page === "cards" && <><div className="label">КАРТОЧКИ БЕЗ ПОДСКАЗОК</div><h1>Вспомни точный ответ</h1><p>Сначала произнеси ответ вслух, затем переверни карточку.</p><div className="card-grid">{cards.map((card, index) => <button className={revealed.includes(index) ? "memory flipped" : "memory"} key={card[0]} onClick={() => setRevealed(revealed.includes(index) ? revealed.filter(item => item !== index) : [...revealed, index])}><span>{mark(revealed.includes(index) ? card[1] : card[0])}</span><small>{revealed.includes(index) ? "Ответ" : "Узнать ответ →"}</small></button>)}</div><button className="primary center" onClick={() => jump("final")}>Итоговая проверка →</button></>}
    {page === "final" && <section className="quiz"><span>ИТОГОВАЯ ПРОВЕРКА • {Math.min(finalIndex + 1, 10)} ИЗ 10</span>{finalIndex < 10 ? <><h1>{mark(currentFinal.title)}</h1>{currentFinal.options.map((option, index) => <button key={option} disabled={pick === currentFinal.answer} className={pick === index ? (index === currentFinal.answer ? "right" : "wrong") : ""} onClick={() => chooseFinalAnswer(index)}>{option}</button>)}{pick !== null && <p className="explain">{pick === currentFinal.answer ? "Верно!" : "Пока неверно. Попробуй ещё раз"}</p>}{pick === currentFinal.answer && <button className="primary" onClick={nextFinal}>{finalIndex < 9 ? "Следующее задание →" : "Узнать результат →"}</button>}</> : <><div className="result">{finalScore}<small>/ 10</small></div><h1>{finalScore === 10 ? "МОЛОДЕЦ" : "Есть ошибки"}</h1><p>{finalScore === 10 ? "Все задания выполнены верно. Можно переходить к следующему маршруту." : "Пройди итоговую проверку ещё раз или перейди к следующему маршруту."}</p>{finalScore === 10 ? <button className="primary" onClick={onNext}>Следующий маршрут →</button> : <div className="task-actions"><button className="primary" onClick={() => { setFinalIndex(0); setFinalScore(0); setPick(null); setFinalWrongChoices([]); setTestVersion(testVersion + 1); }}>Пройти ещё раз</button><button className="secondary" onClick={onNext}>Перейти к следующему маршруту →</button></div>}</>}</section>}
  </main>;
}
