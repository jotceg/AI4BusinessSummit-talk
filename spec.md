# Spotkaniomierz — specyfikacja

## Cel
Pokazać salι, ile **realnie kosztuje** trwające spotkanie — w PLN, w czasie rzeczywistym.
Lekko, z przymrużeniem oka, ale na prawdziwej matematyce.

## Funkcje (stan wyjściowy — już zrobione)
1. **Lista uczestników** — imię/rola + stawka `zł/h`. Edytowalne. Presety: Junior 90, Mid 130, Senior 180, Manager 220, C-level 400.
2. **Licznik** — Start / Pauza / Reset. Po starcie wielki numer kosztu rośnie co klatkę.
3. **Podstatystyki** — czas (mm:ss), spalanie (zł/min), liczba osób, łączna stawka (zł/h).
4. **Akcent wizualny** — kolor licznika zmienia się z kosztem: spokojny → ostrzegawczy → alarmowy.
5. **Karta werdyktu** — pokazuje wynik `getVerdict(koszt)`. W stanie wyjściowym placeholder „⏳ —".

## Werdykt (TO IMPLEMENTUJEMY NA ŻYWO)
Funkcja `getVerdict(totalPLN: number): Verdict` mapuje koszt na komentarz.

Interfejs (nie zmieniać):
```ts
interface Verdict { tier: string; emoji: string; title: string; message: string }
```

Progi (PLN, granica dolna **włącznie**; wartości < 0 traktuj jak 0):

| Zakres            | tier         | emoji | title                          | message (propozycja)                                  |
|-------------------|--------------|-------|--------------------------------|-------------------------------------------------------|
| `[0, 50)`         | `kawa`       | ☕    | Tyle co kawa                   | Spotkanie w granicach rozsądku.                       |
| `[50, 300)`       | `mail`       | 📧    | To mógł być mail               | Serio, jedno zdanie i tyle.                           |
| `[300, 1000)`     | `watek`      | 🧵    | To mógł być wątek na Slacku    | Asynchronicznie wyszłoby taniej.                      |
| `[1000, 3000)`    | `agenda`     | 🔥    | Gdzie była agenda?             | Ktoś tu powinien był ją przygotować.                  |
| `[3000, ∞)`       | `katastrofa` | 💸    | Budżet płonie                  | Kończcie. Naprawdę.                                   |

Wymagania:
- `tier` musi być dokładnie jak w tabeli (testy sprawdzają granice progów).
- `emoji`, `title`, `message` — niepuste.
- Czysta funkcja, bez efektów ubocznych. Treść `title`/`message` możesz dopieścić, byle niepuste i sensowne po polsku.

## Poza zakresem (świadomie)
Brak logowania, backendu, zapisu, sieci. To ma działać offline na rzutniku w 100%.
