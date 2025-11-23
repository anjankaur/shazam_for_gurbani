"""
Flask API server for Gurbani audio recognition.
"""
import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from config import FLASK_CONFIG, AUDIO_CONFIG, GURBANI_API_URL
from recognizer import GurbaniRecognizer

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize recognizer
recognizer = GurbaniRecognizer()

# Create temp directory if it doesn't exist
os.makedirs(AUDIO_CONFIG["temp_directory"], exist_ok=True)


def allowed_file(filename):
    """Check if file extension is allowed."""
    return any(
        filename.lower().endswith(ext) 
        for ext in AUDIO_CONFIG["allowed_extensions"]
    )


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "Gurbani Recognition API"
    })


@app.route('/identify', methods=['POST'])
def identify_shabad():
    """
    Identify a Shabad from an uploaded audio file.
    
    Request:
        - Content-Type: multipart/form-data
        - Body: 'file' (audio file)
    
    Response:
        {
            "success": bool,
            "shabad_id": str or null,
            "confidence": float or null,
            "song_name": str or null,
            "message": str
        }
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "shabad_id": None,
                "confidence": None,
                "song_name": None,
                "message": "No file provided"
            }), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                "success": False,
                "shabad_id": None,
                "confidence": None,
                "song_name": None,
                "message": "No file selected"
            }), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({
                "success": False,
                "shabad_id": None,
                "confidence": None,
                "song_name": None,
                "message": f"Invalid file type. Allowed: {', '.join(AUDIO_CONFIG['allowed_extensions'])}"
            }), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > AUDIO_CONFIG["max_file_size"]:
            return jsonify({
                "success": False,
                "shabad_id": None,
                "confidence": None,
                "song_name": None,
                "message": f"File too large. Max size: {AUDIO_CONFIG['max_file_size'] / (1024*1024)}MB"
            }), 400
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        temp_path = os.path.join(
            AUDIO_CONFIG["temp_directory"],
            f"temp_{os.urandom(8).hex()}_{filename}"
        )
        file.save(temp_path)
        
        try:
            # Recognize the audio
            result = recognizer.recognize(temp_path)
            return jsonify(result)
        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except Exception as e:
        return jsonify({
            "success": False,
            "shabad_id": None,
            "confidence": None,
            "song_name": None,
            "message": f"Server error: {str(e)}"
        }), 500


@app.route('/shabad/<shabad_id>', methods=['GET'])
def get_shabad_info(shabad_id):
    """
    Proxy endpoint to fetch Shabad information from GurbaniNow API.
    This is optional - frontend can call GurbaniNow API directly.
    """
    try:
        import requests
        response = requests.get(f"{GURBANI_API_URL}/shabad/{shabad_id}")
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        return jsonify({
            "error": f"Failed to fetch Shabad: {str(e)}"
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        "error": "Endpoint not found",
        "available_endpoints": ["/health", "/identify", "/shabad/<id>"]
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({
        "error": "Internal server error",
        "message": str(error)
    }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("Gurbani Recognition API Server")
    print("=" * 60)
    print(f"Starting server on http://{FLASK_CONFIG['host']}:{FLASK_CONFIG['port']}")
    print(f"Debug mode: {FLASK_CONFIG['debug']}")
    print("-" * 60)
    
    app.run(
        host=FLASK_CONFIG['host'],
        port=FLASK_CONFIG['port'],
        debug=FLASK_CONFIG['debug']
    )

