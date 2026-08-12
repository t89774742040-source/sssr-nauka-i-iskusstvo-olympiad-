import { useMemo, useState, type ReactNode } from "react";
import RouteWorkshop, { type WorkshopData } from "./RouteWorkshop";

type Page = "plan" | "lesson" | "mini" | "workshop" | "cards" | "final";
type Lesson = { title: string; text: string; fact: string };
type Question = { title: string; options: string[]; answer: number };

const lessons: Lesson[] = [
  {
    title: "Что называют летающими звёздами?",
    text: "Летающие звёзды — это искусственные спутники Земли, созданные человеком и выведенные в космос ракетами. Они не светятся сами: солнечный свет отражается от их поверхности, поэтому с Земли спутник может выглядеть как движущаяся звёздочка. Путь спутника вокруг планеты называется орбитой. Спутники передают связь и телевизионный сигнал, помогают предсказывать погоду, следить за ураганами, находить терпящие бедствие корабли и обнаруживать лесные пожары.",
    fact: "Искусственный спутник создан человеком. Он движется вокруг Земли по орбите и помогает обеспечивать связь, наблюдать за погодой и обнаруживать опасности.",
  },
  {
    title: "Как ракета преодолевает притяжение Земли?",
    text: "Земля притягивает к себе все предметы, поэтому подброшенный камень теряет скорость и падает. Для выхода в космос аппарат должен, наоборот, разгоняться примерно до восьми километров в секунду. Константин Эдуардович Циолковский доказал, что это может сделать ракета — летательный аппарат с реактивным двигателем. Ракету толкает вперёд струя раскалённого газа, направленная назад. Похожий принцип можно увидеть, если отпустить незавязанный надутый шарик: воздух выходит назад, а шарик движется в противоположную сторону. Такое движение называется реактивным.",
    fact: "Реактивный двигатель выбрасывает струю газа назад и создаёт толчок, который движет ракету вперёд. Для выхода в космос нужна скорость около 8 километров в секунду.",
  },
  {
    title: "Кто запустил первую летающую звезду?",
    text: "Идеи Циолковского воплотили инженеры. Валентин Петрович Глушко создал мощный реактивный двигатель, а Сергей Павлович Королёв разработал ракету, на которую установили такие двигатели. 4 октября 1957 года ракета впервые преодолела земное притяжение и вывела на орбиту первый искусственный спутник Земли. Это был металлический шар диаметром 54 сантиметра с четырьмя длинными антеннами.",
    fact: "Циолковский — теория; Глушко — реактивный двигатель; Королёв — ракета; 4 октября 1957 года — запуск первого спутника.",
  },
  {
    title: "Что сообщил первый спутник?",
    text: "Внутри первого спутника находились два радиопередатчика. Они посылали сигналы «бип-бип-бип», и весь мир узнал, что на орбите находится творение человеческих рук. Спутник работал 92 дня и 1440 раз облетел Землю.",
    fact: "Сигнал «бип-бип-бип»; 92 дня на орбите; 1440 оборотов вокруг Земли.",
  },
  {
    title: "Хвостатые космонавты",
    text: "Собака Лайка стала первой космической пассажиркой, но вернуться тогда ещё не могла. Белка и Стрелка отправились в космос в 1960 году и стали первыми путешественниками, благополучно вернувшимися из полёта. Они провели на орбите 26 часов.",
    fact: "Лайка — первая космическая пассажирка; Белка и Стрелка — возвращение на Землю; 1960 год; 26 часов.",
  },
  {
    title: "Как готовили первых космонавтов?",
    text: "Первый отряд набрали из двадцати военных лётчиков. Их испытывали на центрифуге, в барокамере, термокамере и сурдокамере, на вибростенде. Из двадцати кандидатов отобрали шестерых, а первым космонавтом стал Юрий Алексеевич Гагарин.",
    fact: "20 военных лётчиков — 6 лучших кандидатов; центрифуга — перегрузки; барокамера — давление.",
  },
  {
    title: "Что такое скафандр?",
    text: "Слово «скафандр» переводится как «лодка для человека». Этот костюм позволяет жить и работать там, где обычной жизни нет. Полётный скафандр используют внутри корабля, выходной — в открытом космосе. На выходном скафандре есть зеркальце, а в шлеме предусмотрена чесалка для носа.",
    fact: "Скафандр — «лодка для человека»; полётный и выходной; зеркальце помогает видеть за спиной.",
  },
  {
    title: "108 минут Юрия Гагарина",
    text: "12 апреля 1961 года Юрий Алексеевич Гагарин отправился в космос на корабле «Восток-1». Корабль один раз облетел Землю, а полёт продолжался 108 минут. Гагарин проверил, может ли человек есть в невесомости, и попробовал девять образцов пищи из тюбиков.",
    fact: "12 апреля 1961 года; «Восток-1»; один оборот вокруг Земли; 108 минут; 9 образцов пищи.",
  },
  {
    title: "Какие профессии есть у спутников?",
    text: "Спутники связи помогают людям общаться, метеоспутники наблюдают за погодой, ураганами и тайфунами. Спутники помогают спасателям находить корабли, обнаруживать лесные пожары и охранять границы. Международная космическая станция служит домом и лабораторией для космонавтов.",
    fact: "Связь; прогноз погоды; спасение; поиск пожаров; МКС — жизнь и опыты космонавтов.",
  },
];

