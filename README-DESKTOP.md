# Modality Analyzer - Desktop Application

A Windows desktop application for analyzing alethic modality in text, built with Electron.

## Features

- **Desktop Application**: Native Windows app - no browser required
- **Modality Analysis**: Analyzes sentences, paragraphs, and essays for necessity, possibility, and impossibility
- **Proportional Scoring**: Provides detailed scoring for each modality type
- **Sentence Breakdown**: Individual analysis for each sentence in longer texts
- **Modern UI**: Beautiful, responsive interface with gradient backgrounds and smooth animations
- **Native Menus**: Full application menu with keyboard shortcuts

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm

### Setup
1. Clone or download this repository
2. Open a terminal in the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm start
```

### Alternative Launch Methods
- Double-click `launch.bat` (Windows)
- Use the npm scripts in package.json

## Building the Application

### Create Windows Executable
```bash
npm run build-win
```

This will create a Windows installer in the `dist` folder.

### Build for All Platforms
```bash
npm run build
```

## Application Structure

- `main.js` - Electron main process
- `index.html` - Main application interface
- `styles.css` - Application styling
- `modality-analyzer.js` - Core analysis logic
- `nlp-processor.js` - Natural language processing
- `app.js` - Application initialization and event handling

## Usage

1. **Launch the Application**: Start the app using npm start or the batch file
2. **Enter Text**: Type or paste text to analyze in the input area
3. **Analyze**: Click "Analyze Modality" to process your text
4. **View Results**: See detailed modality ratings and grammatical analysis
5. **Sentence Breakdown**: For longer texts, view individual sentence analysis

## Keyboard Shortcuts

- `Ctrl+N` - New Analysis
- `Ctrl+Q` - Exit Application
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste
- `Ctrl+A` - Select All

## Technical Details

- **Framework**: Electron (Chromium + Node.js)
- **UI**: HTML5 + CSS3 + Vanilla JavaScript
- **Build Tool**: electron-builder
- **Platform**: Windows (with cross-platform support possible)

## Troubleshooting

### Common Issues

1. **Application won't start**: Ensure Node.js and npm are properly installed
2. **Missing dependencies**: Run `npm install` to install required packages
3. **Build errors**: Check that electron-builder is installed globally or locally

### Development

- Use `npm run dev` for development mode with additional debugging
- Press `F12` to open developer tools
- Check the console for error messages

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions, please check the main README.md file or create an issue in the repository.
