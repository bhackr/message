/**
 * Binary-Text Visualization Functions
 * This file contains functions for creating and managing the binary-text conversion visualization.
 */

// Initialize the binary-text chart
function initializeGraph() {
    console.log('Initializing graph...');
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Make sure the script is included correctly.');
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = 
                '<div style="color: red; padding: 20px;">Chart.js library could not be loaded. Please check console for details.</div>';
        }
        return;
    }
    
    const canvasElem = document.getElementById('binaryTextChart');
    if (!canvasElem) {
        console.error('Canvas element #binaryTextChart not found');
        return;
    }
    
    // Sample data for ASCII characters
    const characters = ['A', 'B', 'C', 'Space', '#', '1', '2', 'a', 'b', 'c'];
    const asciiValues = [65, 66, 67, 32, 35, 49, 50, 97, 98, 99];
    
    // Fixed color palette
    const colorPalette = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33A8FF', 
        '#A833FF', '#FF8C33', '#8CFF33', '#338CFF', '#FF33D1'
    ];
    
    // Create chart
    try {
        console.log('Creating chart...');
        // Check if chart already exists and destroy it
        if (window.binaryTextChart instanceof Chart) {
            window.binaryTextChart.destroy();
        }
        
        window.binaryTextChart = new Chart(canvasElem, {
            type: 'bar',
            data: {
                labels: characters,
                datasets: [{
                    label: 'ASCII Value',
                    data: asciiValues,
                    backgroundColor: colorPalette,
                    borderColor: colorPalette,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const index = context.dataIndex;
                                const value = context.dataset.data[index];
                                return 'Binary: ' + value.toString(2).padStart(8, '0');
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Character to Binary Conversion'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'ASCII Value'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Character'
                        }
                    }
                }
            }
        });
        console.log('Chart created successfully');
    } catch (e) {
        console.error('Error creating chart:', e);
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = 
                '<div style="color: red; padding: 20px;">Error creating chart: ' + e.message + '</div>';
        }
    }
}

// Advanced chart creation with dynamic data
function createAdvancedChart(containerSelector, customData) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Container ${containerSelector} not found`);
        return;
    }
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);
    
    // Use default data if custom data is not provided
    const data = customData || {
        characters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        values: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74]
    };
    
    // Create chart
    try {
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.characters,
                datasets: [{
                    label: 'ASCII Value',
                    data: data.values,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Custom Character Analysis'
                    }
                }
            }
        });
    } catch (e) {
        console.error('Error creating advanced chart:', e);
        container.innerHTML = `<div style="color: red; padding: 20px;">Error creating chart: ${e.message}</div>`;
    }
}

// Generate binary table for UI display
function generateBinaryTable(selector, characters) {
    const container = document.querySelector(selector);
    if (!container) {
        return;
    }
    
    // Default characters if none provided
    const chars = characters || ['A', 'B', 'C', 'Space', '#', '1'];
    
    // Create table structure
    let tableHTML = `
        <table class="binary-table">
            <thead>
                <tr>
                    <th>Character</th>
                    <th>Binary</th>
                    <th>Decimal</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Generate rows
    chars.forEach(char => {
        const charCode = char === 'Space' ? 32 : char.charCodeAt(0);
        const binary = charCode.toString(2).padStart(8, '0');
        
        tableHTML += `
            <tr>
                <td>${char}</td>
                <td>${binary}</td>
                <td>${charCode}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

// Export the functions (for use with module systems)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        initializeGraph,
        createAdvancedChart,
        generateBinaryTable
    };
}