const miniTours: Question[][] = [
  [
    { title: "Что в книге названо летающей звездой?", options: ["Комета", "Искусственный спутник Земли", "Самолёт"], answer: 1 },
    { title: "Как называется путь спутника вокруг планеты?", options: ["Орбита", "Трасса", "Экватор"], answer: 0 },
    { title: "Почему реактивный двигатель толкает ракету вперёд?", options: ["Земля перестаёт притягивать ракету", "Струя раскалённого газа вырывается назад и создаёт толчок в противоположную сторону", "Ракету притягивает Солнце"], answer: 1 },
    { title: "Выбери верное соответствие.", options: ["Циолковский — теория; Глушко — двигатель; Королёв — ракета", "Циолковский — скафандр; Глушко — спутник; Королёв — телескоп", "Циолковский — космонавт; Глушко — метеоролог; Королёв — врач"], answer: 0 },
    { title: "Когда запустили первый искусственный спутник Земли?", options: ["12 апреля 1961 года", "4 октября 1957 года", "В 1960 году"], answer: 1 },
  ],
  [
    { title: "Какой сигнал передавал первый спутник?", options: ["SOS", "«Поехали!»", "«Бип-бип-бип»"], answer: 2 },
    { title: "Кто был первой космической пассажиркой?", options: ["Лайка", "Стрелка", "Белка"], answer: 0 },
    { title: "Какие собаки благополучно вернулись из космоса?", options: ["Лайка и Стрелка", "Белка и Стрелка", "Белка и Лайка"], answer: 1 },
    { title: "Сколько времени Белка и Стрелка провели на орбите?", options: ["108 минут", "92 дня", "26 часов"], answer: 2 },
    { title: "Какая установка проверяет переносимость перегрузок?", options: ["Барокамера", "Центрифуга", "Сурдокамера"], answer: 1 },
  ],
  [
    { title: "Что означает слово «скафандр»?", options: ["Лодка для человека", "Воздушный шар", "Космическая ракета"], answer: 0 },
    { title: "Какой скафандр нужен для работы вне корабля?", options: ["Полётный", "Тренировочный", "Выходной"], answer: 2 },
    { title: "Когда состоялся полёт Юрия Гагарина?", options: ["4 октября 1957 года", "12 апреля 1961 года", "В 1960 году"], answer: 1 },
    { title: "Сколько длился полёт «Востока-1»?", options: ["108 минут", "26 часов", "92 дня"], answer: 0 },
    { title: "Найди неверное соответствие.", options: ["Спутник связи — общение", "Метеоспутник — наблюдение за погодой", "МКС — запуск морских кораблей"], answer: 2 },
  ],
];

