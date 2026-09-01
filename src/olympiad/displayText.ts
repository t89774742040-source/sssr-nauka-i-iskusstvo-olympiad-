/** Правило экрана «Как на олимпиаде»: в интерфейсе нет завершающих точек. Исходные цитаты в данных не меняем. */
export function displayWithoutFinalPeriod(text: string) {
  return text.replace(/\.+$/u, "");
}
