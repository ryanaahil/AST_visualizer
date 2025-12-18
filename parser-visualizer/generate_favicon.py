"""
Favicon generator - creates a simple favicon.ico in the frontend/static directory
"""

import base64
import os

# Simple 16x16 favicon (minimal ICO format - a small tree emoji converted to ICO)
# This is a valid minimal ICO file
favicon_base64 = """
AAABAAEAEBAAAAEAIABoBAAAFgAAACAgAAABACAAqBAAAO4EAAAoAAAAEAAAACAAAAABACAAAAAAAAAAA
AAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAA////AP///wD///8A////AP///wD///8AAAAAAP///wD///8A////AP///wD///8A////AP///wD/
//8A////AP///wD///8A////AAAAAAAAAAAAAAAAAP/+/gD/8f4A//H+AP/x/gD/8f4A//H+AP///wD/
//8AAAAAAP///wA=
""".strip()

# Create the favicon file
frontend_static_path = os.path.join(os.path.dirname(__file__), 'frontend', 'static')
os.makedirs(frontend_static_path, exist_ok=True)

favicon_path = os.path.join(frontend_static_path, 'favicon.ico')

try:
    with open(favicon_path, 'wb') as f:
        f.write(base64.b64decode(favicon_base64))
    print(f"Favicon created successfully at {favicon_path}")
except Exception as e:
    print(f"Error creating favicon: {e}")
