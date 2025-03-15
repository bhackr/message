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
            binaryToText(this.value);
            updateHighlighting();
            statusMessage.textContent = '';
            statusMessage.className = 'status';
        } catch (e) {
            showError('Error decoding binary: ' + e.message);
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
        
        // Process the binary input, allowing for spaces and line breaks
        const binaryGroups = binary.split(/\s+/);
        const bytes = [];
        
        for (let i = 0; i < binaryGroups.length; i++) {
            const group = binaryGroups[i];
            if (group.length > 0) {
                // Convert binary to byte
                const byte = parseInt(group, 2);
                if (isNaN(byte)) {
                    throw new Error('Invalid binary format');
                }
                bytes.push(byte);
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
        const binaryGroups = binary.split(/\s+/);
        let binaryHtml = '';
        
        // Create a mapping between binary groups and text characters
        const binaryToCharMap = new Map();
        const charPositions = [];
        
        try {
            // First pass: determine which binary groups correspond to which text characters
            let charIndex = 0;
            for (let i = 0; i < binaryGroups.length; i++) {
                const group = binaryGroups[i];
                if (group.length > 0) {
                    const byte = parseInt(group, 2);
                    if (!isNaN(byte)) {
                        if (!binaryToCharMap.has(i)) {
                            binaryToCharMap.set(i, charIndex);
                            
                            // Store positions for multi-byte characters
                            if (!charPositions[charIndex]) {
                                charPositions[charIndex] = [];
                            }
                            charPositions[charIndex].push(i);
                            
                            // Check if this starts a multi-byte UTF-8 sequence
                            if (byte >= 0xC0 && byte < 0xF8) {
                                // This is the start of a multi-byte character
                                // Determine how many bytes follow based on the first byte
                                let followBytes = 0;
                                if (byte >= 0xC0 && byte < 0xE0) followBytes = 1;      // 2-byte sequence
                                else if (byte >= 0xE0 && byte < 0xF0) followBytes = 2;  // 3-byte sequence
                                else if (byte >= 0xF0 && byte < 0xF8) followBytes = 3;  // 4-byte sequence
                                
                                // Mark the following bytes as part of this character
                                for (let j = 1; j <= followBytes && i + j < binaryGroups.length; j++) {
                                    binaryToCharMap.set(i + j, charIndex);
                                    charPositions[charIndex].push(i + j);
                                }
                                
                                // Skip the bytes we just processed
                                i += followBytes;
                            }
                            
                            charIndex++;
                        }
                    }
                }
            }
            
            // Second pass: generate HTML with colors
            for (let i = 0; i < binaryGroups.length; i++) {
                const group = binaryGroups[i];
                if (group.length > 0) {
                    try {
                        // Find all groups that belong to the same character
                        const charIdx = binaryToCharMap.get(i);
                        if (charIdx !== undefined) {
                            const allGroups = charPositions[charIdx];
                            
                            // Generate a consistent color for this character
                            let color;
                            if (allGroups && allGroups.length > 1) {
                                // For multi-byte characters, use the first byte's color
                                const firstGroup = binaryGroups[allGroups[0]];
                                color = getColorForBinaryPattern(firstGroup);
                            } else {
                                color = getColorForBinaryPattern(group);
                            }
                            
                            binaryHtml += `<span class="highlighted" style="background-color: ${color}">${group}</span> `;
                        } else {
                            binaryHtml += group + ' ';
                        }
                    } catch (e) {
                        binaryHtml += group + ' ';
                    }
                } else {
                    binaryHtml += ' ';
                }
            }
            
            // Process text highlighting
            let textHtml = '';
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                
                // Find the binary groups for this character
                const groups = charPositions[i];
                
                if (groups && groups.length > 0) {
                    // Use the color of the first binary group for this character
                    const firstGroup = binaryGroups[groups[0]];
                    const color = getColorForBinaryPattern(firstGroup);
                    
                    textHtml += `<span class="highlighted" style="background-color: ${color}">${escapeHtml(char)}</span>`;
                } else {
                    textHtml += escapeHtml(char);
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
