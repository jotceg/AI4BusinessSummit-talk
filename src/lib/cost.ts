// Czysta logika kosztu spotkania. Bez efektów ubocznych — łatwa do testów.

export interface Participant {
  id: string;
  name: string;
  /** Stawka w PLN za godzinę (brutto-cokolwiek, to żart, nie księgowość). */
  ratePerHour: number;
}

/** Łączna stawka wszystkich uczestników w PLN na sekundę. */
export function ratePerSecond(participants: Participant[]): number {
  const perHour = participants.reduce((sum, p) => sum + Math.max(0, p.ratePerHour), 0);
  return perHour / 3600;
}

/** Koszt spotkania po `elapsedSeconds` sekundach. */
export function totalCost(elapsedSeconds: number, participants: Participant[]): number {
  return Math.max(0, elapsedSeconds) * ratePerSecond(participants);
}

/** Spalanie w PLN na minutę — do podstatystyki. */
export function burnPerMinute(participants: Participant[]): number {
  return ratePerSecond(participants) * 60;
}

/** Format PLN: "1 234,56 zł" (separatory jak w pl-PL). */
export function formatPLN(amount: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format czasu mm:ss (albo h:mm:ss powyżej godziny). */
export function formatClock(elapsedSeconds: number): string {
  const s = Math.floor(elapsedSeconds);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hh > 0 ? `${hh}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`;
}
