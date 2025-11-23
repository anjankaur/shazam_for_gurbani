# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Device                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Frontend (Vite + React)                 │  │
│  │  - Records audio via microphone                        │  │
│  │  - Sends audio to backend                             │  │
│  │  - Displays Shabad lyrics and translations            │  │
│  │  - Gemini AI integration for explanations              │  │
│  └───────────────────┬──────────────────────────────────┘  │
└───────────────────────┼────────────────────────────────────┘
                        │ HTTP POST (audio file)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Flask Backend (Python)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  app.py - Flask API server                            │  │
│  │    - /identify endpoint                               │  │
│  │    - /health endpoint                                 │  │
│  │    - /shabad/<id> proxy                               │  │
│  └───────────────┬────────────────────────────────────────┘  │
│                  │                                            │
│  ┌───────────────▼────────────────────────────────────────┐  │
│  │  recognizer.py - Audio Recognition                     │  │
│  │    - Uses Dejavu library                               │  │
│  │    - Fingerprints audio                                │  │
│  │    - Matches against database                          │  │
│  └───────────────┬────────────────────────────────────────┘  │
└──────────────────┼───────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              MySQL Database                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Dejavu Tables (auto-created)                        │  │
│  │    - fingerprints - Audio hash data                    │  │
│  │    - songs - Audio file metadata                      │  │
│  │                                                       │  │
│  │  shabad_mappings (custom)                             │  │
│  │    - audio_filename -> shabad_id mapping              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         External APIs                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GurbaniNow API                                       │  │
│  │    - Fetches Shabad text, translations                │  │
│  │    - Provides transliteration                         │  │
│  │                                                       │  │
│  │  Gemini API (Optional)                                │  │
│  │    - Generates AI explanations                        │  │
│  │    - Text-to-speech for explanations                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
shazam_for_gurbani/
├── backend/                    # Python Flask backend
│   ├── __init__.py
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration management
│   ├── models.py              # Database models (ShabadMapping)
│   ├── recognizer.py          # Audio recognition logic
│   ├── train.py               # Training script for audio files
│   ├── check_setup.py         # Setup verification script
│   └── requirements.txt       # Python dependencies
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   ├── config.js         # App configuration
│   │   ├── index.css         # Global styles
│   │   ├── components/       # React components
│   │   │   ├── HomeView.jsx
│   │   │   ├── ListeningView.jsx
│   │   │   └── ResultView.jsx
│   │   ├── services/         # API services
│   │   │   └── api.js        # API calls
│   │   └── utils/            # Utility functions
│   │       └── audioUtils.js # Audio processing utilities
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── audio_files/               # Training audio files
│   └── .gitkeep
│
├── .env.example              # Environment variables template
├── .gitignore
├── LICENSE
├── README.md                 # Main documentation
├── QUICKSTART.md             # Quick setup guide
├── SETUP.md                  # Detailed setup instructions
└── ARCHITECTURE.md           # This file
```

## Data Flow

### 1. Training Phase

```
Audio Files (MP3) 
    ↓
train.py
    ↓
Dejavu Fingerprinting
    ↓
MySQL Database (fingerprints, songs)
    ↓
ShabadMapping (filename -> shabad_id)
    ↓
MySQL Database (shabad_mappings)
```

### 2. Recognition Phase

```
User Records Audio (3-10 seconds)
    ↓
Frontend: recordAudio()
    ↓
POST /identify (audio blob)
    ↓
Backend: app.py
    ↓
recognizer.py: recognize()
    ↓
Dejavu: Match against fingerprints
    ↓
ShabadMapping: Get shabad_id
    ↓
Response: { shabad_id, confidence }
    ↓
Frontend: fetchShabad(shabad_id)
    ↓
GurbaniNow API
    ↓
Display: Lyrics, Translation, Transliteration
```

### 3. AI Explanation Flow (Optional)

```
User Clicks "Explain & Read to me"
    ↓
Frontend: generateExplanation()
    ↓
Gemini API: Generate text explanation
    ↓
Frontend: generateVoiceExplanation()
    ↓
Gemini TTS API: Generate audio
    ↓
Frontend: Convert PCM to WAV
    ↓
Display: Text + Audio Player
```

## Key Components

### Backend Components

**app.py**
- Flask application server
- REST API endpoints
- File upload handling
- Error handling

**recognizer.py**
- Wraps Dejavu library
- Handles audio recognition
- Maps audio to Shabad IDs
- Returns structured results

**models.py**
- Database connection management
- ShabadMapping class
- CRUD operations for mappings

**train.py**
- Batch processes audio files
- Creates fingerprints
- Builds mapping table
- Progress reporting

**config.py**
- Centralized configuration
- Environment variable loading
- Database settings
- API endpoints

### Frontend Components

**App.jsx**
- Main application state management
- View routing (home, listening, result, error)
- Audio recording orchestration
- Gemini integration

**HomeView.jsx**
- Landing page
- Microphone button
- Recent discoveries display

**ListeningView.jsx**
- Audio visualization
- Recording feedback
- Cancel functionality

**ResultView.jsx**
- Shabad display
- Lyrics rendering
- Gemini explanation card
- Audio player

**api.js**
- HTTP client functions
- Backend API calls
- GurbaniNow API integration
- Gemini API integration

**audioUtils.js**
- Audio recording
- Format conversion (PCM to WAV)
- Base64 decoding

## Database Schema

### Dejavu Tables (Auto-created)

```sql
-- Created automatically by Dejavu
fingerprints (
    hash BINARY(10),
    song_id INT,
    offset INT,
    INDEX(hash)
)

songs (
    song_id INT PRIMARY KEY AUTO_INCREMENT,
    song_name VARCHAR(250),
    fingerprinted TINYINT DEFAULT 0
)
```

### Custom Table

```sql
shabad_mappings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    audio_filename VARCHAR(255) UNIQUE,
    shabad_id VARCHAR(50),
    artist_name VARCHAR(255),
    start_ang INT,
    created_at TIMESTAMP,
    INDEX(shabad_id),
    INDEX(audio_filename)
)
```

## Technology Stack

### Backend
- **Python 3.8+** - Programming language
- **Flask** - Web framework
- **Dejavu** - Audio fingerprinting library
- **MySQL** - Database
- **mysql-connector-python** - Database driver
- **python-dotenv** - Environment variable management

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Web Audio API** - Audio recording and processing

### External Services
- **GurbaniNow API** - Shabad text and translations
- **Gemini API** (Optional) - AI explanations and TTS

## Security Considerations

1. **File Upload**
   - File size limits (10MB)
   - Extension validation
   - Secure filename handling

2. **CORS**
   - Configured for development
   - Should be restricted in production

3. **API Keys**
   - Stored in environment variables
   - Never committed to repository

4. **Database**
   - Credentials in .env file
   - SQL injection protection via parameterized queries

## Performance Optimizations

1. **Audio Processing**
   - Temporary file cleanup
   - Efficient audio format conversion
   - Streaming for large files

2. **Database**
   - Indexed columns for fast lookups
   - Connection pooling (can be added)

3. **Frontend**
   - Component lazy loading (can be added)
   - Audio blob URL cleanup
   - Efficient state management

## Future Enhancements

1. **Recognition Accuracy**
   - Add more training data
   - Implement confidence thresholds
   - Support for multiple artists per Shabad

2. **Features**
   - User favorites
   - Search history
   - Offline mode
   - Share functionality

3. **Performance**
   - Caching layer (Redis)
   - CDN for static assets
   - Database query optimization

4. **Deployment**
   - Docker containerization
   - CI/CD pipeline
   - Production deployment guide