const finalQuestions: Question[] = [
  { title: "Как называется изображённый объект?", options: ["Луноход", "Спутник", "Ледокол"], answer: 1 },
  { title: "Что такое орбита?", options: ["Путь спутника вокруг планеты", "Сигнал радиопередатчика", "Сила земного притяжения"], answer: 0 },
  { title: "Кто создал ракету для запуска первого спутника?", options: ["Валентин Глушко", "Юрий Гагарин", "Сергей Королёв"], answer: 2 },
  { title: "Какая дата связана с первым спутником?", options: ["4 октября 1957 года", "12 апреля 1961 года", "21 ноября 1965 года"], answer: 0 },
  { title: "Какого размера был первый спутник?", options: ["Диаметром 8 метров", "Диаметром 54 сантиметра", "Размером с дом"], answer: 1 },
  { title: "Расположи события по времени.", options: ["Гагарин — первый спутник — Белка и Стрелка", "Первый спутник — Белка и Стрелка — Гагарин", "Белка и Стрелка — Гагарин — первый спутник"], answer: 1 },
  { title: "Для чего нужна барокамера?", options: ["Испытывать перепады давления", "Создавать радиосигнал", "Наблюдать за погодой"], answer: 0 },
  { title: "Зачем на рукаве выходного скафандра зеркальце?", options: ["Чтобы подавать сигналы", "Чтобы видеть за спиной", "Чтобы измерять скорость"], answer: 1 },
  { title: "Как назывался корабль Гагарина?", options: ["«Спутник-1»", "«Восток-1»", "«Эхо-1»"], answer: 1 },
  { title: "Какая цепочка полностью верна?", options: ["1957 — первый спутник; 1960 — Белка и Стрелка; 1961 — Гагарин", "1957 — Гагарин; 1960 — первый спутник; 1961 — Лайка", "1957 — Белка и Стрелка; 1960 — Гагарин; 1961 — первый спутник"], answer: 0 },
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
  ["Летающая звезда", "Искусственный спутник Земли"],
  ["Путь спутника", "Орбита"],
  ["Циолковский", "Доказал, что притяжение Земли может преодолеть ракета"],
  ["Глушко — Королёв", "Реактивный двигатель — ракета"],
  ["4 октября 1957 года", "Первый искусственный спутник Земли"],
  ["Первый спутник", "54 сантиметра; 4 антенны; «бип-бип-бип»"],
  ["1960 год", "Белка и Стрелка"],
  ["Скафандр", "«Лодка для человека»"],
  ["12 апреля 1961 года", "Полёт Юрия Гагарина"],
  ["«Восток-1»", "Один оборот; 108 минут"],
];

const workshopData: WorkshopData = {
  route: "Летающие звёзды", image: "./assets/card-stars.png", imageAlt: "Первый искусственный спутник Земли",
  identifyPrompt: "Как называется изображённый объект?", identifyAnswer: "Спутник",
  matchPrompt: "Выбери верное соответствие ролей в освоении космоса.",
  matchOptions: ["Циолковский — теория; Глушко — двигатель; Королёв — ракета", "Циолковский — космонавт; Глушко — метеоролог; Королёв — врач", "Циолковский — скафандр; Глушко — телескоп; Королёв — планетарий"], matchAnswer: 0,
  events: [["gagarin", "12 апреля 1961 года — полёт Юрия Гагарина"], ["satellite", "4 октября 1957 года — первый искусственный спутник"], ["dogs", "1960 год — полёт Белки и Стрелки"], ["signal", "Первый спутник передал сигнал «бип-бип-бип»"]],
  correctOrder: ["satellite", "signal", "dogs", "gagarin"],
  errorStatements: ["Первый искусственный спутник запустили 4 октября 1957 года.", "Белка и Стрелка стали первыми людьми в космосе.", "Полёт Юрия Гагарина продолжался 108 минут.", "Орбитой называют сигнал радиопередатчика."], errorIndexes: [1, 3],
  anagramPrompt: "Составь слово из перемешанных букв.", anagramLetters: "Б • А • Т • О • Р • И", anagramAnswer: "орбита",
  crossword: [["Искусственный аппарат, движущийся вокруг Земли", "СПУТНИК"], ["Путь спутника вокруг планеты", "ОРБИТА"], ["Первая космическая пассажирка", "ЛАЙКА"], ["Костюм для жизни и работы в космосе", "СКАФАНДР"]],
};

