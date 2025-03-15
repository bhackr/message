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
        
        // Clean the input to remove non-binary characters
        const cleanedValue = this.value.replace(/[^01\s]/g, '');
        
        // Only process if we have binary content
        if (cleanedValue.trim().length > 0) {
            try {
                // Process the binary content even if we had to clean it
                binaryToText(cleanedValue);
                updateHighlighting();
                
                // If we removed something, update the input field with a notification
                if (cleanedValue !== this.value) {
                    this.value = cleanedValue;
                    
                    // Show a brief notification
                    statusMessage.textContent = 'Non-binary characters removed';
                    statusMessage.className = 'status success';
                    setTimeout(() => {
                        statusMessage.textContent = '';
                        statusMessage.className = 'status';
                    }, 2000);
                } else {
                    statusMessage.textContent = '';
                    statusMessage.className = 'status';
                }
            } catch (e) {
                showError('Error decoding binary: ' + e.message);
            }
        } else if (this.value !== cleanedValue) {
            // If the input contained only non-binary characters
            this.value = '';
            textOutput.value = '';
            statusMessage.textContent = 'Non-binary content removed';
            statusMessage.className = 'status success';
            setTimeout(() => {
                statusMessage.textContent = '';
                statusMessage.className = 'status';
            }, 2000);
            updateHighlighting();
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
        if (!binary.trim()) {
            return '';
        }
        
        // First, clean the input to ensure it only contains valid binary digits and spaces
        const cleanedBinary = binary.replace(/[^01\s]/g, '');
        
        // Process the binary input, allowing for spaces and line breaks
        const binaryGroups = cleanedBinary.split(/\s+/).filter(group => group.length > 0);
        const bytes = [];
        
        for (let i = 0; i < binaryGroups.length; i++) {
            const group = binaryGroups[i];
            if (group.length > 0) {
                // Skip invalid groups (should contain only 0s and 1s)
                if (!/^[01]+$/.test(group)) {
                    continue;
                }
                
                // Convert binary to byte
                const byte = parseInt(group, 2);
                if (!isNaN(byte)) {
                    bytes.push(byte);
                }
            }
        }
        
        // Convert bytes to a UTF-8 string
        const uint8Array = new Uint8Array(bytes);
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(uint8Array);
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
        
        // Process binary highlighting
        const binaryGroups = binary.split(/\s+/).filter(group => group.length > 0);
        let binaryHtml = '';
        
        try {
            // Create a direct mapping between binary patterns and their positions in text
            const binaryBytes = [];
            
            // Convert binary groups to bytes
            for (let i = 0; i < binaryGroups.length; i++) {
                const byte = parseInt(binaryGroups[i], 2);
                if (!isNaN(byte)) {
                    binaryBytes.push(byte);
                }
            }
            
            // Re-encode to get the exact characters
            const uint8Array = new Uint8Array(binaryBytes);
            const decodedText = new TextDecoder('utf-8').decode(uint8Array);
            
            // Map each binary group to its position in the decoded text
            let currentCharIndex = 0;
            let currentBinaryIndex = 0;
            const charToGroupIndices = new Map(); // Maps character index to array of binary group indices
            
            while (currentBinaryIndex < binaryGroups.length) {
                if (currentCharIndex >= decodedText.length) break;
                
                const char = decodedText[currentCharIndex];
                const charBytes = new TextEncoder().encode(char);
                
                // Each character maps to a specific number of binary groups
                const groupIndices = [];
                for (let i = 0; i < charBytes.length && currentBinaryIndex < binaryGroups.length; i++) {
                    groupIndices.push(currentBinaryIndex);
                    currentBinaryIndex++;
                }
                
                charToGroupIndices.set(currentCharIndex, groupIndices);
                currentCharIndex++;
            }
            
            // Generate colors for each character
            const charColors = new Map(); // Maps character index to color
            
            for (let i = 0; i < decodedText.length; i++) {
                const groupIndices = charToGroupIndices.get(i);
                if (groupIndices && groupIndices.length > 0) {
                    // Generate a color based on the first binary group for this character
                    const color = getColorForBinaryPattern(binaryGroups[groupIndices[0]]);
                    charColors.set(i, color);
                }
            }
            
            // Generate HTML for binary groups
            let binaryHtmlParts = [];
            for (let i = 0; i < binaryGroups.length; i++) {
                // Find which character this binary group belongs to
                let foundCharIndex = -1;
                for (const [charIndex, groupIndices] of charToGroupIndices.entries()) {
                    if (groupIndices.includes(i)) {
                        foundCharIndex = charIndex;
                        break;
                    }
                }
                
                if (foundCharIndex !== -1 && charColors.has(foundCharIndex)) {
                    const color = charColors.get(foundCharIndex);
                    binaryHtmlParts.push(`<span class="highlighted" style="background-color: ${color}">${binaryGroups[i]}</span>`);
                } else {
                    binaryHtmlParts.push(binaryGroups[i]);
                }
            }
            
            // Join with spaces to reconstruct the binary string with highlighting
            binaryHtml = binaryHtmlParts.join(' ');
            
            // Generate HTML for text characters
            let textHtml = '';
            for (let i = 0; i < decodedText.length; i++) {
                if (charColors.has(i)) {
                    const color = charColors.get(i);
                    textHtml += `<span class="highlighted" style="background-color: ${color}">${escapeHtml(decodedText[i])}</span>`;
                } else {
                    textHtml += escapeHtml(decodedText[i]);
                }
            }
            
            binaryHighlight.innerHTML = binaryHtml;
            textHighlight.innerHTML = textHtml;
            
        } catch (error) {
            console.error("Error updating highlighting:", error);
            binaryHighlight.innerHTML = binary.replace(/\s/g, ' ');
            textHighlight.innerHTML = escapeHtml(text);
        }
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
