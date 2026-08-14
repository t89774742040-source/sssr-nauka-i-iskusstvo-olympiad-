import { useMemo, useState, type ReactNode } from "react";
import RouteWorkshop, { type WorkshopData } from "./RouteWorkshop";

type Page = "plan" | "lesson" | "mini" | "workshop" | "cards" | "final";

type Lesson = {
  title: string;
  text: string;
  fact: string;
};

type Question = {
  title: string;
  options: string[];
  answer: number;
};

const lessons: Lesson[] = [
  {
    title: "Кто такая Наталия Сац?",
    text: "Наталия Ильинична Сац — создатель театра для детей. Она хотела, чтобы ребёнку было интересно не только во время спектакля, но и до его начала, в антракте и после окончания. Сац придумала детский театр как особый мир — чудо и приключение.",
    fact: "Наталия Ильинична Сац — создатель театра для детей. Для неё театр был особым миром — чудом и приключением.",
  },
  {
    title: "Семья композитора и певицы",
    text: "Наталия родилась в семье театрального композитора Ильи Саца и певицы Анны Щастной. Уже в один год она оказалась в театре: отец часто брал маленькую Наташу на репетиции. Позже девочка училась играть на фортепиано и смотрела спектакли Московского Художественного театра из-за кулис.",
    fact: "Отец — композитор Илья Сац; мать — певица Анна Щастная; знакомство с театром началось в раннем детстве.",
  },
  {
    title: "Почему на крыше Синяя птица?",
    text: "Любимым спектаклем Наташи была «Синяя птица». Музыку к нему написал её отец Илья Сац. Синяя птица — птица счастья — стала символом мечты Наталии, а позднее её огромная скульптура появилась на крыше Детского музыкального театра.",
    fact: "«Синяя птица» — любимый спектакль Наташи; музыку написал Илья Сац; птица стала символом театра.",
  },
  {
    title: "Пятнадцать лет и театр на колёсах",
    text: "В 1917 году Наталии было пятнадцать лет. В Моссовете ей выдали немного денег, лошадь и повозку: нужно было устраивать спектакли и концерты для детей в разных районах Москвы. За три года под её руководством состоялось 1823 детских спектакля и концерта.",
    fact: "1917 год — 15 лет; передвижной театр на колёсах; за три года — 1823 спектакля и концерта.",
  },
  {
    title: "Первый детский театр Моссовета",
    text: "В октябре 1918 года открылся Первый детский театр Моссовета. В нём были театр марионеток, театр теней и балаган театра петрушек. Наталия Сац также ввела вступительное слово: перед спектаклем детям объясняли, что они увидят и как вести себя в театре.",
    fact: "Октябрь 1918 года — Первый детский театр Моссовета; традиция вступительного слова перед спектаклем.",
  },
  {
    title: "Театр, музыка и «Петя и волк»",
    text: "В 1921 году Сац создала Московский театр для детей. Позднее она придумала музыкальный «путеводитель» по оркестру и заказала его Сергею Прокофьеву. Вместе они сочинили сюжет симфонической сказки «Петя и волк», знакомящей детей со звучанием инструментов.",
    fact: "1921 год — Московский театр для детей; Сергей Прокофьев — симфоническая сказка «Петя и волк».",
  },
  {
    title: "Первый детский театр Алма-Аты",
    text: "В 1937 году Наталию Сац арестовали как жену человека, обвинённого в государственной измене, и отправили в лагерь. После выхода из заключения ей запретили жить в Москве, поэтому она отправилась в Алма-Ату. Там Сац снова начала с нуля и в ноябре 1945 года открыла первый детский театр города. В нём были театральный и концертный залы, а во дворе появился первый в Алма-Ате детский кинотеатр.",
    fact: "1937 год — арест и лагерь; запрет жить в Москве; ноябрь 1945 года — первый детский театр Алма-Аты.",
  },
  {
    title: "Первый профессиональный музыкальный театр для детей",
    text: "21 ноября 1965 года премьерой оперы Михаила Красева «Морозко» открылся первый и единственный тогда в мире профессиональный Детский музыкальный театр. В нём проходили оперы, балеты, симфонические концерты и лекции для юных зрителей.",
    fact: "21 ноября 1965 года; опера «Морозко»; профессиональный Детский музыкальный театр.",
  },
  {
    title: "Дворец музыки на проспекте Вернадского",
    text: "Сначала у театра не было собственного большого здания. Наталия Сац добилась его строительства, и в 1979 году на проспекте Вернадского появился Дворец музыки. На его крыше поселилась Синяя птица. Наталия Сац ушла из жизни в 1993 году, а театр был назван её именем.",
    fact: "1979 год — здание на проспекте Вернадского; Синяя птица на крыше; 1993 год — Наталия Сац ушла из жизни.",
  },
  {
    title: "Алма-Ата: начать с нуля",
    text: "После выхода из заключения Наталии Сац запретили жить в Москве. Она уехала в Алма-Ату, где поставила оперу «Чио-Чио-сан» и начала создавать детский театр с нуля. Театр открылся в ноябре 1945 года и стал первым детским театром Алма-Аты. В нём были театральный и концертный залы, а во дворе появился первый в городе детский кинотеатр.",
    fact: "Алма-Ата — «Чио-Чио-сан» — ноябрь 1945 года — первый детский театр города.",
  },
  {
    title: "Снова в Москве",
    text: "Вернуться в Москву Наталии Сац удалось в 1958 году, через тринадцать лет после открытия театра в Алма-Ате. Она возглавила детский отдел Мосэстрады. 21 ноября 1965 года на сцене Московского театра эстрады премьерой оперы Михаила Красева «Морозко» открылся первый и единственный тогда в мире профессиональный Детский музыкальный театр.",
    fact: "1958 год — возвращение в Москву; 21 ноября 1965 года — «Морозко» — Детский музыкальный театр.",
  },
  {
    title: "Дворец музыки",
    text: "Сначала у Детского музыкального театра не было собственного большого здания: он работал в тесном помещении на Никольской улице. В 1979 году на проспекте Вернадского появился Дворец музыки. На его крыше установили Синюю птицу. Наталия Сац ушла из жизни в 1993 году. Сегодня театр носит её имя.",
    fact: "1979 год — Дворец музыки на проспекте Вернадского; Синяя птица на крыше; 1993 год — Наталия Сац ушла из жизни; сегодня театр носит её имя.",
  },
];

