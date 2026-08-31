import { useMemo, useState } from "react";

type Group = "Названия" | "Главные факты" | "Расшифровки" | "Соответствия" | "Хронология" | "Логика";
type Route = "Московские высотки" | "ВДНХ" | "Наталия Сац" | "Летающие звёзды" | "Циолковский" | "Останкинская телебашня" | "Общее";
type Task = {
  group: Group;
  route: Route;
  prompt: string;
  image?: string;
  answer: string | number;
  options?: string[];
};

const tasks: Task[] = [
  {group:"Названия",route:"Циолковский",prompt:"Кто изображён? Впиши только фамилию",image:"./assets/match-01.png",answer:"Циолковский"},
  {group:"Названия",route:"ВДНХ",prompt:"Как называется этот выставочный комплекс?",image:"./assets/match-02.png",answer:"ВДНХ"},
  {group:"Названия",route:"Наталия Сац",prompt:"Кто изображён? Впиши только фамилию",image:"./assets/match-17.png",answer:"Сац"},
  {group:"Названия",route:"Летающие звёзды",prompt:"Впиши точное название объекта",image:"./assets/match-11.png",answer:"Спутник"},
  {group:"Названия",route:"Московские высотки",prompt:"Впиши точную подпись этого изображения из Приложения 1 к программе олимпиады",image:"./assets/match-10.png",answer:"Высотка"},
  {group:"Названия",route:"Останкинская телебашня",prompt:"Впиши точное название объекта",image:"./assets/match-06.png",answer:"Телебашня"},

  {group:"Главные факты",route:"Московские высотки",prompt:"В каком году к 800-летию Москвы заложили восемь высотных зданий?",options:["В 1939 году","В 1947 году","В 1959 году"],answer:1},
  {group:"Главные факты",route:"Московские высотки",prompt:"Каков итог строительства московских высоток?",options:["Семь заложили — восемь построили","Построили все восемь","Восемь заложили — семь построили"],answer:2},
  {group:"Главные факты",route:"ВДНХ",prompt:"Когда впервые открылась Всесоюзная сельскохозяйственная выставка (ВСХВ)?",options:["1 августа 1939 года","В 1947 году","4 октября 1957 года"],answer:0},
  {group:"Главные факты",route:"ВДНХ",prompt:"Как первоначально называлась выставка, которую позже назвали ВДНХ?",options:["ВДНХ","ВВЦ","ВСХВ"],answer:2},
  {group:"Главные факты",route:"Наталия Сац",prompt:"Чем прежде всего знаменита Наталия Ильинична Сац?",options:["Строительством телебашни","Созданием театров для детей","Запуском спутника"],answer:1},
  {group:"Главные факты",route:"Наталия Сац",prompt:"Какой образ стал важным символом театра Наталии Сац?",options:["Золотой колос","Летящая звезда","Синяя птица"],answer:2},
  {group:"Главные факты",route:"Летающие звёзды",prompt:"Когда был запущен первый искусственный спутник Земли?",options:["1 августа 1939 года","4 октября 1957 года","21 ноября 1965 года"],answer:1},
  {group:"Главные факты",route:"Летающие звёзды",prompt:"Кто отвечал за ракету и кто — за её двигатель?",options:["Сергей Королёв — ракета; Валентин Глушко — двигатель","Валентин Глушко — ракета; Сергей Королёв — театр","Николай Никитин — ракета; Вера Мухина — двигатель"],answer:0},
  {group:"Главные факты",route:"Циолковский",prompt:"Какая роль точнее всего описывает Константина Циолковского?",options:["Первый космонавт","Конструктор первого спутника","Теоретик космонавтики"],answer:2},
  {group:"Главные факты",route:"Циолковский",prompt:"Где Циолковский самостоятельно учился в Москве?",options:["В Московском университете","В Румянцевской библиотеке","В Пулковской обсерватории"],answer:1},
  {group:"Главные факты",route:"Останкинская телебашня",prompt:"В каком году завершили строительство Останкинской телебашни?",options:["1967","1957","1939"],answer:0},
  {group:"Главные факты",route:"Останкинская телебашня",prompt:"Какова высота Останкинской телебашни?",options:["354 метра","800 метров","540 метров"],answer:2},

  {group:"Расшифровки",route:"Общее",prompt:"Как расшифровывается СССР?",options:["Всесоюзная сельскохозяйственная выставка","Союз Советских Социалистических Республик","Выставка достижений народного хозяйства"],answer:1},
  {group:"Расшифровки",route:"ВДНХ",prompt:"Как расшифровывается ВДНХ?",options:["Всероссийский дворец науки и хозяйства","Выставка древностей народов и художников","Выставка достижений народного хозяйства"],answer:2},
  {group:"Расшифровки",route:"ВДНХ",prompt:"Что означает сокращение ВСХВ?",options:["Всесоюзная сельскохозяйственная выставка","Всемирная советская художественная выставка","Всесоюзный совет хозяйственных выставок"],answer:0},
  {group:"Расшифровки",route:"ВДНХ",prompt:"Что означает сокращение ВВЦ?",options:["Всесоюзная сельскохозяйственная выставка","Всероссийский выставочный центр","Выставка достижений народного хозяйства"],answer:1},
  {group:"Расшифровки",route:"Московские высотки",prompt:"Как расшифровывается МГУ?",options:["Министерство иностранных дел","Международная космическая станция","Московский государственный университет"],answer:2},
  {group:"Расшифровки",route:"Московские высотки",prompt:"Как расшифровывается МИД?",options:["Министерство иностранных дел","Московский государственный университет","Всероссийский выставочный центр"],answer:0},
  {group:"Расшифровки",route:"Летающие звёзды",prompt:"Что означает сокращение МКС?",options:["Московский государственный университет","Международная космическая станция","Министерство иностранных дел"],answer:1},
  {group:"Расшифровки",route:"Летающие звёзды",prompt:"Что означает слово «скафандр»?",options:["Воздушный шар","Космическая ракета","Лодка для человека"],answer:2},
  {group:"Расшифровки",route:"Циолковский",prompt:"Что Циолковский называл «слухачами»?",options:["Железные воронки","Воздушные змеи","Зеркальные пластинки"],answer:0},
  {group:"Расшифровки",route:"Останкинская телебашня",prompt:"Что называют фидерами?",options:["Стальные канаты, сжимающие бетон","Толстые кабели, по которым сигнал идёт вверх","Ноги-опоры башни"],answer:1},
  {group:"Расшифровки",route:"Наталия Сац",prompt:"Что означает Синяя птица в театре Наталии Сац?",options:["Герб Алма-Аты","Название первого кинотеатра","Птица счастья"],answer:2},

  {group:"Соответствия",route:"Общее",prompt:"Выбери верное соответствие",options:["Циолковский — первый космонавт","Циолковский — теоретик космонавтики","Циолковский — архитектор"],answer:1},
  {group:"Соответствия",route:"Общее",prompt:"Выбери верное соответствие",options:["Наталия Сац — ракетный двигатель","Наталия Сац — московские высотки","Наталия Сац — театр для детей"],answer:2},
  {group:"Соответствия",route:"Общее",prompt:"Выбери верное соответствие",options:["Николай Никитин — конструкция телебашни","Николай Никитин — первый спутник","Николай Никитин — Синяя птица"],answer:0},
  {group:"Соответствия",route:"Общее",prompt:"Выбери верное соответствие",options:["Сергей Королёв — детский театр","Сергей Королёв — ракеты и космические аппараты","Сергей Королёв — ВДНХ"],answer:1},

  {group:"Хронология",route:"Общее",prompt:"Какая последовательность событий верна?",options:["Запуск спутника → открытие ВСХВ → закладка высоток","Закладка высоток → запуск спутника → открытие ВСХВ","Открытие ВСХВ → закладка высоток → запуск спутника"],answer:2},
  {group:"Хронология",route:"Общее",prompt:"Какая последовательность дат расположена от ранней к поздней?",options:["1939 → 1947 → 1957 → 1967","1947 → 1939 → 1967 → 1957","1957 → 1939 → 1947 → 1967"],answer:0},
  {group:"Хронология",route:"Общее",prompt:"Что произошло раньше?",options:["Открытие театра Наталии Сац 21 ноября 1965 года","Запуск первого спутника","Завершение строительства Останкинской телебашни"],answer:1},

  {group:"Логика",route:"Общее",prompt:"Найди лишний объект: два относятся к архитектуре Москвы, один — к космонавтике",options:["Высотка","Телебашня","Спутник"],answer:2},
  {group:"Логика",route:"Общее",prompt:"В каком утверждении допущена ошибка?",options:["Первый спутник запустили в 1957 году","Наталия Сац создала первый искусственный спутник Земли","Циолковский был теоретиком космонавтики"],answer:1},
  {group:"Логика",route:"Общее",prompt:"Как называется группа московских зданий, из которых восемь заложили, а семь построили?",options:["Высотки","Спутники","Павильоны"],answer:0},
  {group:"Логика",route:"Общее",prompt:"Какой ряд объединён темой космонавтики?",options:["Сац — Синяя птица — театр","ВСХВ — павильон — фонтан","Циолковский — Королёв — Спутник"],answer:2},
  {group:"Логика",route:"Общее",prompt:"В каком ряду все пары составлены верно?",options:["ВДНХ — спутник; Сац — высотка; Телебашня — библиотека","ВДНХ — выставка; Сац — театр; Телебашня — связь и телевидение","ВДНХ — ракета; Сац — инженер; Телебашня — театр"],answer:1},
];

