# Demo Script — Parser Visualizer

Brief project summary: This project is a lightweight Parser Visualizer that parses Python source code on the backend (Flask) into an AST, converts the AST into JSON, and renders an interactive, draggable, zoomable visualization in the browser using D3.js. It is useful for teaching, debugging, and exploring program structure.

Objective: Walk your professor through a live demo showing how the tool parses Python code and visualizes the AST/parse tree interactively.

1) Setup (1–2 minutes)
   - Explain repository contents briefly: `backend/` (Flask + parser), `frontend/` (D3 UI).
   - Show `requirements.txt` and mention Python 3.7+ requirement.

2) Start the app (do live)
   - Windows (PowerShell/CMD):
     ```powershell
     cd parser-visualizer\ start run.bat
     ```
   - Expected: "Running on http://localhost:5000"

3) Open the UI (30s)
   - Browse to http://localhost:5000
   - Point out the three areas: Code editor (left), Visualization (right), Node details (bottom).

4) Load an example and parse (1–2 minutes)
   - Choose example from dropdown (e.g., `function`), click `Parse Code` or press Ctrl+Enter.
   - Explain that backend receives the code at `POST /api/parse` and returns JSON AST.

5) Explore the visualization (3–4 minutes)
   - Demonstrate drag: move nodes to show dynamic layout.
   - Zoom & pan controls: Zoom in/out and reset.
   - Hover to show tooltip; click a node to open Node Details panel.
   - Show that node labels are AST node types (e.g., `FunctionDef`, `Return`).

6) Inspect Node Details (1–2 minutes)
   - Click a function node: highlight attributes (names, line numbers, constants).
   - Explain how the `parser.py` extracts attributes and builds the tree.

7) Export JSON (30s)
   - Click `Export JSON` to download the parsed AST.
   - Open the downloaded file to show `tree` and `flattened` nodes/links used by D3.

8) Error handling demo (optional, 1 minute)
   - Paste an invalid Python snippet (e.g., `def f(:`) and parse.
   - Show the syntax error message returned by backend and displayed in the UI.

9) Teaching points & architecture (2–3 minutes)
   - Backend: `backend/parser.py` → `ASTConverter` parses `ast.parse(code)` and serializes to JSON.
   - Frontend: `frontend/static/app.js` → `ParserVisualizer` builds D3 force-directed graph from `flattened` nodes/links.
   - Extensibility: add parsers for other languages or connect to code editors.

10) Wrap-up and Q&A (2–5 minutes)
   - Suggest improvements (syntax highlighting, multi-language parsers, AST diffing).
   - Ask for questions and, if time allows, demonstrate a custom snippet from the professor.

Notes for the demo:
- Keep sample code small (10–40 LOC) for best visualization performance.
- Mention potential limitations: extremely large ASTs may perform slowly in browser.
- Show the health endpoint for quick verification:
  ```bash
  curl http://localhost:5000/api/health
  ```

Files to reference during demo:
- `backend/app.py` — Flask server and endpoints
- `backend/parser.py` — AST conversion logic
- `frontend/index.html` and `frontend/static/app.js` — UI and D3 logic

Good luck — this script is tuned for a 10–15 minute live demo. Adjust timing as needed.