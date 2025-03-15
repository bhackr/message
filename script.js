document.addEventListener('DOMContentLoaded', function() {
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
    
    // Initialize with default values
    binaryToText(binaryInput.value);
    updateHighlighting();
    
    // Set up event listeners for automatic sync
    let isProcessing = false;
    
    binaryInput.addEventListener('input', function() {
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
    
    textOutput.addEventListener('input', function() {
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
    
    highlightToggle.addEventListener('change', function() {
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
    binaryInput.addEventListener('scroll', function() {
        binaryHighlight.scrollTop = this.scrollTop;
        binaryHighlight.scrollLeft = this.scrollLeft;
    });
    
    textOutput.addEventListener('scroll', function() {
        textHighlight.scrollTop = this.scrollTop;
        textHighlight.scrollLeft = this.scrollLeft;
    });
    
    // Set up event listeners for manual mode
    decodeBinaryBtn.addEventListener('click', function() {
        try {
            const binary = binaryInputManual.value.trim();
            const text = decodeBinary(binary);
            textOutputManual.value = text;
        } catch (e) {
            textOutputManual.value = 'Error: ' + e.message;
        }
    });
    
    encodeTextBtn.addEventListener('click', function() {
        try {
            const text = textOutputManual.value;
            const binary = encodeToBinary(text);
            binaryInputManual.value = binary;
        } catch (e) {
            binaryInputManual.value = 'Error: ' + e.message;
        }
    });
    
    clearBtn.addEventListener('click', function() {
        binaryInputManual.value = '';
        textOutputManual.value = '';
    });
    
    // Tab switching
    automaticTab.addEventListener('click', function() {
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
    
    manualTab.addEventListener('click', function() {
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
        const binary = encodeToBinary(text);
        binaryInput.value = binary;
    }
    
    function decodeBinary(binary) {
        if (!binary || !binary.trim()) {
            return '';
        }
        
        // Przygotuj wynikowy tekst
        let resultText = '';
        
        // Podziel wejście na części na podstawie białych znaków
        const parts = binary.split(/(\s+)/);
        
        for (let part of parts) {
            // Jeśli część jest białym znakiem, zachowaj go
            if (/^\s+$/.test(part)) {
                resultText += part;
                continue;
            }
            
            // Sprawdź, czy to jest grupa binarna (zawiera tylko 0 i 1)
            if (/^[01]+$/.test(part)) {
                try {
                    // Konwertuj grupę binarną na znak
                    const byte = parseInt(part, 2);
                    if (!isNaN(byte)) {
                        const uint8Array = new Uint8Array([byte]);
                        const decoder = new TextDecoder('utf-8');
                        resultText += decoder.decode(uint8Array);
                    }
                } catch (e) {
                    // W przypadku błędu, po prostu zachowaj oryginalną część
                    resultText += part;
                }
            } else {
                // Jeśli to nie jest grupa binarna, zachowaj oryginalny tekst
                resultText += part;
            }
        }
        
        return resultText;
    }
    
    function encodeToBinary(text) {
        if (!text) {
            return '';
        }
        
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        
        // Convert each byte to binary representation
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
        
        // Podziel wejście binarne na części
        const parts = binary.split(/(\s+)/);
        let binaryHtml = '';
        let textHtml = '';
        let textIndex = 0;
        
        // Iteruj przez każdą część
        for (let part of parts) {
            // Jeśli część jest białym znakiem, zachowaj go
            if (/^\s+$/.test(part)) {
                binaryHtml += part;
                continue;
            }
            
            // Sprawdź, czy to jest grupa binarna (zawiera tylko 0 i 1)
            if (/^[01]+$/.test(part)) {
                try {
                    // Generuj kolor dla tej części binarnej
                    const color = getColorForBinaryPattern(part);
                    binaryHtml += `<span class="highlighted" style="background-color: ${color}">${part}</span>`;
                    
                    // Konwertuj na znak, aby znaleźć odpowiadający tekst
                    const byte = parseInt(part, 2);
                    if (!isNaN(byte)) {
                        const uint8Array = new Uint8Array([byte]);
                        const decoder = new TextDecoder('utf-8');
                        const decodedChar = decoder.decode(uint8Array);
                        
                        // Znajdź ten znak w wyjściowym tekście jeśli możliwe
                        if (textIndex < text.length && text[textIndex] === decodedChar) {
                            textHtml += `<span class="highlighted" style="background-color: ${color}">${escapeHtml(decodedChar)}</span>`;
                            textIndex++;
                        }
                    }
                } catch (e) {
                    binaryHtml += part;
                }
            } else {
                // Jeśli to nie jest grupa binarna, zaznacz ją innym kolorem
                const color = '#f8f9fa'; // Jasny kolor dla niebinarnych części
                binaryHtml += `<span style="background-color: ${color}">${part}</span>`;
                
                // Znajdź tę samą część w tekście wyjściowym
                if (textIndex < text.length && text.substr(textIndex, part.length) === part) {
                    textHtml += `<span style="background-color: ${color}">${escapeHtml(part)}</span>`;
                    textIndex += part.length;
                }
            }
        }
        
        // Dodaj pozostałą część tekstu wyjściowego
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