const miniTours: Question[][] = [
  [
    { title: "Кем была Наталия Сац?", options: ["Создателем театра для детей", "Архитектором высоток", "Конструктором ракет"], answer: 0 },
    { title: "Какое слово нужно точно написать под портретом Наталии Ильиничны?", options: ["Сац", "Мухина", "Щастная"], answer: 0 },
    { title: "Что стало символом театра Наталии Сац?", options: ["Синяя птица", "Золотой колос", "Красная звезда"], answer: 0 },
    { title: "Кто написал музыку к любимому спектаклю Наташи «Синяя птица»?", options: ["Её отец Илья Сац", "Сергей Прокофьев", "Михаил Красев"], answer: 0 },
    { title: "Найди ошибочное утверждение.", options: ["Наталия с раннего детства бывала в театре", "Синяя птица связана с её детскими впечатлениями", "Наталия впервые увидела театр только взрослой"], answer: 2 },
  ],
  [
    { title: "В каком году Наталия Сац начала организовывать передвижные представления?", options: ["1917", "1936", "1965"], answer: 0 },
    { title: "Сколько представлений прошло за три года под её руководством?", options: ["1823", "1918", "1921"], answer: 0 },
    { title: "Когда открылся Первый детский театр Моссовета?", options: ["В октябре 1918 года", "В ноябре 1945 года", "21 ноября 1965 года"], answer: 0 },
    { title: "Расположи события по времени.", options: ["Передвижной театр — Первый детский театр Моссовета — Московский театр для детей", "Московский театр для детей — передвижной театр — Первый детский театр Моссовета", "Первый детский театр Моссовета — Московский театр для детей — передвижной театр"], answer: 0 },
    { title: "Какое произведение появилось благодаря замыслу Наталии Сац и Сергея Прокофьева?", options: ["«Петя и волк»", "«Морозко»", "«Золотой ключик»"], answer: 0 },
  ],
  [
    { title: "Где Сац открыла детский театр в 1945 году?", options: ["В Алма-Ате", "В Берлине", "В Париже"], answer: 0 },
    { title: "С какого спектакля начался Детский музыкальный театр в 1965 году?", options: ["Опера «Морозко»", "Балет «Петя и волк»", "Пьеса «Золотой ключик»"], answer: 0 },
    { title: "Какая дата указана полностью верно?", options: ["21 ноября 1965 года — открытие Детского музыкального театра", "21 ноября 1979 года — Первый детский театр Моссовета", "Ноябрь 1945 года — Дворец музыки в Москве"], answer: 0 },
    { title: "В каком году появилось здание театра на проспекте Вернадского?", options: ["1979", "1965", "1936"], answer: 0 },
    { title: "Выбери верную цепочку.", options: ["Алма-Ата — 1945; Детский музыкальный театр — 1965; Дворец музыки — 1979", "Алма-Ата — 1965; Детский музыкальный театр — 1979; Дворец музыки — 1945", "Алма-Ата — 1979; Детский музыкальный театр — 1945; Дворец музыки — 1965"], answer: 0 },
  ],
  [
    { title: "Какую оперу Наталия Сац поставила в Алма-Ате?", options: ["«Чио-Чио-сан»", "«Морозко»", "«Фальстаф»"], answer: 0 },
    { title: "В каком году Наталия Сац смогла вернуться в Москву?", options: ["В 1958 году", "В 1945 году", "В 1979 году"], answer: 0 },
    { title: "Премьерой какой оперы 21 ноября 1965 года открылся Детский музыкальный театр?", options: ["«Морозко»", "«Чио-Чио-сан»", "«Свадьба Фигаро»"], answer: 0 },
    { title: "В каком году на проспекте Вернадского появился Дворец музыки?", options: ["В 1979 году", "В 1965 году", "В 1958 году"], answer: 0 },
    { title: "Какая последовательность событий верна?", options: ["Театр в Алма-Ате — возвращение в Москву — Детский музыкальный театр — Дворец музыки", "Возвращение в Москву — театр в Алма-Ате — Дворец музыки — Детский музыкальный театр", "Дворец музыки — Детский музыкальный театр — театр в Алма-Ате — возвращение в Москву"], answer: 0 },
  ],
];

