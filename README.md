# Parser Visualizer 🌳

A comprehensive tool for visualizing Abstract Syntax Trees (AST) and parse trees graphically. Parse Python code and explore its structure with an interactive D3-powered visualization featuring drag, zoom, and detailed node inspection.

## Features

✨ **Key Capabilities:**
- Parse Python code and generate AST (Abstract Syntax Trees)
- Interactive D3.js visualization with force-directed layout
- **Drag nodes** to rearrange the tree
- **Zoom in/out** and pan for detailed exploration
- Click nodes to view detailed attributes and metadata
- Load example code snippets
- Export parsed AST as JSON
- Real-time code statistics (lines, characters)
- Error highlighting for syntax errors

## Project Structure

```
parser-visualizer/
├── backend/
│   ├── app.py              # Flask server
│   ├── parser.py           # AST parsing module
│   └── __pycache__/
├── frontend/
│   ├── index.html          # Main HTML page
│   ├── static/
│   │   ├── app.js          # Frontend JavaScript (D3 visualization)
│   │   └── style.css       # Styling
├── requirements.txt        # Python dependencies
├── README.md              # This file
└── run.sh / run.bat       # Quick start scripts
```

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Step 1: Install Dependencies

Navigate to the project directory and install the required Python packages:

```bash
cd parser-visualizer
pip install -r requirements.txt
```

Or with pip3:

```bash
pip3 install -r requirements.txt
```

### Step 2: Run the Application

#### On Windows:
```bash
cd backend
python app.py
```

#### On macOS/Linux:
```bash
cd backend
python3 app.py
```

You should see output similar to:
```
 * Serving Flask app 'app'
 * Running on http://localhost:5000
 * Press CTRL+C to quit
```

### Step 3: Open in Browser

Open your web browser and navigate to:
```
http://localhost:5000
```

You should see the Parser Visualizer interface!

## Usage Guide

### 1. Parse Code

**Option A - Enter Code Manually:**
1. Paste or type Python code in the left panel
2. Click the "Parse Code" button (or press Ctrl+Enter)
3. The AST visualization will appear on the right

**Option B - Load Examples:**
1. Click the "Select Example..." dropdown
2. Choose an example (Hello World, Function, Class, etc.)
3. Click "Parse Code"

### 2. Explore the Visualization

- **Hover over nodes** to see the node type in a tooltip
- **Click on nodes** to view detailed information in the bottom panel
- **Drag nodes** to rearrange the tree layout
- **Scroll or use controls** to zoom in/out
- **Right-click + drag** to pan across the visualization

### 3. Control Buttons

| Button | Function |
|--------|----------|
| Parse Code | Parse the input code and generate visualization |
| Clear | Clear the editor and visualization |
| Zoom In | Increase the zoom level |
| Zoom Out | Decrease the zoom level |
| Reset | Reset zoom to default view |
| Export JSON | Download the parsed AST as JSON |

### 4. Node Details

When you click on a node, the bottom panel shows:
- **Node Type**: The AST node class (e.g., FunctionDef, Assign)
- **Node ID**: Unique identifier
- **Attributes**: Relevant metadata (line numbers, names, etc.)

## Examples

### Example 1: Simple Function
```python
def greet(name):
    return f"Hello, {name}!"
```

### Example 2: Class Definition
```python
class Person:
    def __init__(self, name):
        self.name = name
```

### Example 3: Loop and Conditions
```python
for i in range(10):
    if i % 2 == 0:
        print(i)
```

## Supported Languages

Currently supported:
- ✅ **Python** - Full AST parsing support

Future support planned for:
- 🔄 JavaScript (Esprima)
- 🔄 Java (ANTLR)
- 🔄 C/C++ (Tree-sitter)

## API Reference

### POST /api/parse
Parses code and returns the AST.

**Request Body:**
```json
{
  "code": "def hello():\n    print('world')",
  "language": "python"
}
```

**Response:**
```json
{
  "success": true,
  "tree": { /* nested AST */ },
  "flattened": { /* flattened nodes and links */ },
  "error": null,
  "lines": 2
}
```

### GET /api/examples
Returns available example code snippets.

**Response:**
```json
{
  "hello_world": "print(\"Hello, World!\")",
  "function": "def greet(name):\n    return f\"Hello, {name}!\"",
  ...
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Parser Visualizer Backend is running"
}
```

## Troubleshooting

### Issue: "Connection refused" error
**Solution:** Make sure the Flask server is running. Check that port 5000 is not in use.

### Issue: Syntax errors in parsing
**Solution:** Ensure your code is valid Python. The parser will show specific error messages.

### Issue: Tree visualization not showing
**Solution:** Try refreshing the page or clearing the visualization with the "Clear" button.

### Issue: Port 5000 already in use
**Solution:** Either:
1. Find and stop the process using port 5000
2. Modify the port in `backend/app.py` (change `port=5000` to another port like 5001)

## Development

### Backend Architecture

The backend consists of two main modules:

**parser.py:**
- `ASTConverter`: Converts Python AST nodes to JSON-serializable format
- `TreeFlattener`: Flattens nested tree to nodes/links format for D3
- `parse_code()`: Main entry point

**app.py:**
- Flask server with CORS support
- RESTful API endpoints
- Static file serving

### Frontend Architecture

**app.js - ParserVisualizer Class:**
- Handles UI interactions and event listeners
- Manages D3 force-directed graph simulation
- Implements zoom/pan functionality
- Displays node details on selection

**style.css:**
- Dark theme optimized for code visualization
- Responsive layout (desktop and tablet)
- CSS variables for easy customization

## Performance Notes

- Trees with 100-500 nodes render smoothly
- Large ASTs (1000+ nodes) may require browser optimization
- Node dragging temporarily disables physics for better responsiveness

## Future Enhancements

- [ ] Support for more programming languages
- [ ] Syntax highlighting in code editor
- [ ] AST comparison view
- [ ] Source code highlighting based on selected nodes
- [ ] Export to different formats (SVG, PNG, PDF)
- [ ] Keyboard shortcuts for navigation
- [ ] Themes (light/dark mode)
- [ ] Undo/Redo functionality

## License

MIT License - Feel free to use and modify

## Support

For issues or feature requests, please refer to the project documentation or file an issue.

---

**Happy Parsing! 🚀**
