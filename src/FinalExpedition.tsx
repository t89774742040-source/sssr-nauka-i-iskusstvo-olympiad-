import { useMemo, useState } from "react";

type Group = "Названия" | "Главные факты" | "Соответствия" | "Хронология" | "Логика";
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
  {group:"Названия",route:"Московские высотки",prompt:"Впиши точное название объекта",image:"./assets/match-10.png",answer:"Высотка"},
  {group:"Названия",route:"Останкинская телебашня",prompt:"Впиши точное название объекта",image:"./assets/match-06.png",answer:"Телебашня"},

  {group:"Главные факты",route:"Московские высотки",prompt:"В каком году к 800-летию Москвы заложили восемь высотных зданий?",options:["В 1947 году","В 1939 году","В 1959 году"],answer:0},
  {group:"Главные факты",route:"Московские высотки",prompt:"Каков итог строительства московских высоток?",options:["Восемь заложили — семь построили","Семь заложили — восемь построили","Построили все восемь"],answer:0},
  {group:"Главные факты",route:"ВДНХ",prompt:"Когда впервые открылась выставка?",options:["1 августа 1939 года","В 1947 году","4 октября 1957 года"],answer:0},
  {group:"Главные факты",route:"ВДНХ",prompt:"Как первоначально называлась выставка?",options:["ВСХВ","ВДНХ","ВВЦ"],answer:0},
  {group:"Главные факты",route:"Наталия Сац",prompt:"Чем прежде всего знаменита Наталия Ильинична Сац?",options:["Созданием театров для детей","Строительством телебашни","Запуском спутника"],answer:0},
  {group:"Главные факты",route:"Наталия Сац",prompt:"Какой образ стал важным символом театра Наталии Сац?",options:["Синяя птица","Золотой колос","Летящая звезда"],answer:0},
  {group:"Главные факты",route:"Летающие звёзды",prompt:"Когда был запущен первый искусственный спутник Земли?",options:["4 октября 1957 года","1 августа 1939 года","21 ноября 1965 года"],answer:0},
  {group:"Главные факты",route:"Летающие звёзды",prompt:"Кто отвечал за ракету и кто — за её двигатель?",options:["Сергей Королёв — ракета; Валентин Глушко — двигатель","Валентин Глушко — ракета; Сергей Королёв — театр","Николай Никитин — ракета; Вера Мухина — двигатель"],answer:0},
  {group:"Главные факты",route:"Циолковский",prompt:"Какая роль точнее всего описывает Константина Циолковского?",options:["Теоретик космонавтики","Первый космонавт","Конструктор первого спутника"],answer:0},
  {group:"Главные факты",route:"Циолковский",prompt:"Где Циолковский самостоятельно учился в Москве?",options:["В Румянцевской библиотеке","В Московском университете","В Пулковской обсерватории"],answer:0},
  {group:"Главные факты",route:"Останкинская телебашня",prompt:"В каком году завершили строительство Останкинской телебашни?",options:["1967","1957","1939"],answer:0},
  {group:"Главные факты",route:"Останкинская телебашня",prompt:"Какова высота Останкинской телебашни?",options:["540 метров","354 метра","800 метров"],answer:0},

  {group:"Соответствия",route:"Общее",prompt:"Выбери верное соответствие",options:["Циолковский — теоретик космонавтики","Циолковский — первый космонавт","Циолковский — архитектор"],answer:0},
  {group:"Соответствия",route:"Общее",prompt:"Выбери верное соответствие",options:["Наталия Сац — театр для детей","Наталия Сац — ракетный двигатель","Наталия Сац — московские высотки"],answer:0},
  {group:"Соответствия",route:"Общее",prompt:"Выбери верное соответствие",options:["Николай Никитин — конструкция телебашни","Николай Никитин — первый спутник","Николай Никитин — Синяя птица"],answer:0},
  {group:"Соответствия",route:"Общее",prompt:"Выбери верное соответствие",options:["Сергей Королёв — ракеты и космические аппараты","Сергей Королёв — детский театр","Сергей Королёв — ВДНХ"],answer:0},

  {group:"Хронология",route:"Общее",prompt:"Какая последовательность событий верна?",options:["Открытие ВСХВ → закладка высоток → запуск спутника","Запуск спутника → открытие ВСХВ → закладка высоток","Закладка высоток → запуск спутника → открытие ВСХВ"],answer:0},
  {group:"Хронология",route:"Общее",prompt:"Какая последовательность дат расположена от ранней к поздней?",options:["1939 → 1947 → 1957 → 1967","1947 → 1939 → 1967 → 1957","1957 → 1939 → 1947 → 1967"],answer:0},
  {group:"Хронология",route:"Общее",prompt:"Что произошло раньше?",options:["Запуск первого спутника","Открытие театра Наталии Сац 21 ноября 1965 года","Завершение строительства Останкинской телебашни"],answer:0},

  {group:"Логика",route:"Общее",prompt:"Найди лишний объект: два относятся к архитектуре Москвы, один — к космонавтике",options:["Спутник","Высотка","Телебашня"],answer:0},
  {group:"Логика",route:"Общее",prompt:"В каком утверждении допущена ошибка?",options:["Наталия Сац создала первый искусственный спутник Земли","Первый спутник запустили в 1957 году","Циолковский был теоретиком космонавтики"],answer:0},
  {group:"Логика",route:"Общее",prompt:"Определи объект по признакам: ступенчатый силуэт, центральная башня, шпиль",options:["Высотка","Спутник","Синяя птица"],answer:0},
  {group:"Логика",route:"Общее",prompt:"Какой ряд объединён темой космонавтики?",options:["Циолковский — Королёв — Спутник","Сац — Синяя птица — театр","ВСХВ — павильон — фонтан"],answer:0},
  {group:"Логика",route:"Общее",prompt:"В каком ряду все пары составлены верно?",options:["ВДНХ — выставка; Сац — театр; Телебашня — связь и телевидение","ВДНХ — спутник; Сац — высотка; Телебашня — библиотека","ВДНХ — ракета; Сац — инженер; Телебашня — театр"],answer:0},
];

