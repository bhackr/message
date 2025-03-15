

document.addEventListener('DOMContentLoaded', function () {
    // Auto sync mode elements
    const binaryInput = document.getElementById('binaryInput');
    const textOutput = document.getElementById('textOutput');
    const statusMessage = document.getElementById('statusMessage');
    const binaryHighlight = document.getElementById('binaryHighlight');
    const textHighlight = document.getElementById('textHighlight');
    const highlightToggle = document.getElementById('highlightToggle');

    // Manual mode elements
    const binaryInputManual = document.getElementById('binaryInputManual');
    const textOutputManual = document.getElementById('textOutputManual');
    const decodeBinaryBtn = document.getElementById('decodeBinaryBtn');
    const encodeTextBtn = document.getElementById('encodeTextBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Tab elements
    const automaticTab = document.getElementById('automaticTab');
    const manualTab = document.getElementById('manualTab');
    const automaticMode = document.getElementById('automaticMode');
    const manualMode = document.getElementById('manualMode');

    // Generate a wide color palette for highlighting
    const colorPalette = generateColorPalette(256);

    // Character to color mapping
    const binaryColorMap = new Map();


        // Tab switching
    automaticTab.addEventListener('click', function () {
        automaticTab.classList.add('active');
        manualTab.classList.remove('active');
        graphTab.classList.remove('active');
        automaticMode.style.display = 'block';
        manualMode.style.display = 'none';
        graphMode.style.display = 'none';

        // Copy values from manual to automatic mode
        if (binaryInputManual.value) {
            binaryInput.value = binaryInputManual.value;
            binaryToText(binaryInputManual.value);
            updateHighlighting();
        }
    });

    manualTab.addEventListener('click', function () {
        manualTab.classList.add('active');
        automaticTab.classList.remove('active');
        graphTab.classList.remove('active');
        manualMode.style.display = 'block';
        automaticMode.style.display = 'none';
        graphMode.style.display = 'none';

        // Copy values from automatic to manual mode
        binaryInputManual.value = binaryInput.value;
        textOutputManual.value = textOutput.value;
    });

    graphTab.addEventListener('click', function () {
        graphTab.classList.add('active');
        automaticTab.classList.remove('active');
        manualTab.classList.remove('active');
        graphMode.style.display = 'block';
        automaticMode.style.display = 'none';
        manualMode.style.display = 'none';

        // Initialize the graph
        initializeGraph();
    });


    // Initialize with default values
    binaryToText(binaryInput.value);
    updateHighlighting();

    // Set up event listeners for automatic sync
    let isProcessing = false;

    binaryInput.addEventListener('input', function () {
        if (isProcessing) return;
        isProcessing = true;

        try {
            // Przetwórz treść binarną - bez usuwania znaków niebinarnych
            binaryToText(this.value);
            updateHighlighting();
            statusMessage.textContent = '';
            statusMessage.className = 'status';
        } catch (e) {
            showError('Error processing input: ' + e.message);
        }

        isProcessing = false;
    });

    textOutput.addEventListener('input', function () {
        if (isProcessing) return;
        isProcessing = true;
        try {
            textToBinary(this.value);
            updateHighlighting();
            statusMessage.textContent = '';
            statusMessage.className = 'status';
        } catch (e) {
            showError('Error encoding text: ' + e.message);
        }
        isProcessing = false;
    });

    highlightToggle.addEventListener('change', function () {
        if (this.checked) {
            updateHighlighting();
            binaryHighlight.style.display = 'block';
            textHighlight.style.display = 'block';
        } else {
            binaryHighlight.style.display = 'none';
            textHighlight.style.display = 'none';
        }
    });

    // Sync scrolling between textareas and highlight divs
    binaryInput.addEventListener('scroll', function () {
        binaryHighlight.scrollTop = this.scrollTop;
        binaryHighlight.scrollLeft = this.scrollLeft;
    });

    textOutput.addEventListener('scroll', function () {
        textHighlight.scrollTop = this.scrollTop;
        textHighlight.scrollLeft = this.scrollLeft;
    });

    // Set up event listeners for manual mode
    decodeBinaryBtn.addEventListener('click', function () {
        try {
            const binary = binaryInputManual.value.trim();
            const text = decodeBinary(binary);
            textOutputManual.value = text;
        } catch (e) {
            textOutputManual.value = 'Error: ' + e.message;
        }
    });

    encodeTextBtn.addEventListener('click', function () {
        try {
            const text = textOutputManual.value;
            const binary = encodeToBinary(text);
            binaryInputManual.value = binary;
        } catch (e) {
            binaryInputManual.value = 'Error: ' + e.message;
        }
    });

    clearBtn.addEventListener('click', function () {
        binaryInputManual.value = '';
        textOutputManual.value = '';
    });

    // Tab switching
    automaticTab.addEventListener('click', function () {
        automaticTab.classList.add('active');
        manualTab.classList.remove('active');
        automaticMode.style.display = 'block';
        manualMode.style.display = 'none';

        // Copy values from manual to automatic mode
        if (binaryInputManual.value) {
            binaryInput.value = binaryInputManual.value;
            binaryToText(binaryInputManual.value);
            updateHighlighting();
        }
    });

    manualTab.addEventListener('click', function () {
        manualTab.classList.add('active');
        automaticTab.classList.remove('active');
        manualMode.style.display = 'block';
        automaticMode.style.display = 'none';

        // Copy values from automatic to manual mode
        binaryInputManual.value = binaryInput.value;
        textOutputManual.value = textOutput.value;
    });

    // Helper functions
    function binaryToText(binary) {
        const text = decodeBinary(binary);
        textOutput.value = text;
    }

    function textToBinary(text) {
        const binaryValue = encodeToBinary(text);
        binaryInput.value = binaryValue;
        updateHighlighting();
    }

    function decodeBinary(binary) {
        if (!binary || !binary.trim()) {
            return '';
        }

        // Przygotuj wynikowy tekst
        let resultText = '';

        // Podziel wejście na linie, zachowując znaki nowej linii
        const lines = binary.split(/(\r?\n)/);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Jeśli to znak nowej linii, zachowaj go
            if (/\r?\n/.test(line)) {
                resultText += line;
                continue;
            }

            // Zidentyfikuj hashtagi i fragmenty binarne
            let processedLine = '';
            let currentPosition = 0;

            // Znajdź wszystkie hashtagi
            const hashtagMatches = [...line.matchAll(/#[^\s]+/g)];

            if (hashtagMatches.length > 0) {
                // Jeśli linia zawiera hashtagi, przetwórz segmenty między nimi
                for (const match of hashtagMatches) {
                    const hashtagIndex = match.index;
                    const hashtag = match[0];

                    // Przetwórz tekst przed hashtagiem
                    if (hashtagIndex > currentPosition) {
                        const beforeHashtag = line.substring(currentPosition, hashtagIndex);
                        processedLine += decodeBinaryFragment(beforeHashtag);
                    }

                    // Dodaj hashtag bez zmian
                    processedLine += hashtag;
                    currentPosition = hashtagIndex + hashtag.length;
                }

                // Przetwórz resztę linii po ostatnim hashtagu
                if (currentPosition < line.length) {
                    const afterLastHashtag = line.substring(currentPosition);
                    processedLine += decodeBinaryFragment(afterLastHashtag);
                }

                resultText += processedLine;
            } else {
                // Jeśli nie ma hashtagów, przetwórz całą linię
                resultText += decodeBinaryFragment(line);
            }
        }

        return resultText;
    }

    // Pomocnicza funkcja do dekodowania fragmentu binarnego
    function decodeBinaryFragment(fragment) {
        // Znajdź wszystkie 8-bitowe grupy binarne, ignorując spacje między nimi
        const binaryGroups = fragment.match(/[01]{8}/g) || [];

        if (binaryGroups.length === 0) {
            // Jeśli nie ma grup binarnych, zwróć oryginalny tekst
            return fragment;
        }

        // Konwertuj grupy na bajty
        const bytes = [];
        for (const group of binaryGroups) {
            const byte = parseInt(group, 2);
            if (!isNaN(byte)) {
                bytes.push(byte);
            }
        }

        // Jeśli nie ma poprawnych bajtów, zwróć oryginalny tekst
        if (bytes.length === 0) {
            return fragment;
        }

        // Dekoduj bajty na tekst UTF-8
        try {
            const uint8Array = new Uint8Array(bytes);
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(uint8Array);
        } catch (e) {
            console.warn("Error decoding binary:", e);
            return fragment;
        }
    }

    function encodeToBinary(text) {
        if (!text) {
            return '';
        }

        let result = '';

        // Podziel tekst na linie, zachowując znaki nowej linii
        const lines = text.split(/(\r?\n)/);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Jeśli to znak nowej linii, zachowaj go
            if (/\r?\n/.test(line)) {
                result += line;
                continue;
            }

            // Zidentyfikuj hashtagi i fragmenty tekstu
            let processedLine = '';
            let currentPosition = 0;

            // Znajdź wszystkie hashtagi
            const hashtagMatches = [...line.matchAll(/#[^\s]+/g)];

            if (hashtagMatches.length > 0) {
                // Jeśli linia zawiera hashtagi, przetwórz segmenty między nimi
                for (const match of hashtagMatches) {
                    const hashtagIndex = match.index;
                    const hashtag = match[0];

                    // Przetwórz tekst przed hashtagiem
                    if (hashtagIndex > currentPosition) {
                        const beforeHashtag = line.substring(currentPosition, hashtagIndex);
                        processedLine += encodeToBinaryFragment(beforeHashtag);
                    }

                    // Dodaj hashtag bez zmian
                    processedLine += hashtag;
                    currentPosition = hashtagIndex + hashtag.length;
                }

                // Przetwórz resztę linii po ostatnim hashtagu
                if (currentPosition < line.length) {
                    const afterLastHashtag = line.substring(currentPosition);
                    processedLine += encodeToBinaryFragment(afterLastHashtag);
                }

                result += processedLine;
            } else {
                // Jeśli nie ma hashtagów, przetwórz całą linię
                result += encodeToBinaryFragment(line);
            }
        }

        return result;
    }

    // Pomocnicza funkcja do kodowania fragmentu tekstowego na binarny
    function encodeToBinaryFragment(fragment) {
        if (!fragment || fragment.trim() === '') {
            return fragment;
        }

        // Enkoduj fragment tekstu na UTF-8
        const encoder = new TextEncoder();
        const bytes = encoder.encode(fragment);

        // Konwertuj każdy bajt na reprezentację binarną
        return Array.from(bytes)
            .map(byte => byte.toString(2).padStart(8, '0'))
            .join(' ');
    }

    // Generate a diverse color palette with good contrast
    function generateColorPalette(size) {
        const palette = [];

        // Generate HSL colors with good spacing
        for (let i = 0; i < size; i++) {
            // Evenly distribute hues around the color wheel
            const hue = i * (360 / size);

            // Keep saturation and lightness in a range that's visible but not too bright/dark
            const saturation = 70 + Math.sin(i) * 20; // Range from 50-90%
            const lightness = 65 + Math.cos(i) * 15;  // Range from 50-80%

            palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }

        return palette;
    }

    function getColorForBinaryPattern(pattern) {
        // Normalize pattern (remove spaces if any)
        const normalizedPattern = pattern.replace(/\s/g, '');

        if (!binaryColorMap.has(normalizedPattern)) {
            // Calculate a deterministic color index based on the binary pattern
            const patternSum = normalizedPattern
                .split('')
                .reduce((sum, bit, index) => sum + (parseInt(bit) * (index + 1)), 0);

            const colorIndex = patternSum % colorPalette.length;
            binaryColorMap.set(normalizedPattern, colorPalette[colorIndex]);
        }

        return binaryColorMap.get(normalizedPattern);
    }

    function updateHighlighting() {
        if (!highlightToggle.checked) return;

        const binary = binaryInput.value;
        const text = textOutput.value;

        let binaryHtml = '';
        let textHtml = '';

        // Podziel dane binarne na części: hashtagi, kod binarny i białe znaki
        const binaryParts = binary.split(/(\s+)|(\#[^\s]+)/g).filter(Boolean);
        let textIndex = 0;

        // Iteruj przez części binarne
        for (let part of binaryParts) {
            // Sprawdź, czy część jest hashtagiem
            if (part.startsWith('#')) {
                const hashtagColor = '#e6f7ff'; // Jasnoniebieski kolor dla hashtagów
                binaryHtml += `<span style="background-color: ${hashtagColor}">${part}</span>`;

                // Znajdź ten sam hashtag w tekście
                if (text.indexOf(part, textIndex) === textIndex) {
                    textHtml += `<span style="background-color: ${hashtagColor}">${escapeHtml(part)}</span>`;
                    textIndex += part.length;
                }
            } else if (/^\s+$/.test(part)) {
                // Jeśli to biały znak, zachowaj go
                binaryHtml += part;

                // Aktualizuj indeks tekstu dla białych znaków
                const spaceLength = Math.min(part.length, text.length - textIndex);
                if (spaceLength > 0) {
                    textHtml += text.substr(textIndex, spaceLength);
                    textIndex += spaceLength;
                }
            } else {
                // Sprawdź czy to kod binarny
                const binaryGroups = part.match(/[01]{8}/g) || [];

                if (binaryGroups.length > 0) {
                    // To jest kod binarny
                    let bytes = [];
                    let groupsHtml = '';

                    for (let group of binaryGroups) {
                        try {
                            const byte = parseInt(group, 2);
                            if (!isNaN(byte)) {
                                bytes.push(byte);

                                // Generuj kolor dla tej grupy binarnej
                                const color = getColorForBinaryPattern(group);
                                groupsHtml += `<span class="highlighted" style="background-color: ${color}">${group}</span> `;
                            } else {
                                groupsHtml += group + ' ';
                            }
                        } catch (e) {
                            groupsHtml += group + ' ';
                        }
                    }

                    binaryHtml += groupsHtml.trim();

                    // Dekoduj tekst i znajdź go w wyjściu
                    if (bytes.length > 0) {
                        try {
                            const uint8Array = new Uint8Array(bytes);
                            const decoder = new TextDecoder('utf-8');
                            const decodedText = decoder.decode(uint8Array);

                            // Sprawdź czy zdekodowany tekst występuje na bieżącej pozycji
                            if (text.substr(textIndex, decodedText.length) === decodedText) {
                                // Koloruj każdy znak zdekodowanego tekstu
                                for (let i = 0; i < decodedText.length; i++) {
                                    const charBytes = new TextEncoder().encode(decodedText[i]);
                                    let byteIndex = 0;

                                    for (let j = 0; j < bytes.length; j++) {
                                        if (bytes[j] === charBytes[0]) {
                                            byteIndex = j;
                                            break;
                                        }
                                    }

                                    // Użyj koloru odpowiadającej grupy binarnej
                                    if (byteIndex < binaryGroups.length) {
                                        const color = getColorForBinaryPattern(binaryGroups[byteIndex]);
                                        textHtml += `<span class="highlighted" style="background-color: ${color}">${escapeHtml(decodedText[i])}</span>`;
                                    } else {
                                        textHtml += escapeHtml(decodedText[i]);
                                    }
                                }

                                textIndex += decodedText.length;
                            }
                        } catch (e) {
                            console.warn("Error highlighting decoded text:", e);
                        }
                    }
                } else {
                    // To zwykły tekst
                    binaryHtml += part;

                    // Znajdź tę samą część w tekście
                    if (textIndex < text.length && text.substr(textIndex, part.length) === part) {
                        textHtml += escapeHtml(part);
                        textIndex += part.length;
                    }
                }
            }
        }

        // Dodaj pozostałą część tekstu
        if (textIndex < text.length) {
            textHtml += escapeHtml(text.substr(textIndex));
        }

        binaryHighlight.innerHTML = binaryHtml;
        textHighlight.innerHTML = textHtml;
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, "<br>")
            .replace(/\s/g, "&nbsp;");
    }

    function showError(message) {
        statusMessage.textContent = message;
        statusMessage.className = 'status error';

        // Clear error after a few seconds
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status';
        }, 5000);
    }
});