const finalQuestions: Question[] = [
  { title: "Кто изображён на портрете этого маршрута?", options: ["Наталия Ильинична Сац", "Вера Игнатьевна Мухина", "Анна Щастная"], answer: 0 },
  { title: "Какое дело стало главным в жизни Наталии Сац?", options: ["Создание театров для детей", "Строительство высотных зданий", "Исследование космоса"], answer: 0 },
  { title: "Кем были родители Наталии?", options: ["Композитором и певицей", "Архитектором и художницей", "Учителем и врачом"], answer: 0 },
  { title: "Что обозначает Синяя птица в истории театра?", options: ["Птицу счастья и символ мечты Наталии Сац", "Герб Алма-Аты", "Название первого кинотеатра"], answer: 0 },
  { title: "Что произошло в октябре 1918 года?", options: ["Открылся Первый детский театр Моссовета", "Появился Дворец музыки", "Открылся театр в Алма-Ате"], answer: 0 },
  { title: "С кем Сац создала сюжет «Пети и волка»?", options: ["С Сергеем Прокофьевым", "С Алексеем Толстым", "С Михаилом Красевым"], answer: 0 },
  { title: "Какой театр открылся в ноябре 1945 года?", options: ["Первый детский театр Алма-Аты", "Первый детский театр Моссовета", "Детский музыкальный театр в Москве"], answer: 0 },
  { title: "Когда открылся профессиональный Детский музыкальный театр?", options: ["21 ноября 1965 года", "В октябре 1918 года", "В 1979 году"], answer: 0 },
  { title: "Где построили Дворец музыки?", options: ["На проспекте Вернадского", "На Театральной площади", "На Красной площади"], answer: 0 },
  { title: "Какой порядок дат верен?", options: ["1918 — 1945 — 1965 — 1979", "1945 — 1918 — 1979 — 1965", "1965 — 1945 — 1918 — 1979"], answer: 0 },
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
  ["Фамилия создателя театра для детей", "Сац"],
  ["Родители", "Илья Сац — композитор; Анна Щастная — певица"],
  ["Символ театра", "Синяя птица"],
  ["Октябрь 1918 года", "Первый детский театр Моссовета"],
  ["1921 год", "Московский театр для детей"],
  ["Сергей Прокофьев", "«Петя и волк»"],
  ["Ноябрь 1945 года", "Первый детский театр Алма-Аты"],
  ["21 ноября 1965 года", "Детский музыкальный театр"],
  ["1979 год", "Дворец музыки на проспекте Вернадского"],
  ["Птица счастья", "Синяя птица на крыше театра"],
];

