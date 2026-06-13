import { describe, it, expect } from "vitest";
import {
  ratePerSecond,
  totalCost,
  burnPerMinute,
  formatClock,
  type Participant,
} from "./cost";

const people: Participant[] = [
  { id: "1", name: "Ania", ratePerHour: 180 },
  { id: "2", name: "Bartek", ratePerHour: 220 },
  { id: "3", name: "Celina", ratePerHour: 400 },
];

describe("cost math", () => {
  it("liczy stawkę na sekundę z sumy stawek godzinowych", () => {
    // 800 zł/h / 3600 = 0.2222... zł/s
    expect(ratePerSecond(people)).toBeCloseTo(800 / 3600, 6);
  });

  it("liczy koszt po czasie", () => {
    // 30 min = 1800 s
    expect(totalCost(1800, people)).toBeCloseTo(400, 6);
  });

  it("ignoruje ujemne stawki zamiast psuć sumę", () => {
    expect(ratePerSecond([{ id: "x", name: "Troll", ratePerHour: -100 }])).toBe(0);
  });

  it("liczy spalanie na minutę", () => {
    expect(burnPerMinute(people)).toBeCloseTo(800 / 60, 6);
  });

  it("formatuje zegar mm:ss i h:mm:ss", () => {
    expect(formatClock(75)).toBe("01:15");
    expect(formatClock(3725)).toBe("1:02:05");
  });
});