const important = /(искусственные спутники Земли|искусственный спутник Земли|орбите|орбита|восьми километров в секунду|Константин Эдуардович Циолковский|Валентин Петрович Глушко|Сергей Павлович Королёв|4 октября 1957 года|54 сантиметра|92 дня|1440|Лайка|Белка и Стрелка|1960 году|26 часов|двадцати военных лётчиков|шестерых|Юрий Алексеевич Гагарин|скафандр|12 апреля 1961 года|«Восток-1»|108 минут|девять образцов)/g;
const importantPart = /^(искусственные спутники Земли|искусственный спутник Земли|орбите|орбита|восьми километров в секунду|Константин Эдуардович Циолковский|Валентин Петрович Глушко|Сергей Павлович Королёв|4 октября 1957 года|54 сантиметра|92 дня|1440|Лайка|Белка и Стрелка|1960 году|26 часов|двадцати военных лётчиков|шестерых|Юрий Алексеевич Гагарин|скафандр|12 апреля 1961 года|«Восток-1»|108 минут|девять образцов)$/;

const lessonMedia = [
  ["card-stars.png", "Первый искусственный спутник Земли"],
  ["card-stars.png", "Первый искусственный спутник Земли"],
  ["card-stars.png", "Первый искусственный спутник Земли"],
  ["card-stars.png", "Первый искусственный спутник Земли"],
  ["stars-dogs.png", "Собаки — участники первых космических полётов"],
  ["stars-training.png", "Подготовка первых космонавтов"],
  ["stars-suit.png", "Космический скафандр"],
  ["stars-gagarin.png", "Юрий Гагарин и космическая пища"],
  ["stars-work.png", "Разные профессии искусственных спутников"],
] as const;

function mark(text: string): ReactNode {
  return text.split(important).map((part, index) => importantPart.test(part) ? <strong className="key-fact" key={`${part}-${index}`}>{part}</strong> : part);
}