const workshopData: WorkshopData = {
  route: "Наталия Сац", image: "./assets/card-sats.png", imageAlt: "Портрет Наталии Ильиничны Сац",
  identifyPrompt: "Кто изображён на портрете? Напиши фамилию.", identifyAnswer: "Сац",
  matchPrompt: "Выбери вариант, в котором верно связаны люди и произведения.",
  matchOptions: ["Сергей Прокофьев — «Морозко»; Михаил Красев — «Петя и волк»", "Сергей Прокофьев — «Петя и волк»; Михаил Красев — «Морозко»", "Илья Сац — «Морозко»; Сергей Прокофьев — «Синяя птица»"], matchAnswer: 1,
  events: [["palace", "1979 год — Дворец музыки на проспекте Вернадского"], ["mobile", "1917 год — передвижные представления для детей"], ["music", "21 ноября 1965 года — Детский музыкальный театр"], ["almaty", "Ноябрь 1945 года — детский театр Алма-Аты"]],
  correctOrder: ["mobile", "almaty", "music", "palace"],
  errorStatements: ["В октябре 1918 года открылся Первый детский театр Моссовета.", "Наталия Сац была архитектором московских высоток.", "В ноябре 1945 года Сац открыла детский театр в Алма-Ате.", "21 ноября 1965 года Сац открыла первый детский планетарий."], errorIndexes: [1, 3],
  anagramPrompt: "Составь слово из перемешанных букв.", anagramLetters: "Р • Т • Е • А • Т", anagramAnswer: "театр",
  crossword: [["Фамилия создателя театра для детей", "САЦ"], ["Опера, открывшая театр в 1965 году", "МОРОЗКО"], ["Город, где театр открылся в 1945 году", "АЛМА-АТА"], ["Какого цвета птица — символ мечты и счастья?", "СИНЯЯ"]],
};

const important = /(Наталия Ильинична Сац|Наталия Сац|Илья Сац|Анна Щастная|Синяя птица|1917 году|1823|1918 года|1921 году|Сергей Прокофьев|«Петя и волк»|«Чио-Чио-сан»|1945 года|1958 году|детский отдел Мосэстрады|21 ноября 1965 года|Московского театра эстрады|1979 году|1993 году|Первый детский театр Моссовета|Детский музыкальный театр)/g;
const importantPart = /^(Наталия Ильинична Сац|Наталия Сац|Илья Сац|Анна Щастная|Синяя птица|1917 году|1823|1918 года|1921 году|Сергей Прокофьев|«Петя и волк»|«Чио-Чио-сан»|1945 года|1958 году|детский отдел Мосэстрады|21 ноября 1965 года|Московского театра эстрады|1979 году|1993 году|Первый детский театр Моссовета|Детский музыкальный театр)$/;

const lessonMedia = [
  ["card-sats.png", "Наталия Ильинична Сац"],
  ["sats-childhood.png", "Детство Наталии Сац в музыкальной семье"],
  ["sats-childhood.png", "Музыка и театр в детстве Наталии Сац"],
  ["sats-theater.png", "Московский театр для детей"],
  ["sats-theater.png", "Спектакль для юных зрителей"],
  ["sats-theater.png", "Детский театр и музыка"],
  ["sats-almaty.png", "Детский театр в Алма-Ате"],
  ["sats-almaty.png", "Юные зрители музыкального театра"],
  ["sats-almaty.png", "Театр, созданный для детей"],
  ["sats-almaty.png", "Детский театр в Алма-Ате"],
  ["sats-almaty.png", "Возвращение Наталии Сац в Москву"],
  ["sats-almaty.png", "Дворец музыки Наталии Сац"],
] as const;

function mark(text: string): ReactNode {
  return text.split(important).map((part, index) => importantPart.test(part) ? <strong className="key-fact" key={`${part}-${index}`}>{part}</strong> : part);
}

