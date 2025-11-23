# Shazam for Gurbani 🎵

A music recognition app that identifies Gurbani Shabads from audio recordings, similar to Shazam. This project uses audio fingerprinting technology to match recorded Kirtan against a database of known Gurbani tracks.

## 🏗️ Architecture

```
┌─────────────┐
│   React     │  Frontend: Records audio, displays results
│   Frontend  │
└──────┬──────┘
       │ HTTP POST (audio file)
       ▼
┌─────────────┐
│   Flask     │  Backend: Receives audio, fingerprints it
│   Server    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Dejavu    │  Audio Fingerprinting Engine
│   Library   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   MySQL     │  Stores audio fingerprints & metadata
│   Database  │
└─────────────┘
```

## 📁 Project Structure

```
shazam_for_gurbani/
├── backend/              # Python Flask backend
│   ├── app.py           # Main Flask application
│   ├── config.py        # Database configuration
│   ├── models.py        # Database models
│   ├── recognizer.py    # Audio recognition logic
│   ├── train.py         # Training script for audio files
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.jsx      # Main app component
│   │   ├── components/  # React components
│   │   └── utils/       # Utility functions
│   ├── package.json
│   └── vite.config.js
├── audio_files/         # Place your MP3 files here for training
├── .env.example         # Environment variables template
└── README.md
```

## 🚀 Quick Start

> **New to the project?** Start with [QUICKSTART.md](./QUICKSTART.md) for a 5-minute setup guide.
> 
> **Need detailed instructions?** See [SETUP.md](./SETUP.md) for comprehensive setup steps.

### Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- FFmpeg (for audio processing)

### Verify Setup

Before starting, you can verify your setup:

```bash
cd backend
python check_setup.py
```

This will check:
- Python version
- Required dependencies
- FFmpeg installation
- Database connection
- Environment configuration

### Backend Setup

1. **Install FFmpeg** (if not already installed):
   ```bash
   # macOS
   brew install ffmpeg
   
   # Ubuntu/Debian
   sudo apt-get install ffmpeg
   ```

2. **Set up Python environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure database**:
   - Create a MySQL database named `gurbani_db`
   - Copy `.env.example` to `.env` and update database credentials
   - Update `backend/config.py` with your database settings

4. **Train the system** (add your MP3 files to `audio_files/`):
   ```bash
   python backend/train.py
   ```

5. **Start the Flask server**:
   ```bash
   python backend/app.py
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API endpoint**:
   - Update `API_BASE_URL` in `frontend/src/config.js` if needed
   - Set your Gemini API key in environment variables

3. **Start development server**:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`

## 📝 Audio File Naming Convention

For the system to work correctly, name your audio files as:
```
{shabad_id}_{artist_name}.mp3
```

Example:
- `3589_bhai_harjinder_singh.mp3`
- `1365_bhai_niranjan_singh.mp3`

The `shabad_id` will be extracted and used to fetch lyrics from the GurbaniNow API.

## 🔧 Configuration

### Backend Configuration (`backend/config.py`)

```python
DATABASE_CONFIG = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "your_password",
    "db": "gurbani_db",
}
```

### Frontend Configuration

Set environment variables:
- `VITE_GURBANI_API_URL`: GurbaniNow API base URL (default: https://api.gurbaninow.com/v2)
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key (optional, for AI explanations)

## 🎯 Usage

1. **Training**: Add MP3 files to `audio_files/` and run `python backend/train.py`
2. **Recognition**: Use the React app to record 5-10 seconds of audio
3. **Results**: The app displays the identified Shabad with lyrics, transliteration, and translation

## 🛠️ API Endpoints

### `POST /identify`
Identifies a Shabad from an audio file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (audio file, WAV format recommended)

**Response:**
```json
{
  "success": true,
  "shabad_id": "3589",
  "confidence": 0.95,
  "song_name": "3589_bhai_harjinder_singh"
}
```

## 📚 Resources

- [Dejavu Library](https://github.com/worldveil/dejavu) - Audio fingerprinting
- [GurbaniNow API](https://github.com/gurbaninow/api-public) - Gurbani text API
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details.

