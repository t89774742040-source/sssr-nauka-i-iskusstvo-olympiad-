import { useState } from "react";
import AlphabetCipherPractice from "./olympiad/AlphabetCipherPractice";
import LetterSeriesPractice from "./olympiad/LetterSeriesPractice";
import NoVowelsPractice from "./olympiad/NoVowelsPractice";
import { alphabetCipherTasks } from "./olympiad/alphabetCipherData";
import { letterSeriesTasks } from "./olympiad/letterSeriesData";
import { noVowelsTasks } from "./olympiad/noVowelsData";

const sections = [
  {id: "crosswords", name: "Кроссворды", text: "Сетки и определения"},
  {id: "rebuses", name: "Ребусы и изографы", text: "Разгадываем ребусы и находим слова в рисунках"},
  {id: "word-logic", name: "Словесная логика", text: "Без гласных, буквенные ряды, шифры и сетки"},
  {id: "numbers-images", name: "Числа и изображения", text: "Закономерности, числа и рисунки"},
  {id: "reading", name: "Чтение", text: "Олимпиадные тексты и задания к ним"},
  {id: "word", name: "Слово", text: "Составление слов из заданного слова"},
] as const;

type SectionId = typeof sections[number]["id"];
type PracticeId = "no-vowels" | "letter-series" | "alphabet-cipher";

const ruPlural = (n: number, one: string, few: string, many: string) => {
  const n10 = n % 10, n100 = n % 100;
  if (n100 >= 11 && n100 <= 14) return many;
  if (n10 === 1) return one;
  if (n10 >= 2 && n10 <= 4) return few;
  return many;
};

export default function OlympiadTrainer({onBack}:{onBack:()=>void}) {
  const [sectionId, setSectionId] = useState<SectionId | null>(null);
  const [practice, setPractice] = useState<PracticeId | null>(null);
  const section = sections.find(item => item.id === sectionId) ?? null;

  const openHub = () => { setSectionId(null); setPractice(null); scrollTo(0, 0); };
  const openSection = (id: SectionId) => { setSectionId(id); setPractice(null); scrollTo(0, 0); };

  if (sectionId === "word-logic" && practice === "no-vowels") {
    return <NoVowelsPractice onBack={() => { setPractice(null); scrollTo(0, 0); }} />;
  }

  if (sectionId === "word-logic" && practice === "letter-series") {
    return <LetterSeriesPractice onBack={() => { setPractice(null); scrollTo(0, 0); }} />;
  }

  if (sectionId === "word-logic" && practice === "alphabet-cipher") {
    return <AlphabetCipherPractice onBack={() => { setPractice(null); scrollTo(0, 0); }} />;
  }

  if (section) {
    const wordLogic = section.id === "word-logic";
    return (
      <main className="compact olympiad-shell">
        <section className="olympiad-cover">
          <button type="button" className="olympiad-back" onClick={openHub}>← К разделам олимпиады</button>
          <h1>{section.name}</h1>
          <p className="olympiad-lead">{section.text}</p>
          {wordLogic ? (
            <div className="olympiad-exercises">
              <button type="button" className="olympiad-card" onClick={() => { setPractice("no-vowels"); scrollTo(0, 0); }}>
                <h2>Без гласных</h2>
                <p>Восстанови предложение</p>
                <strong className="olympiad-count">{noVowelsTasks.length} {ruPlural(noVowelsTasks.length, "задание", "задания", "заданий")}</strong>
              </button>
              <button type="button" className="olympiad-card" onClick={() => { setPractice("letter-series"); scrollTo(0, 0); }}>
                <h2>Буквенные ряды</h2>
                <p>Продолжи ряд</p>
                <strong className="olympiad-count">{letterSeriesTasks.length} {ruPlural(letterSeriesTasks.length, "задание", "задания", "заданий")}</strong>
              </button>
              <button type="button" className="olympiad-card" onClick={() => { setPractice("alphabet-cipher"); scrollTo(0, 0); }}>
                <h2>Шифр по алфавиту</h2>
                <p>Расшифруй слово</p>
                <strong className="olympiad-count">{alphabetCipherTasks.length} {ruPlural(alphabetCipherTasks.length, "задание", "задания", "заданий")}</strong>
              </button>
            </div>
          ) : (
            <div className="olympiad-practice" />
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="compact olympiad-shell">
      <section className="olympiad-cover">
        <button type="button" className="olympiad-back" onClick={onBack}>← К финальной экспедиции</button>
        <span>ТРЕНАЖЁР</span>
        <h1>Как на олимпиаде</h1>
        <div className="olympiad-sections">
          {sections.map(item => (
            <button
              type="button"
              key={item.id}
              className="olympiad-card"
              onClick={() => openSection(item.id)}
            >
              <h2>{item.name}</h2>
              <p>{item.text}</p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