const groups: {name: Group; count: number; text: string}[] = [
  {name:"Названия",count:6,text:"Узнать изображение и самостоятельно вписать точное название"},
  {name:"Главные факты",count:12,text:"Даты, люди, объекты и основные достижения"},
  {name:"Расшифровки",count:11,text:"Понять сокращения и главные понятия из всех маршрутов"},
  {name:"Соответствия",count:4,text:"Связать человека, объект и область"},
  {name:"Хронология",count:3,text:"Восстановить порядок событий"},
  {name:"Логика",count:5,text:"Найти ошибку, лишнее и общий признак"},
];

const normalize = (value: string) => value.trim().toLocaleLowerCase("ru-RU").replace(/ё/g,"е").replace(/\s+/g," ");

const ruPlural = (n: number, one: string, few: string, many: string) => {
  const n10 = n % 10, n100 = n % 100;
  if (n100 >= 11 && n100 <= 14) return many;
  if (n10 === 1) return one;
  if (n10 >= 2 && n10 <= 4) return few;
  return many;
};

const splitLabel = (got: number, total: number) => {
  const err = total - got;
  if (err === 0) return "Всё верно";
  return `Верно ${got}, ${ruPlural(err, "ошибка", "ошибки", "ошибок")} ${err}`;
};

const answerText = (t: Task, a: string | number | null) => {
  if (a === null || a === "") return "—";
  if (t.options && typeof a === "number") return t.options[a] ?? "—";
  return String(a);
};

