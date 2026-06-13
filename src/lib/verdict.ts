// ─────────────────────────────────────────────────────────────────────────────
//  FEATURE NA ŻYWO (AI4Business) — do zaimplementowania na scenie przez agenta.
//
//  Zadanie: getVerdict(totalPLN) ma zwracać "werdykt" dla danego kosztu spotkania
//  wg progów opisanych w docs/spec.md (sekcja "Werdykt"). Testy w verdict.test.ts
//  są teraz CZERWONE — implementacja ma je zazielenić.
//
//  W stanie wyjściowym funkcja zwraca bezpieczny placeholder, żeby apka działała,
//  ale werdykt pokazuje "⏳ —". Po implementacji przycisk ożywa.
// ─────────────────────────────────────────────────────────────────────────────

export interface Verdict {
  /** Identyfikator progu, np. "kawa" | "mail" | "watek" | "agenda" | "katastrofa". */
  tier: string;
  emoji: string;
  title: string;
  message: string;
}

export function getVerdict(totalPLN: number): Verdict {
  // Wartości ujemne (np. przed startem) traktujemy jak 0.
  const cost = totalPLN > 0 ? totalPLN : 0;

  if (cost < 50) {
    return {
      tier: "kawa",
      emoji: "☕",
      title: "Tyle co kawa",
      message: "Spotkanie w granicach rozsądku.",
    };
  }

  if (cost < 300) {
    return {
      tier: "mail",
      emoji: "📧",
      title: "To mógł być mail",
      message: "Serio, jedno zdanie i tyle.",
    };
  }

  if (cost < 1000) {
    return {
      tier: "watek",
      emoji: "🧵",
      title: "To mógł być wątek na Slacku",
      message: "Asynchronicznie wyszłoby taniej.",
    };
  }

  if (cost < 3000) {
    return {
      tier: "agenda",
      emoji: "🔥",
      title: "Gdzie była agenda?",
      message: "Ktoś tu powinien był ją przygotować.",
    };
  }

  return {
    tier: "katastrofa",
    emoji: "💸",
    title: "Budżet płonie",
    message: "Kończcie. Naprawdę.",
  };
}
