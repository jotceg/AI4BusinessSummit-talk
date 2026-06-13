# CLAUDE.md — Spotkaniomierz

Licznik kosztu spotkania w czasie rzeczywistym. Aplikacja na **live demo (AI4Business)**.
Stack: **Vite + React 18 + TypeScript**, testy **Vitest**. Zero zależności sieciowych, zero backendu, zero kluczy API.

## Jak uruchomić
```bash
npm install      # raz, z internetem (przed sceną)
npm run dev      # http://localhost:5173
npm test         # Vitest, jednorazowo
npm run build    # tsc -b && vite build
```

## Architektura (mały, czysty podział)
- `src/lib/cost.ts` — **czysta logika** kosztu (stawki, koszt w czasie, formatowanie PLN, zegar). Bez efektów ubocznych. Pokryta testami w `cost.test.ts` (zielone).
- `src/lib/verdict.ts` — **funkcja werdyktu** `getVerdict(totalPLN)`. **Aktualnie placeholder.** Testy w `verdict.test.ts` są **czerwone** dopóki nie zaimplementujesz progów wg `docs/spec.md`.
- `src/App.tsx` — UI: licznik (sygnaturowy duży numer), uczestnicy, presety stawek, sterowanie, karta werdyktu. Czyta `getVerdict` i renderuje werdykt na żywo.
- `src/styles.css` — motyw „control room": ciemne tło, monospace na liczbach, akcent zmienia się z kosztem (calm → warn → alarm).

## Konwencje
- Cała logika domenowa idzie do `src/lib/` jako **czyste funkcje** i jest **testowana** — UI tylko składa i wyświetla.
- Wartości pieniężne formatuj przez `formatPLN` (pl-PL, „1 234,56 zł").
- Strict TypeScript. Po każdej zmianie: `npm test` musi być zielone, `npm run build` musi przejść.
- UI po polsku, sentence case, krótkie etykiety.

## AKTUALNE OTWARTE ZADANIE (to robimy na żywo)
**Zaimplementuj `getVerdict(totalPLN)` w `src/lib/verdict.ts` wg sekcji „Werdykt" w `docs/spec.md`, tak by `npm test` był w pełni zielony.**
Nie zmieniaj sygnatury ani interfejsu `Verdict`. Nie dotykaj UI — `App.tsx` już renderuje to, co zwróci funkcja.
