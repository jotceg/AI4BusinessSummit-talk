# Runbook live demo — AI4Business

Cel sceny: pokazać agenta, który **dopisuje feature do działającej apki** i sam **udowadnia poprawność testami**.
Narracja: *sufit* (model pisze logikę) vs *zasięg* (harness odpala test, widzi czerwone, dowozi zielone).

---

## 0. Przed sceną (w garderobie, z internetem)
```bash
git clone <twoje-repo> spotkaniomierz && cd spotkaniomierz
npm install
npm run dev      # sprawdź, że apka wstaje na :5173
npm test         # MA pokazać: cost zielone, verdict CZERWONE (6 failed)
```
- [ ] Apka działa, licznik bije, presety dodają osoby.
- [ ] Karta werdyktu pokazuje „⏳ —" (placeholder — tak ma być).
- [ ] Powiększ font terminala. Ciemny motyw apki = czytelny na rzutniku.
- [ ] Claude Code otwarty w katalogu repo, ale **bez** wykonanej zmiany.
- [ ] Po `npm install` reszta działa offline — internet na scenie niepotrzebny.

## 1. Otwarcie (≈30 s)
Uruchom apkę, dodaj C-level + Manager + Senior, wciśnij **Start**. Numer rośnie.
Tekst: „To realna matematyka — suma stawek na sekundę. Ale jedno tu nie działa…"
Pokaż kartę werdyktu z „⏳ —". „Werdykt jest pusty. Dopiszmy go — na żywo, agentem."

## 2. Pokaż czerwone (≈20 s)
```bash
npm test
```
„6 testów na czerwono. To jest *specyfikacja wykonywalna* — agent dostaje cel, nie zgadywankę."

## 3. Prompt do Claude Code — kopiuj-wklej
```
Read CLAUDE.md and docs/spec.md.
Implement getVerdict() in src/lib/verdict.ts per the "Werdykt" section so that
`npm test` is fully green. Do not change the Verdict interface or App.tsx.
Run `npm test` yourself and iterate until all tests pass.
```
Tu jest pointa: agent **sam odpala `npm test`**, czyta wynik, poprawia. To *zasięg* — nie sam tekst modelu, tylko pętla z narzędziami.

## 4. Zielone + apka ożywa (≈20 s)
Gdy testy zielone — wróć do przeglądarki. Karta werdyktu teraz pokazuje realny komentarz
(np. przy ~800 zł: „🧵 To mógł być wątek na Slacku"). Zwiększ liczbę osób / poczekaj —
werdykt i kolor przeskakują przez progi. To jest moment „aaa" dla sali.

## 5. (Opcjonalnie) feature z sali (≈40 s)
Poproś o jeden pomysł z widowni i rzuć go agentowi, np.:
```
Add a sixth verdict tier above 10000 PLN with tier "legenda" and a fitting
Polish title/message. Add a matching test case. Keep `npm test` green.
```
Pokazuje, że pętla działa też na świeżym, nieprzygotowanym żądaniu.

## 6. Domknięcie (1 zdanie)
„Model to *sufit* — jak mądry jest jeden ruch. Harness to *zasięg* — ile ruchów,
z jakimi narzędziami, z jaką pętlą sprzężenia. Demo było o zasięgu."

---

## PLAN B — jeśli agent się zatnie / brak czasu
Wklej tę gotową, sprawdzoną implementację do `src/lib/verdict.ts` (zastępując ciało `getVerdict`)
i odpal `npm test`. Wszystko przejdzie:

```ts
export function getVerdict(totalPLN: number): Verdict {
  const v = Math.max(0, totalPLN);
  if (v < 50)   return { tier: "kawa",       emoji: "☕", title: "Tyle co kawa",            message: "Spotkanie w granicach rozsądku." };
  if (v < 300)  return { tier: "mail",       emoji: "📧", title: "To mógł być mail",         message: "Serio, jedno zdanie i tyle." };
  if (v < 1000) return { tier: "watek",      emoji: "🧵", title: "To mógł być wątek na Slacku", message: "Asynchronicznie wyszłoby taniej." };
  if (v < 3000) return { tier: "agenda",     emoji: "🔥", title: "Gdzie była agenda?",       message: "Ktoś tu powinien był ją przygotować." };
  return              { tier: "katastrofa", emoji: "💸", title: "Budżet płonie",            message: "Kończcie. Naprawdę." };
}
```

## PLAN C — jeśli pada projektor/laptop
Werdykt to czysta funkcja + tabela progów. Masz ją w `docs/spec.md` — możesz opowiedzieć
mechanizm sufit/zasięg bez ekranu. Pętla „cel → test → poprawka" obroni się słownie.

## Drobne uwagi sceniczne
- Nie pozwól agentowi tknąć `App.tsx` — w promptcie jest „Do not change App.tsx". Mniej niespodzianek.
- Jeśli agent doda zależność sieciową — odrzuć. Apka ma zostać offline.
- Reset licznika między próbami: przycisk **Reset**.
