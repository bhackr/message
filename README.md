
![obraz](https://github.com/user-attachments/assets/c4ccb5fe-c5ae-4091-8086-d8a9612a74ca)

# message.bhacker.com - Binary ↔ Text Converter

A powerful, interactive tool for converting between binary code and text with real-time color highlighting.


## Features

- **Real-time Bidirectional Conversion**: Convert from binary to text or text to binary instantly.
- **Color Highlighting**: Each binary sequence is color-coded with its corresponding text character, making it easy to see the relationships.
- **UTF-8 Support**: Properly handles all UTF-8 characters, including multi-byte sequences like emoji.
- **Hashtag Preservation**: Lines starting with `#` are preserved as-is and not encoded/decoded in both directions.
- **Mixed Content Handling**: Non-binary text in the binary field is preserved and passed through to the text field.
- **Two Operating Modes**:
  - **Automatic Sync**: Changes in either field automatically update the other.
  - **Manual Conversion**: Choose when to convert using dedicated buttons.
- **User-Friendly Interface**: Clean, responsive design that works on both desktop and mobile.

## Use Cases

- Educational tool for teaching binary encoding and character sets
- Debugging binary data streams
- Learning how UTF-8 encoding works with multi-byte characters
- Quick conversion for developers working with binary data

## How It Works

The converter uses JavaScript's TextEncoder and TextDecoder APIs to handle accurate conversions between binary and UTF-8 text. The color highlighting system creates a unique color for each binary pattern and applies that same color to the corresponding character in the text output.

### Multi-byte Character Handling

UTF-8 characters can take up to 4 bytes, and the converter intelligently groups related binary sequences that form a single character, ensuring they receive the same color highlight.

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/binary-text-converter.git
   ```

2. Open `index.html` in any modern browser.

No build process, dependencies, or installation required!

## File Structure

```
project/
│
├── index.html        # Main HTML file
├── styles.css        # CSS styling
└── script.js         # JavaScript functionality
```

## How to Use

1. **Automatic Mode**:
   - Type or paste binary code in the top field to see it converted to text
   - Type or paste text in the bottom field to see it converted to binary
   - Watch as the colors highlight the relationships between binary and text

2. **Manual Mode**:
   - Enter data in either field
   - Click the conversion buttons when ready
   - Use the "Clear Both" button to start fresh

3. **Toggle Highlighting**:
   - Use the switch in the top right to turn highlighting on or off

## Color Coding

- Each unique binary pattern gets its own color
- For multi-byte UTF-8 characters, all binary groups for that character share the same color
- The corresponding text character has the same highlight color as its binary representation

## Browser Compatibility

This tool works with all modern browsers that support:
- TextEncoder/TextDecoder APIs
- ES6 JavaScript features
- CSS Grid and Flexbox



## Contributing

Contributions are welcome! Feel free to submit a pull request or create an issue if you have any ideas for improvements.

## Acknowledgments

- This project was created as an educational tool for understanding binary encoding


# PL:


# Zasady działania skryptu konwertera binarno-tekstowego

## Główne funkcje

1. **Konwersja dwukierunkowa** - umożliwia zamianę tekstu na kod binarny i kodu binarnego na tekst w czasie rzeczywistym
2. **Zachowanie hashtagów** - słowa rozpoczynające się od znaku # są zachowywane bez zmian w obu kierunkach konwersji
3. **Kolorowe podświetlanie** - koloruje odpowiadające sobie elementy binarne i znaki tekstowe
4. **Obsługa UTF-8** - poprawnie obsługuje wielobajtowe znaki, w tym polskie znaki i emoji

## Zasady działania

1. **Identyfikacja hashtagów**
   - Hashtagi (słowa zaczynające się od #) są identyfikowane i zachowywane bez konwersji
   - Hashtagi są wykrywane za pomocą wyrażenia regularnego `/#[^\s]+/g` (znak # i wszystkie kolejne znaki do białego znaku)

2. **Konwersja tekstu na kod binarny**
   - Każdy znak tekstu jest konwertowany na jego 8-bitową reprezentację UTF-8
   - Wielobajtowe znaki (np. emoji, polskie znaki) są prawidłowo konwertowane na sekwencje 8-bitowych grup
   - Każda 8-bitowa grupa jest oddzielona spacją dla czytelności

3. **Konwersja kodu binarnego na tekst**
   - Grupy 8-bitowe są identyfikowane i konwertowane na bajty
   - Spacje między kodami binarnymi są ignorowane (służą tylko do separacji i nie są dekodowane do tekstu)
   - Tylko spacje, które zostały zakodowane jako "00100000" są widoczne w polu tekstowym
   - Sekwencje bajtów są dekodowane na znaki UTF-8

4. **Przetwarzanie fragmentów**
   - Tekst jest analizowany sekcja po sekcji, między hashtagami
   - Każda sekcja jest przetwarzana jako całość, co zapewnia poprawne dekodowanie złożonych znaków UTF-8

5. **Podświetlanie**
   - Każda 8-bitowa grupa binarna otrzymuje unikalny kolor
   - Odpowiadający jej znak w polu tekstowym otrzymuje ten sam kolor
   - Hashtagi są podświetlane na niebiesko w obu polach

## Ważne uwagi

1. **Spacje w reprezentacji binarnej**:
   - Spacje pomiędzy kolejnymi kodami binarnymi (np. między "01000001" a "01000010") nie powinny występować w tekście - służą tylko jako separatory wizualne
   - Tylko spacje, które zostały faktycznie zakodowane jako "00100000" są odzwierciedlone w polu tekstowym

2. **Zachowanie formatowania**:
   - Znaki nowej linii są zachowywane podczas konwersji
   - Zachowana jest dokładna pozycja hashtagów w tekście

3. **Obsługa błędów**:
   - Nieprawidłowe dane binarne są pomijane
   - W przypadku błędu dekodowania, oryginalny tekst jest zachowywany

4. **Tryby pracy**:
   - Automatyczna synchronizacja - zmiany w jednym polu automatycznie aktualizują drugie pole
   - Tryb ręczny - konwersja odbywa się dopiero po naciśnięciu przycisku


## Szczegóły implementacyjne

5. **Przetwarzanie ciągów binarnych**:
   - Skrypt identyfikuje ciągi 8-bitowe za pomocą wyrażenia regularnego `/[01]{8}/g`
   - Wszystkie inne znaki między nimi są ignorowane podczas dekodowania
   - Spacje między kolejnymi kodami binarnymi służą wyłącznie do czytelności i nie są interpretowane jako dane

6. **Wieloetapowe przetwarzanie**:
   - Najpierw tekst jest dzielony na linie
   - Następnie w każdej linii identyfikowane są hashtagi
   - Fragmenty między hashtagami są przetwarzane jako bloki binarne lub tekstowe
   - Ten podejście "divide and conquer" zapewnia precyzyjne przetwarzanie złożonych struktur

7. **Kodowanie UTF-8**:
   - Używa wbudowanych API przeglądarki: `TextEncoder` i `TextDecoder`
   - Zapewnia poprawną obsługę wszystkich znaków Unicode, w tym znaków narodowych i emoji
   - Znaki wielobajtowe są prawidłowo identyfikowane i przetwarzane jako całość

## Scenariusze użycia

1. **Edukacja i nauka**:
   - Zrozumienie podstaw kodowania binarnego
   - Nauka jak znaki są reprezentowane w komputerach
   - Poznanie formatów kodowania UTF-8 dla różnych zestawów znaków

2. **Testowanie komunikacji z AI**:
   - Tworzenie wiadomości z hashtagami dla modeli AI
   - Testowanie rozpoznawania zaszyfrowanych treści przez systemy AI
   - Badanie zdolności modeli do interpretacji mieszanych formatów danych

3. **Zaawansowana komunikacja**:
   - Tworzenie wiadomości, których część jest czytelna (hashtagi), a część zaszyfrowana
   - Możliwość umieszczania "znaczników" w postaci hashtagów w zaszyfrowanych wiadomościach
   - Łatwiejsza identyfikacja kluczowych elementów w zaszyfrowanym tekście

## Zalety rozwiązania

1. **Intuicyjny interfejs użytkownika**:
   - Podświetlanie kolorami ułatwia śledzenie powiązań między kodem binarnym a tekstem
   - Przełączniki trybu pozwalają na wybór odpowiedniego sposobu pracy
   - Obsługa błędów z jasnymi komunikatami

2. **Wysoka precyzja konwersji**:
   - Dokładne zachowanie struktury danych bez dodatkowych znaków
   - Poprawna obsługa skomplikowanych sekwencji UTF-8
   - Wierne zachowanie hashtagów

3. **Elastyczność**:
   - Działa z dowolnymi kombinacjami tekstu, kodu binarnego i hashtagów
   - Automatycznie dostosowuje się do różnych formatów danych wejściowych
   - Możliwość rozszerzenia funkcjonalności w przyszłości

## Ograniczenia

1. **Wymagania przeglądarki**:
   - Wymaga nowoczesnej przeglądarki obsługującej API TextEncoder/TextDecoder
   - Najlepiej działa w aktualnych wersjach Chrome, Firefox, Safari i Edge

2. **Wydajność**:
   - Przy bardzo dużych ilościach danych konwersja może zająć więcej czasu
   - Podświetlanie kolorami może obciążać przeglądarkę przy ogromnych blokach tekstu

## Przyszłe rozszerzenia

1. **Obsługa dodatkowych formatów kodowania**:
   - Możliwość dodania wsparcia dla innych formatów jak ASCII, Base64, Hex
   - Opcja konwersji między różnymi formatami binarnymi

2. **Rozszerzone funkcje analizy**:
   - Statystyki użycia hashtagów
   - Wizualizacja struktury danych binarnych

3. **Zaawansowane funkcje edycji**:
   - Edycja tylko wybranych fragmentów kodu
   - Historia zmian i możliwość cofania operacji

Ten konwerter stanowi solidne narzędzie do pracy z danymi w formacie binarnym i tekstowym, z szczególnym uwzględnieniem specjalnego traktowania hashtagów i prawidłowej obsługi kodowania znaków.