export default function SatsRoute({ onBack, onMatching, onNext }: { onBack: () => void; onMatching: () => void; onNext: () => void }) {
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
  const [testVersion, setTestVersion] = useState(0);

  const mixedMiniTours = useMemo(() => miniTours.map(block => block.map(mixQuestion)), []);
  const finalSet = useMemo(
    () => [...finalQuestions, ...miniTours.slice(0, 3).flat()].sort(() => Math.random() - 0.5).slice(0, 10).map(mixQuestion),
    [testVersion],
  );

  const jump = (next: Page) => { setPage(next); setPick(null); window.scrollTo(0, 0); };
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
      <div className="label">ТЕМА • НАТАЛИЯ ИЛЬИНИЧНА САЦ</div>
      <section className="route-cover person-cover">
        <img src="./assets/card-sats.png" alt="Наталия Ильинична Сац" />
        <div>
          <span>ИСКУССТВО СССР • ТЕАТР ДЛЯ ДЕТЕЙ</span>
          <h1>Наталия Ильинична Сац</h1>
          <p><strong>Создатель театра для детей</strong>, превратившая театр в особый мир музыки, сказки и приключений</p>
          <dl>
            <div><dt>Главное дело</dt><dd>Создание театров для детей</dd></div>
            <div><dt>Главный театр</dt><dd>Детский музыкальный театр</dd></div>
            <div><dt>Главный символ</dt><dd><strong>Синяя птица</strong> — птица счастья</dd></div>
            <div><dt>Главная дата</dt><dd><strong className="date-value">21 ноября 1965 года</strong></dd></div>
            <div className="architects"><dt>Источник школьного тура</dt><dd>Катерина Антонова, книга <strong>«Наталия Сац. Создатель театра для детей»</strong></dd></div>
          </dl>
        </div>
      </section>
      <div className="route-rule"><b>Как будем учиться</b><p>Три учебных экрана → пять олимпиадных заданий. После четырёх частей — олимпиадная мастерская, карточки и итоговая проверка.</p></div>
      <div className="part-list">
        {["Семья, детство и Синяя птица", "Первые театры и музыка", "Алма-Ата и Дворец музыки", "Возвращение и Дворец музыки"].map((title, index) => <button className="part-row" key={title} onClick={() => startPart(index)}><span><b>Часть {index + 1}. {title}</b><small>3 учебных экрана → 5 заданий</small></span><span>Открыть →</span></button>)}
        <button className="part-row final-row" onClick={() => jump("workshop")}><span><b>Олимпиадная мастерская</b><small>Изображение • соответствие • хронология • ошибки • анаграмма • кроссворд</small></span><span>Открыть →</span></button>
        <button className="part-row final-row" onClick={() => jump("cards")}><span><b>Карточки темы — ответить вслух</b><small>Даты, имена, театры и произведения</small></span><span>Открыть →</span></button>
        <button className="part-row writing-row" onClick={onMatching}><span><b>20 изображений — вписать названия</b><small>Обязательные подписи муниципального и регионального туров</small></span><span>Писать ответы →</span></button>
        <button className="part-row final-row" onClick={() => jump("final")}><span><b>Итоговая олимпиадная проверка</b><small>10 смешанных заданий</small></span><span>Открыть →</span></button>
      </div>
    </>}

    {page === "lesson" && <>
      <div className="progress"><span>САЦ • ЧАСТЬ {part + 1} ИЗ 4 • ЭКРАН {step % 3 + 1} ИЗ 3</span><div><i style={{ width: `${(step + 1) / 12 * 100}%` }} /></div></div>
      <section className="spread">
        <aside><img src={`./assets/${lessonMedia[step][0]}`} alt={lessonMedia[step][1]} /><small>ИЛЛЮСТРАЦИЯ ИЗ КНИГИ МАРШРУТА</small><p><strong>{lessonMedia[step][1]}</strong></p><div className="part-tag">ЧАСТЬ {part + 1}<br /><b>{["Детство и Синяя птица", "Первые театры", "Дворец музыки", "Возвращение и Дворец музыки"][part]}</b></div></aside>
        <article><div className="chapter-label">УЧЕБНЫЙ ЭКРАН • СНАЧАЛА ПОЙМИ, ПОТОМ ПРОВЕРЬ</div><h1>{lessons[step].title}</h1><p className="lesson-text">{mark(lessons[step].text)}</p><div className="fact-strip"><b>Опорная запись</b><span>{mark(lessons[step].fact)}</span></div><div className="lesson-nav"><button className="secondary" disabled={step % 3 === 0} onClick={() => setStep(step - 1)}>← Назад</button>{step % 3 < 2 ? <button className="primary" onClick={() => setStep(step + 1)}>Следующий экран →</button> : <button className="primary" onClick={startMini}>Мини-тур: 5 заданий →</button>}</div></article>
      </section>
    </>}

    {page === "mini" && <section className="quiz">{miniDone ? <><h1>Мини-тур завершён!</h1><p><strong>Без ошибок: {miniFirstTry} из 5</strong></p><p><strong>Неправильных попыток: {miniWrongAttempts}</strong></p><div className="task-actions"><button className="primary" onClick={resetMini}>Повторить мини-тур</button><button className="primary" onClick={continueAfterMini}>Продолжить маршрут</button></div></> : <><span>МИНИ-ТУР • ЧАСТЬ {part + 1} • {miniIndex + 1} ИЗ 5</span><h1>{currentMini.title}</h1>{currentMini.options.map((option, index) => <button key={option} disabled={pick === currentMini.answer} className={pick === index ? (index === currentMini.answer ? "right" : "wrong") : ""} onClick={() => chooseMiniAnswer(index)}>{option}</button>)}{pick !== null && <p className="explain">{pick === currentMini.answer ? "Верно!" : "Пока неверно. Попробуй ещё раз"}</p>}{pick === currentMini.answer && <button className="primary" onClick={nextMini}>{miniIndex < 4 ? "Следующее задание →" : "Завершить мини-тур →"}</button>}</>}</section>}

    {page === "workshop" && <RouteWorkshop data={workshopData} onBack={() => jump("plan")} onFinish={() => jump("cards")} />}

    {page === "cards" && <><div className="label">КАРТОЧКИ БЕЗ ПОДСКАЗОК</div><h1>Вспомни точный ответ</h1><p>Сначала произнеси ответ вслух, затем переверни карточку.</p><div className="card-grid">{cards.map((card, index) => <button className={revealed.includes(index) ? "memory flipped" : "memory"} key={card[0]} onClick={() => setRevealed(revealed.includes(index) ? revealed.filter(item => item !== index) : [...revealed, index])}><span>{revealed.includes(index) ? card[1] : card[0]}</span><small>{revealed.includes(index) ? "Ответ" : "Узнать ответ →"}</small></button>)}</div><button className="primary center" onClick={() => jump("final")}>Итоговая проверка →</button></>}

      {page === "final" && <section className="quiz"><span>ИТОГОВАЯ ПРОВЕРКА • {Math.min(finalIndex + 1, 10)} ИЗ 10</span>{finalIndex < 10 ? <><h1>{finalSet[finalIndex].title}</h1>{finalSet[finalIndex].options.map((option, index) => <button key={option} disabled={pick !== null} className={pick === index ? (index === finalSet[finalIndex].answer ? "right" : "wrong") : ""} onClick={() => { setPick(index); if (index === finalSet[finalIndex].answer) setFinalScore(finalScore + 1); }}>{option}</button>)}{pick !== null && <><p className="explain">{pick === finalSet[finalIndex].answer ? "Верно." : <>Правильный ответ: {finalSet[finalIndex].options[finalSet[finalIndex].answer]}.</>}</p><button className="primary" onClick={() => { setFinalIndex(finalIndex + 1); setPick(null); }}>{finalIndex < 9 ? "Следующее задание →" : "Узнать результат →"}</button></>}</> : <><div className="result">{finalScore}<small>/ 10</small></div><h1>{finalScore === 10 ? "МОЛОДЕЦ" : "Есть ошибки"}</h1><p>{finalScore === 10 ? "Все задания выполнены верно. Можно переходить к следующему маршруту." : "Пройди итоговую проверку ещё раз или перейди к следующему маршруту."}</p>{finalScore === 10 ? <button className="primary" onClick={onNext}>Следующий маршрут →</button> : <div className="task-actions"><button className="primary" onClick={() => { setFinalIndex(0); setFinalScore(0); setPick(null); setTestVersion(testVersion + 1); }}>Пройти ещё раз</button><button className="secondary" onClick={onNext}>Перейти к следующему маршруту →</button></div>}</>}</section>}
  </main>;
}