const groups: {name: Group; count: number; text: string}[] = [
  {name:"Названия",count:6,text:"Узнать изображение и самостоятельно вписать точное название"},
  {name:"Главные факты",count:12,text:"Даты, люди, объекты и основные достижения"},
  {name:"Соответствия",count:4,text:"Связать человека, объект и область"},
  {name:"Хронология",count:3,text:"Восстановить порядок событий"},
  {name:"Логика",count:5,text:"Найти ошибку, лишнее и общий признак"},
];

const normalize = (value: string) => value.trim().toLocaleLowerCase("ru-RU").replace(/ё/g,"е").replace(/\s+/g," ");

export default function FinalExpedition({onBack}:{onBack:()=>void}) {
  const [page,setPage] = useState<"intro"|"test"|"result">("intro");
  const [mode,setMode] = useState<"all"|"names">("all");
  const [index,setIndex] = useState(0);
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
  const routeNames = ["Московские высотки","ВДНХ","Наталия Сац","Летающие звёзды","Циолковский","Останкинская телебашня"] as Route[];

  if(page === "intro") return <main className="compact finale-shell">
    <button className="back" onClick={onBack}>← Карта маршрутов</button>
    <section className="finale-cover">
      <span>ОБЩАЯ ПРОВЕРКА • 3–6 КЛАССЫ</span>
      <h1>Финальная экспедиция</h1>
      <p>Все шесть маршрутов соединяются в одной проверке. Подсказок и показа правильного ответа во время прохождения не будет.</p>
      <div className="finale-rounds">{groups.map((g,i)=><div key={g.name}><b>{i+1}. {g.name}</b><span>{g.text}</span><strong>{g.count} {g.count >= 5 ? "заданий" : "задания"}</strong></div>)}</div>
      <div className="finale-actions"><button className="primary" onClick={()=>start("all")}>Начать 30 заданий →</button><button className="secondary" onClick={()=>start("names")}>Только написание названий</button></div>
    </section>
  </main>;

  if(page === "result") return <main className="compact finale-shell">
    <button className="back" onClick={onBack}>← Карта маршрутов</button>
    <section className="finale-result">
      <span>{mode === "all" ? "ФИНАЛЬНАЯ ЭКСПЕДИЦИЯ ЗАВЕРШЕНА" : "ТРЕНИРОВКА НАЗВАНИЙ ЗАВЕРШЕНА"}</span>
      <div className="finale-score"><strong>{score}</strong><small>из {active.length}</small></div>
      <h1>{score/active.length >= .8 ? "Отличная готовность" : score/active.length >= .6 ? "Хорошая основа — нужно закрепить" : "Маршруты стоит повторить"}</h1>
      {mode === "all" && <><h2>Диагностика по маршрутам</h2><div className="diagnostic-grid">{routeNames.map(route=>{
        const ids=active.map((t,i)=>t.route===route?i:-1).filter(i=>i>=0); const got=ids.filter(i=>correct(active[i],answers[i])).length;
        return <div key={route}><b>{route}</b><span>{got} из {ids.length}</span><i><em style={{width:`${got/ids.length*100}%`}}/></i></div>
      })}</div><h2>Навыки</h2><div className="skill-grid">{groups.map(g=>{const ids=active.map((t,i)=>t.group===g.name?i:-1).filter(i=>i>=0);const got=ids.filter(i=>correct(active[i],answers[i])).length;return <div key={g.name}><b>{g.name}</b><span>{got} из {ids.length}</span></div>})}</div></>}
      <div className="finale-actions"><button className="primary" onClick={()=>start("all")}>Другой вариант →</button><button className="secondary" onClick={()=>start("names")}>Повторить написание</button></div>
    </section>
  </main>;

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
