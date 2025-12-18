# Configuration Guide for Parser Visualizer

## Environment Variables

You can customize the behavior of the Parser Visualizer by setting environment variables:

### Flask Configuration

```bash
# Set Flask environment (development or production)
export FLASK_ENV=development

# Set Flask debug mode (0 or 1)
export FLASK_DEBUG=1

# Set host and port
export FLASK_HOST=localhost
export FLASK_PORT=5000
```

### Windows Command Prompt

```cmd
set FLASK_ENV=development
set FLASK_DEBUG=1
```

### Windows PowerShell

```powershell
$env:FLASK_ENV="development"
$env:FLASK_DEBUG=1
```

## Server Configuration

Edit `backend/app.py` to modify:

```python
if __name__ == "__main__":
    app.run(
        debug=True,           # Enable/disable debug mode
        host="localhost",     # Server hostname
        port=5000,            # Server port
        threaded=True         # Enable threading
    )
```

## Frontend Customization

### Custom Theme Colors

Edit the CSS variables in `frontend/static/style.css`:

```css
:root {
    --primary-color: #2563eb;      /* Main accent color */
    --background: #0f172a;         /* Main background */
    --surface: #1e293b;            /* Panel background */
    --text-primary: #f1f5f9;       /* Primary text color */
    /* ... more variables */
}
```

### Max Parser Timeout

In `backend/app.py`, add a timeout decorator:

```python
from functools import wraps
import signal

def timeout(seconds=30):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            def handler(signum, frame):
                raise TimeoutError("Parsing took too long")
            signal.signal(signal.SIGALRM, handler)
            signal.alarm(seconds)
            try:
                result = func(*args, **kwargs)
            finally:
                signal.alarm(0)
            return result
        return wrapper
    return decorator
```

## CORS Configuration

To allow requests from different domains, modify `backend/app.py`:

```python
from flask_cors import CORS

# Allow specific origins
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "https://example.com"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

## Performance Tuning

### For Large ASTs

Modify the force simulation parameters in `frontend/static/app.js`:

```javascript
this.simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links)
        .id(d => d.id)
        .distance(50)          // Reduce for tighter layout
        .strength(0.5))        // Adjust link strength
    .force("charge", d3.forceManyBody()
        .strength(-100))       // Adjust repulsion
    .force("collision", d3.forceCollide()
        .radius(20));          // Adjust collision radius
```

## Production Deployment

### Using Gunicorn (Recommended)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 backend.app:app
```

### Using Waitress (Windows)

```bash
pip install waitress
waitress-serve --port=5000 backend.app:app
```

### Nginx Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Logging

Add logging to `backend/app.py`:

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.route("/api/parse", methods=["POST"])
def api_parse():
    logger.info(f"Parse request received")
    # ... rest of code
```

## Troubleshooting

### ModuleNotFoundError: No module named 'flask'

Solution: Install dependencies
```bash
pip install -r requirements.txt
```

### Port 5000 already in use

Solution 1: Find and kill the process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

Solution 2: Use different port
```bash
# Edit app.py and change port parameter
python app.py  # Will use port in env variable or app.py setting
```

### CORS errors in browser console

Solution: Ensure CORS is properly configured in `backend/app.py`
```python
from flask_cors import CORS
CORS(app)  # Allow all origins in development
```

## Monitoring

Check server status:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Parser Visualizer Backend is running"
}
```
