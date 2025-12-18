"""
Flask Backend Server for Parser Visualizer
Serves the API endpoints and static files for the parser visualizer application.
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
from pathlib import Path
from parser import parse_code

app = Flask(__name__, 
            template_folder="../frontend",
            static_folder="../frontend/static")
CORS(app)


@app.route("/")
def index():
    """Serve the main HTML page."""
    return render_template("index.html")


@app.route("/api/parse", methods=["POST"])
def api_parse():
    """
    API endpoint to parse code and return AST.
    
    Expected JSON body:
    {
        "code": "python code to parse",
        "language": "python" (currently only Python supported)
    }
    """
    data = request.get_json()
    
    if not data or "code" not in data:
        return jsonify({"error": "Missing 'code' field"}), 400
    
    code = data.get("code", "")
    language = data.get("language", "python").lower()
    
    if language != "python":
        return jsonify({"error": f"Language '{language}' not yet supported"}), 400
    
    if not code.strip():
        return jsonify({"error": "Code cannot be empty"}), 400
    
    result = parse_code(code)
    return jsonify(result)


@app.route("/api/examples", methods=["GET"])
def api_examples():
    """Return example code snippets."""
    examples = {
        "hello_world": 'print("Hello, World!")',
        "function": """def greet(name):
    return f"Hello, {name}!"

result = greet("Alice")
""",
        "class": """class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"I am {self.name}, {self.age} years old"

p = Person("Bob", 30)
""",
        "loop_and_condition": """for i in range(10):
    if i % 2 == 0:
        print(f"{i} is even")
    else:
        print(f"{i} is odd")
""",
        "lambda": """numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
filtered = list(filter(lambda x: x > 5, squared))
""",
    }
    
    return jsonify(examples)


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "Parser Visualizer Backend is running"})


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors."""
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    # Development server
    app.run(debug=True, host="localhost", port=5000)
