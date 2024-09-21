# Better JSON Viewer

Better JSON Viewer is a Chrome extension that automatically formats JSON responses in your browser, providing a more readable and interactive JSON viewing experience.

## Features

- Automatically detects and formats JSON responses
- Collapsible JSON tree structure
- Syntax highlighting for different data types
- Dark and light theme support
- Responsive design

## Getting Started

### Prerequisites

- Google Chrome browser
- Basic knowledge of Chrome extension development

### Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

### Project Structure

- `manifest.json`: Extension configuration file
- `background.js`: Background script for the extension
- `contentScript.js`: Content script injected into web pages
- `injected.js`: Script injected into the page to parse JSON
- `styles.css`: Styles for the JSON viewer

### Development

To make changes to the extension:

1. Modify the relevant files in the project.
2. If you make changes to the manifest or background script, you'll need to reload the extension in `chrome://extensions/`.
3. For changes to content scripts or styles, you can usually just refresh the target page.

## How It Works

1. The background script (`background.js`) listens for tab updates and injects the content script when a page is loaded.
2. The content script (`contentScript.js`) checks if the page contains a JSON response.
3. If JSON is detected, it injects the styles and the `injected.js` script.
4. The injected script parses the JSON and sends it back to the content script.
5. The content script renders the JSON tree with collapsible sections and syntax highlighting.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source. Please include an appropriate license file in your project repository.
