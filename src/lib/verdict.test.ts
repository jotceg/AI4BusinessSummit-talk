import { describe, it, expect } from "vitest";
import { getVerdict } from "./verdict";

// Te testy są CZERWONE w stanie wyjściowym. Feature na żywo (AI4Business)
// polega na zaimplementowaniu getVerdict() tak, by wszystkie przeszły.
//
// Progi (PLN, włącznie z dolną granicą):
//   [0, 50)        -> "kawa"        ☕
//   [50, 300)      -> "mail"        📧
//   [300, 1000)    -> "watek"       🧵
//   [1000, 3000)   -> "agenda"      🔥
//   [3000, ∞)      -> "katastrofa"  💸

describe("getVerdict — progi werdyktu", () => {
  it("tyle co kawa", () => {
    expect(getVerdict(0).tier).toBe("kawa");
    expect(getVerdict(49.99).tier).toBe("kawa");
  });

  it("to mógł być mail", () => {
    expect(getVerdict(50).tier).toBe("mail");
    expect(getVerdict(299.99).tier).toBe("mail");
  });

  it("to mógł być wątek na Slacku", () => {
    expect(getVerdict(300).tier).toBe("watek");
    expect(getVerdict(999.99).tier).toBe("watek");
  });

  it("ktoś tu powinien był przygotować agendę", () => {
    expect(getVerdict(1000).tier).toBe("agenda");
    expect(getVerdict(2999.99).tier).toBe("agenda");
  });

  it("budżet płonie", () => {
    expect(getVerdict(3000).tier).toBe("katastrofa");
    expect(getVerdict(99999).tier).toBe("katastrofa");
  });

  it("każdy werdykt ma emoji, tytuł i komunikat", () => {
    const v = getVerdict(500);
    expect(v.emoji.length).toBeGreaterThan(0);
    expect(v.title.length).toBeGreaterThan(0);
    expect(v.message.length).toBeGreaterThan(0);
  });

  it("nie wykłada się na wartościach ujemnych (traktuje jak 0)", () => {
    expect(getVerdict(-10).tier).toBe("kawa");
  });
});