export default function StarsRoute({ onBack, onMatching, onNext }: { onBack: () => void; onMatching: () => void; onNext: () => void }) {
  const [page, setPage] = useState<Page>("plan");
  const [part, setPart] = useState(0);
  const [step, setStep] = useState(0);
  const [miniIndex, setMiniIndex] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [finalIndex, setFinalIndex] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [testVersion, setTestVersion] = useState(0);

  const mixedMiniTours = useMemo(() => miniTours.map(block => block.map(mixQuestion)), []);
  const finalSet = useMemo(
    () => [...finalQuestions, ...miniTours.flat()].sort(() => Math.random() - 0.5).slice(0, 10).map(mixQuestion),
    [testVersion],
  );

  const jump = (next: Page) => { setPage(next); setPick(null); window.scrollTo(0, 0); };
  const startPart = (index: number) => { setPart(index); setStep(index * 3); jump("lesson"); };
  const startMini = () => { setMiniIndex(0); setPick(null); jump("mini"); };
  const currentMini = mixedMiniTours[part][miniIndex];
  const nextMini = () => {
    if (miniIndex < 4) { setMiniIndex(miniIndex + 1); setPick(null); return; }
    if (part < 2) { startPart(part + 1); return; }
    jump("workshop");
  };

  return <main className="compact highrise-module route-start stars-module">
    <button className="back" onClick={page === "plan" ? onBack : () => jump("plan")}>← {page === "plan" ? "Карта тем" : "План темы"}</button>
    {page === "plan" && <>
      <div className="label">ТЕМА • ЛЕТАЮЩИЕ ЗВЁЗДЫ</div>
      <section className="route-cover">
        <img src="./assets/card-stars.png" alt="Первый искусственный спутник Земли" />
        <div>
          <span>НАУКА СССР • ОСВОЕНИЕ КОСМОСА</span>
          <h1>Летающие звёзды</h1>
          <p><strong>Искусственные спутники Земли</strong>, которые движутся по орбитам, обеспечивают связь, помогают прогнозировать погоду, находить корабли и обнаруживать лесные пожары</p>
          <dl>
            <div><dt>Первый запуск</dt><dd><strong className="date-value">4 октября 1957 года</strong></dd></div>
            <div><dt>Первый спутник</dt><dd>Шар диаметром <strong>54 сантиметра</strong></dd></div>
            <div><dt>Главные создатели</dt><dd><strong>Валентин Петрович Глушко</strong> и <strong>Сергей Павлович Королёв</strong></dd></div>
            <div><dt>Первый космонавт</dt><dd><strong>Юрий Алексеевич Гагарин</strong></dd></div>
            <div className="architects"><dt>Источник школьного тура</dt><dd>Александр Ткаченко, книга <strong>«Летающие звёзды»</strong></dd></div>
          </dl>
        </div>
      </section>
      <div className="route-rule"><b>Как будем учиться</b><p>Три учебных экрана → пять олимпиадных заданий. После трёх частей — олимпиадная мастерская, карточки и итоговая проверка.</p></div>
      <div className="part-list">
        {["Ракета и первый спутник", "Собаки и подготовка космонавтов", "Гагарин и профессии спутников"].map((title, index) => <button className="part-row" key={title} onClick={() => startPart(index)}><span><b>Часть {index + 1}. {title}</b><small>3 учебных экрана → 5 заданий</small></span><span>Открыть →</span></button>)}
        <button className="part-row final-row" onClick={() => jump("workshop")}><span><b>Олимпиадная мастерская</b><small>Изображение • соответствие • хронология • ошибки • анаграмма • кроссворд</small></span><span>Открыть →</span></button>
        <button className="part-row final-row" onClick={() => jump("cards")}><span><b>Карточки темы — ответить вслух</b><small>Даты, люди, аппараты и понятия</small></span><span>Открыть →</span></button>
        <button className="part-row writing-row" onClick={onMatching}><span><b>20 изображений — вписать названия</b><small>Обязательные подписи муниципального и регионального туров</small></span><span>Писать ответы →</span></button>
        <button className="part-row final-row" onClick={() => jump("final")}><span><b>Итоговая олимпиадная проверка</b><small>10 смешанных заданий</small></span><span>Открыть →</span></button>
      </div>
    </>}
    {page === "lesson" && <>
      <div className="progress"><span>ЛЕТАЮЩИЕ ЗВЁЗДЫ • ЧАСТЬ {part + 1} ИЗ 3 • ЭКРАН {step % 3 + 1} ИЗ 3</span><div><i style={{ width: `${(step + 1) / 9 * 100}%` }} /></div></div>
      <section className="spread"><aside><img src={`./assets/${lessonMedia[step][0]}`} alt={lessonMedia[step][1]} /><small>ИЛЛЮСТРАЦИЯ ИЗ КНИГИ МАРШРУТА</small><p><strong>{lessonMedia[step][1]}</strong></p><div className="part-tag">ЧАСТЬ {part + 1}<br /><b>{["Первый спутник", "Путь к человеку", "Полёт и работа"][part]}</b></div></aside><article><div className="chapter-label">УЧЕБНЫЙ ЭКРАН • СНАЧАЛА ПОЙМИ, ПОТОМ ПРОВЕРЬ</div><h1>{lessons[step].title}</h1><p className="lesson-text">{mark(lessons[step].text)}</p><div className="fact-strip"><b>Опорная запись</b><span>{mark(lessons[step].fact)}</span></div><div className="lesson-nav"><button className="secondary" disabled={step % 3 === 0} onClick={() => setStep(step - 1)}>← Назад</button>{step % 3 < 2 ? <button className="primary" onClick={() => setStep(step + 1)}>Следующий экран →</button> : <button className="primary" onClick={startMini}>Мини-тур: 5 заданий →</button>}</div></article></section>
    </>}
    {page === "mini" && <section className="quiz"><span>МИНИ-ТУР • ЧАСТЬ {part + 1} • {miniIndex + 1} ИЗ 5</span><h1>{currentMini.title}</h1>{currentMini.options.map((option, index) => <button key={option} disabled={pick !== null} className={pick === index ? (index === currentMini.answer ? "right" : "wrong") : ""} onClick={() => setPick(index)}>{option}</button>)}{pick !== null && <><p className="explain">{pick === currentMini.answer ? "Верно." : <>Неверно. Правильный ответ: {currentMini.options[currentMini.answer]}.</>}</p><button className="primary" onClick={nextMini}>{miniIndex < 4 ? "Следующее задание →" : part < 2 ? "Следующая часть →" : "В олимпиадную мастерскую →"}</button></>}</section>}
    {page === "workshop" && <RouteWorkshop data={workshopData} onBack={() => jump("plan")} onFinish={() => jump("cards")} />}
    {page === "cards" && <><div className="label">КАРТОЧКИ БЕЗ ПОДСКАЗОК</div><h1>Вспомни точный ответ</h1><p>Сначала произнеси ответ вслух, затем переверни карточку.</p><div className="card-grid">{cards.map((card, index) => <button className={revealed.includes(index) ? "memory flipped" : "memory"} key={card[0]} onClick={() => setRevealed(revealed.includes(index) ? revealed.filter(item => item !== index) : [...revealed, index])}><span>{revealed.includes(index) ? card[1] : card[0]}</span><small>{revealed.includes(index) ? "Ответ" : "Узнать ответ →"}</small></button>)}</div><button className="primary center" onClick={() => jump("final")}>Итоговая проверка →</button></>}
    {page === "final" && <section className="quiz"><span>ИТОГОВАЯ ПРОВЕРКА • {Math.min(finalIndex + 1, 10)} ИЗ 10</span>{finalIndex < 10 ? <><h1>{finalSet[finalIndex].title}</h1>{finalSet[finalIndex].options.map((option, index) => <button key={option} disabled={pick !== null} className={pick === index ? (index === finalSet[finalIndex].answer ? "right" : "wrong") : ""} onClick={() => { setPick(index); if (index === finalSet[finalIndex].answer) setFinalScore(finalScore + 1); }}>{option}</button>)}{pick !== null && <><p className="explain">{pick === finalSet[finalIndex].answer ? "Верно." : <>Правильный ответ: {finalSet[finalIndex].options[finalSet[finalIndex].answer]}.</>}</p><button className="primary" onClick={() => { setFinalIndex(finalIndex + 1); setPick(null); }}>{finalIndex < 9 ? "Следующее задание →" : "Узнать результат →"}</button></>}</> : <><div className="result">{finalScore}<small>/ 10</small></div><h1>{finalScore === 10 ? "МОЛОДЕЦ" : "Есть ошибки"}</h1><p>{finalScore === 10 ? "Все задания выполнены верно. Можно переходить к следующему маршруту." : "Пройди итоговую проверку ещё раз или перейди к следующему маршруту."}</p>{finalScore === 10 ? <button className="primary" onClick={onNext}>Следующий маршрут →</button> : <div className="task-actions"><button className="primary" onClick={() => { setFinalIndex(0); setFinalScore(0); setPick(null); setTestVersion(testVersion + 1); }}>Пройти ещё раз</button><button className="secondary" onClick={onNext}>Перейти к следующему маршруту →</button></div>}</>}</section>}
  </main>;
}
