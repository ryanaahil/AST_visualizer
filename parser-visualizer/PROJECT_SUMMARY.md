# Parser Visualizer - Project Summary

## 🎯 Project Overview

The **Parser Visualizer** is a comprehensive web-based tool for parsing Python code and visualizing its Abstract Syntax Tree (AST) in an interactive, graphical format. Users can explore code structure through an intuitive D3.js-powered visualization with full drag, zoom, and pan capabilities.

## 📦 What's Included

### Backend (Python Flask)
- **parser.py**: Core AST parsing and conversion module
  - `ASTConverter`: Converts Python AST to JSON format
  - `TreeFlattener`: Flattens tree for D3 visualization
  - Error handling for syntax errors
  
- **app.py**: Flask REST API server
  - `POST /api/parse`: Parse Python code
  - `GET /api/examples`: Get example code snippets
  - `GET /api/health`: Health check endpoint
  - CORS enabled for frontend integration

### Frontend (JavaScript + D3.js + CSS)
- **index.html**: Main application interface
  - Code editor panel
  - AST visualization canvas
  - Node details panel
  - Example selector
  
- **app.js**: Interactive visualization engine
  - ParserVisualizer class manages all interactions
  - D3 force-directed graph simulation
  - Node selection and details display
  - Zoom/pan controls
  - JSON export functionality
  
- **style.css**: Dark theme styling
  - Professional dark UI
  - Responsive layout
  - Smooth animations
  - Custom CSS variables for theming

## 🚀 Quick Start

### Windows
```bash
cd parser-visualizer
run.bat
```

### macOS/Linux
```bash
cd parser-visualizer
chmod +x run.sh
./run.sh
```

### Manual
```bash
cd parser-visualizer
pip install -r requirements.txt
cd backend
python app.py
# Open browser to http://localhost:5000
```

## 📊 Features

### Parsing Capabilities
- ✅ Full Python AST parsing (functions, classes, loops, conditionals, etc.)
- ✅ Detailed node attributes extraction
- ✅ Syntax error detection and reporting
- ✅ Support for complex Python constructs

### Visualization
- ✅ Interactive D3.js force-directed graph
- ✅ Drag nodes to rearrange
- ✅ Zoom in/out with smooth transitions
- ✅ Pan across the visualization
- ✅ Tooltip on node hover
- ✅ Node selection with detail panel

### User Interface
- ✅ Code editor with stats (lines, characters)
- ✅ Example code selector (5 examples included)
- ✅ Real-time error highlighting
- ✅ Node details on selection
- ✅ JSON export of parsed AST
- ✅ Keyboard shortcuts (Ctrl+Enter to parse)

### Developer Features
- ✅ RESTful API design
- ✅ CORS enabled
- ✅ Detailed error messages
- ✅ Health check endpoint
- ✅ Extensible architecture

## 🏗️ Architecture

```
Client (Browser)
    ↓ HTTP/JSON
Flask Server (Port 5000)
    ↓
Python AST Parser
    ↓
JSON Tree Structure
    ↓ HTTP/JSON
Client (Browser)
    ↓
D3.js Visualization
```

## 📁 File Structure

```
parser-visualizer/
├── backend/
│   ├── app.py                 # Flask server & routes
│   ├── parser.py              # AST parsing module
│   └── __pycache__/           # Cached files
├── frontend/
│   ├── index.html             # Main HTML
│   └── static/
│       ├── app.js             # D3 visualization & interactions
│       ├── style.css          # Dark theme styling
│       └── favicon.ico        # Browser favicon
├── requirements.txt           # Python dependencies
├── run.bat                    # Windows launcher
├── run.sh                     # Unix/Linux/Mac launcher
├── README.md                  # User documentation
├── CONFIGURATION.md           # Configuration guide
├── generate_favicon.py        # Favicon generator
└── PROJECT_SUMMARY.md         # This file
```

## 🔧 Dependencies

### Python
- Flask 2.3.3 - Web framework
- Flask-CORS 4.0.0 - CORS support
- Werkzeug 2.3.7 - WSGI utilities

### Frontend
- D3.js 7.x - Visualization library
- Modern browsers (Chrome, Firefox, Safari, Edge)

## 💡 Usage Examples

### Example 1: Simple Function
Input:
```python
def add(a, b):
    return a + b
```

Output: AST showing Module → FunctionDef → Return → BinOp

### Example 2: Class Definition
Input:
```python
class Calculator:
    def multiply(self, x, y):
        return x * y
```

Output: AST showing Module → ClassDef → FunctionDef → Return → BinOp

### Example 3: Control Flow
Input:
```python
for i in range(5):
    if i % 2 == 0:
        print(i)
```

Output: AST showing Module → For → If → Compare → Call

## 🎨 Customization

### Change Server Port
Edit `backend/app.py`:
```python
if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=8000)
```

### Change Theme Colors
Edit `frontend/static/style.css` CSS variables:
```css
:root {
    --primary-color: #your-color;
    --background: #your-color;
    /* ... etc */
}
```

### Add More Examples
Edit `backend/app.py` in the `api_examples()` function:
```python
examples = {
    "your_example": "your code here",
    # ... more
}
```

## 🚦 API Endpoints

### POST /api/parse
Parse Python code and get AST
- Request: `{"code": "...", "language": "python"}`
- Response: `{"success": true, "tree": {...}, "flattened": {...}, ...}`

### GET /api/examples
Get available examples
- Response: `{"hello_world": "...", "function": "...", ...}`

### GET /api/health
Health check
- Response: `{"status": "ok", "message": "..."}`

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not found | Run: `pip install -r requirements.txt` |
| Port in use | Change port in app.py or kill process on port 5000 |
| Tree not showing | Clear visualization and try parsing again |
| Syntax errors | Ensure code is valid Python |
| CORS errors | Already configured; refresh browser |

## 🔮 Future Enhancements

- [ ] Multi-language support (JavaScript, Java, C++, etc.)
- [ ] Syntax highlighting in code editor
- [ ] AST diff/comparison view
- [ ] Source code highlighting based on selected nodes
- [ ] Export to SVG/PNG/PDF
- [ ] Advanced keyboard navigation
- [ ] Light/dark theme toggle
- [ ] Undo/redo functionality
- [ ] Collaborative editing
- [ ] Code generation from AST

## 📚 Resources

- [Python AST Documentation](https://docs.python.org/3/library/ast.html)
- [D3.js Documentation](https://d3js.org)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Python Abstract Syntax Trees](https://en.wikipedia.org/wiki/Abstract_syntax_tree)

## 🎓 Learning Outcomes

This project demonstrates:
- Python AST manipulation and traversal
- JSON serialization of complex data structures
- RESTful API design
- Frontend-backend integration
- D3.js force-directed graphs
- Interactive data visualization
- Error handling and validation
- CORS and web security basics

## 📄 License

MIT License - Free to use, modify, and distribute

## 👨‍💻 Development Notes

### Adding New Languages

1. Create parser for new language in `backend/parser.py`
2. Add conversion method similar to `ASTConverter`
3. Add route handling in `backend/app.py`
4. Update frontend `language` parameter in requests

### Performance Tips

- Large ASTs (1000+ nodes) may load slowly
- Adjust force simulation parameters for faster rendering
- Use zoom to focus on specific tree regions

### Debugging

Enable Flask debug mode:
```bash
export FLASK_DEBUG=1  # Unix/Linux/Mac
set FLASK_DEBUG=1     # Windows
python app.py
```

## 📞 Support

For issues or suggestions, refer to the README.md and CONFIGURATION.md files for comprehensive documentation.

---

**Created with ❤️ - Parser Visualizer v1.0**