const keyText = (t: Task) => typeof t.answer === "string" ? t.answer : t.options?.[t.answer as number] ?? "";

const gradeOf = (score: number, total: number) => {
  const errors = total - score;
  if (errors === 0) return {title: "ОТЛИЧНО", text: "Отлично. Все задания выполнены верно."};
  if (errors <= 2) return {title: "МОЛОДЕЦ", text: errors === 1 ? "Одна ошибка — можно посмотреть, какая." : "Две ошибки — можно посмотреть, какие."};
  if (score / total >= .8) return {title: "ХОРОШО", text: "Хорошо. Посмотри ошибки и закрепи."};
  return {title: "Есть ошибки", text: "Есть ошибки. Пройди ещё раз."};
};

export default function FinalExpedition({onBack}:{onBack:()=>void}) {
  const [page,setPage] = useState<"intro"|"test"|"result"|"review">("intro");
  const [mode,setMode] = useState<"all"|"names">("all");
  const [index,setIndex] = useState(0);
  const [reviewIndex,setReviewIndex] = useState<number|null>(null);
  const [answers,setAnswers] = useState<(string|number|null)[]>([]);
  const [value,setValue] = useState<string|number|"">("");
  const active = useMemo(() => mode === "names" ? tasks.filter(t=>t.group==="Названия") : tasks,[mode]);
  const task = active[index];
  const correct = (t:Task,a:string|number|null) => typeof t.answer === "string" ? typeof a === "string" && normalize(a) === normalize(t.answer) : a === t.answer;
  const start = (nextMode:"all"|"names") => {setMode(nextMode);setIndex(0);setAnswers([]);setValue("");setPage("test");scrollTo(0,0)};
  const submit = () => {
    if (value === "") return;
    const next = [...answers,value];
    setAnswers(next); setValue("");
    if(index + 1 >= active.length){setPage("result");scrollTo(0,0)} else {setIndex(index+1);scrollTo(0,0)}
  };
  const score = answers.reduce<number>((sum,a,i)=>sum+(correct(active[i],a)?1:0),0);
  const grade = gradeOf(score, active.length);
  const routeNames = ["Московские высотки","ВДНХ","Наталия Сац","Летающие звёзды","Циолковский","Останкинская телебашня"] as Route[];

  if(page === "intro") return <main className="compact finale-shell">
    <button className="back" onClick={onBack}>← Карта маршрутов</button>
    <section className="finale-cover">
      <span>ОБЩАЯ ПРОВЕРКА • 3–6 КЛАССЫ</span>
      <h1>Финальная экспедиция</h1>
      <p>Все шесть маршрутов соединяются в одной проверке. Подсказок и показа правильного ответа во время прохождения не будет.</p>
      <div className="finale-rounds">{groups.map((g,i)=><div key={g.name}><b>{i+1}. {g.name}</b><span>{g.text}</span><strong>{g.count} {g.count >= 5 ? "заданий" : "задания"}</strong></div>)}</div>
      <div className="finale-actions"><button className="primary" onClick={()=>start("all")}>Начать 41 задание →</button><button className="secondary" onClick={()=>start("names")}>Только написание названий</button></div>
    </section>
  </main>;

  if(page === "result") return <main className="compact finale-shell">
    <button className="back" onClick={onBack}>← Карта маршрутов</button>
    <section className="finale-result">
      <span>{mode === "all" ? "ФИНАЛЬНАЯ ЭКСПЕДИЦИЯ ЗАВЕРШЕНА" : "ТРЕНИРОВКА НАЗВАНИЙ ЗАВЕРШЕНА"}</span>
      <div className="finale-score"><strong>{score}</strong><small>из {active.length}</small></div>
      <p><strong>Правильно: {score} из {active.length}</strong>{score === active.length ? "." : `. Ошибок: ${active.length - score}.`}</p>
      <h1>{grade.title}</h1>
      <p>{grade.text}</p>
      {mode === "all" && <><h2>Где были ошибки по маршрутам</h2><div className="diagnostic-grid">{routeNames.map(route=>{
        const ids=active.map((t,i)=>t.route===route?i:-1).filter(i=>i>=0); const got=ids.filter(i=>correct(active[i],answers[i])).length;
        return <div key={route}><b>{route}</b><span>{splitLabel(got, ids.length)}</span><i><em style={{width:`${got/ids.length*100}%`}}/></i></div>
      })}</div><h2>Какой тип заданий</h2><div className="skill-grid">{groups.map(g=>{const ids=active.map((t,i)=>t.group===g.name?i:-1).filter(i=>i>=0);const got=ids.filter(i=>correct(active[i],answers[i])).length;return <div key={g.name}><b>{g.name}</b><span>{splitLabel(got, ids.length)}</span></div>})}</div></>}
      <div className="finale-actions"><button className="secondary" onClick={()=>{setReviewIndex(null);setPage("review");scrollTo(0,0)}}>Посмотреть свой тест</button><button className="primary" onClick={()=>start(mode)}>Пройти ещё раз</button>{mode === "all" && <button className="secondary" onClick={()=>start("names")}>Повторить написание</button>}</div>
    </section>
  </main>;

  if(page === "review" && reviewIndex !== null) {
    const reviewTask = active[reviewIndex];
    const given = answers[reviewIndex] ?? null;
    const ok = correct(reviewTask, given);
    const correctText = keyText(reviewTask);
    const givenText = answerText(reviewTask, given);
    return <main className="compact finale-shell finale-test">
      <button className="back" onClick={()=>{setReviewIndex(null);scrollTo(0,0)}}>← К перечню</button>
      <div className="progress"><span>РАЗБОР • {reviewTask.group.toLocaleUpperCase("ru-RU")} • ЗАДАНИЕ {reviewIndex+1} ИЗ {active.length} • {ok ? "ВЕРНО" : "ОШИБКА"}</span><div><i style={{width:`${(reviewIndex+1)/active.length*100}%`}}/></div></div>
      <section className={reviewTask.image ? "finale-task" : "finale-task no-image"}>
        {reviewTask.image && <div className="finale-image"><img src={reviewTask.image} alt="Изображение для задания"/></div>}
        <div className="finale-question"><span>{reviewTask.route === "Общее" ? "ВСЕ МАРШРУТЫ" : reviewTask.route.toLocaleUpperCase("ru-RU")}</span><h1>{reviewTask.prompt}</h1>
          {reviewTask.options ? <div className="finale-options">{reviewTask.options.map((o,i)=>{
            const isCorrect = i === reviewTask.answer;
            const isGiven = i === given;
            return <button key={o} disabled className={isCorrect ? "right" : isGiven ? "wrong" : ""}>{o}</button>;
          })}</div> : <p>Твой ответ: {givenText}</p>}
          <p className="explain">{ok ? "Верно!" : `Ошибка. Правильный ответ: ${correctText}`}</p>
        </div>
      </section>
    </main>;
  }

  if(page === "review") {
    const rows = active.map((t,i) => {
      const given = answers[i] ?? null;
      const ok = correct(t, given);
      return {i, t, ok, givenText: answerText(t, given), correctText: keyText(t)};
    });
    const errorRows = rows.filter(r => !r.ok);
    const okRows = rows.filter(r => r.ok);
    const renderRow = (row: typeof rows[number]) => (
      <button type="button" key={row.i} className={row.ok ? "finale-review-item" : "finale-review-item is-error"} onClick={()=>{setReviewIndex(row.i);scrollTo(0,0)}}>
        <b>Задание {row.i + 1}. {row.t.prompt}</b>
        <strong>{row.ok ? "Верно" : "Ошибка"}</strong>
        <span>Твой ответ: {row.givenText}</span>
        <span>Правильный ответ: {row.correctText}</span>
      </button>
    );
    return <main className="compact finale-shell">
      <button className="back" onClick={()=>{setPage("result");scrollTo(0,0)}}>← К результату</button>
      <section className="finale-result">
        <span>РАЗБОР ТЕСТА</span>
        <h1>Твои ответы</h1>
        <p><strong>Правильно: {score} из {active.length}</strong>{score === active.length ? "." : `. Ошибок: ${active.length - score}.`}</p>
        {errorRows.length > 0 && <><h2 className="finale-review-head">Ошибки</h2><div className="finale-review-list">{errorRows.map(renderRow)}</div></>}
        {okRows.length > 0 && <><h2 className="finale-review-head">Верно</h2><div className="finale-review-list">{okRows.map(renderRow)}</div></>}
      </section>
    </main>;
  }

  return <main className="compact finale-shell finale-test">
    <button className="back" onClick={()=>setPage("intro")}>← О проверке</button>
    <div className="progress"><span>{task.group.toLocaleUpperCase("ru-RU")} • ЗАДАНИЕ {index+1} ИЗ {active.length}</span><div><i style={{width:`${(index+1)/active.length*100}%`}}/></div></div>
    <section className={task.image ? "finale-task" : "finale-task no-image"}>
      {task.image && <div className="finale-image"><img src={task.image} alt="Изображение для задания"/></div>}
      <div className="finale-question"><span>{task.route === "Общее" ? "ВСЕ МАРШРУТЫ" : task.route.toLocaleUpperCase("ru-RU")}</span><h1>{task.prompt}</h1>
        {task.options ? <div className="finale-options">{task.options.map((o,i)=><button className={value===i?"selected":""} onClick={()=>setValue(i)} key={o}>{o}</button>)}</div> : <><label htmlFor="final-answer">Ответ без подсказки</label><input id="final-answer" autoFocus value={value as string} onChange={e=>setValue(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Впиши точное название"/></>}
        <button className="primary finale-next" disabled={value===""} onClick={submit}>{index+1===active.length?"Завершить проверку":"Сохранить ответ и дальше →"}</button>
      </div>
    </section>
  </main>;
}
