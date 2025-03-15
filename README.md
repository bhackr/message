
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
