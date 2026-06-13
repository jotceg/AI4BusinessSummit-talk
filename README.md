# AI4BusinessSummit-talk

Pliki prezentacji oraz projektu live demo z prezentacji **„Budowanie w erze AI: programowanie z agentami dla każdego"** przedstawionej przeze mnie na konferencji **AI4Business Summit** koła naukowego AI4Business na Uniwersytecie Ekonomicznym we Wrocławiu.

---

## Spotkaniomierz (projekt live demo)

Licznik kosztu spotkania w czasie rzeczywistym. Vite + React + TypeScript, testy Vitest.
Zero backendu, zero kluczy API, działa offline (po jednorazowym `npm install`).

### Uruchomienie
```bash
npm install
npm run dev      # http://localhost:5173
```

### Testy / build
```bash
npm test         # Vitest (cost.* zielone; verdict.* czerwone do czasu live demo)
npm run build    # tsc -b && vite build
```

### Struktura
```
CLAUDE.md              ← Claude Code czyta na starcie
docs/
  spec.md              ← co budujemy + spec werdyktu (feature na żywo)
  demo-script.md       ← runbook sceny + plan B (gotowy kod) i plan C
src/
  lib/cost.ts(.test)   ← czysta logika kosztu (testy zielone)
  lib/verdict.ts(.test)← funkcja werdyktu — DO IMPLEMENTACJI NA ŻYWO
  App.tsx              ← UI
  styles.css           ← motyw
```

### Feature na żywo (AI4Business)
`getVerdict()` w `src/lib/verdict.ts` jest celowo niezaimplementowana, a jej testy są czerwone.
Na scenie agent czyta `CLAUDE.md` + `docs/spec.md`, implementuje progi i zazielenia testy.
Szczegóły i fallback: `docs/demo-script.md`.
