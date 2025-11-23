# Setup Guide

This guide will walk you through setting up the Shazam for Gurbani application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **MySQL 8.0+** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **FFmpeg** - Required for audio processing

### Installing FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
Download from [FFmpeg website](https://ffmpeg.org/download.html) and add to PATH.

## Step 1: Database Setup

1. **Create MySQL database:**
   ```sql
   CREATE DATABASE gurbani_db;
   ```

2. **Create a MySQL user (optional but recommended):**
   ```sql
   CREATE USER 'gurbani_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON gurbani_db.* TO 'gurbani_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # macOS/Linux
   source venv/bin/activate
   
   # Windows
   venv\Scripts\activate
   ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp ../.env.example ../.env
   
   # Edit .env with your database credentials
   # Update DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
   ```

6. **Test database connection:**
   ```bash
   python -c "from config import DATABASE_CONFIG; print('Config loaded:', DATABASE_CONFIG)"
   ```

## Step 3: Train the System

Before the app can recognize Shabads, you need to train it with audio files.

1. **Prepare audio files:**
   - Place your MP3 files in the `audio_files/` directory
   - Name files as: `{shabad_id}_{artist_name}.mp3`
   - Example: `3589_bhai_harjinder_singh.mp3`

2. **Run training script:**
   ```bash
   python train.py
   ```

   This will:
   - Fingerprint all audio files
   - Store fingerprints in the database
   - Create mappings between filenames and Shabad IDs

3. **Verify training:**
   Check the database to ensure records were created:
   ```sql
   USE gurbani_db;
   SELECT COUNT(*) FROM shabad_mappings;
   ```

## Step 4: Start Backend Server

1. **Start Flask server:**
   ```bash
   python app.py
   ```

   The server should start on `http://localhost:5000`

2. **Test the API:**
   ```bash
   curl http://localhost:5000/health
   ```

   You should see:
   ```json
   {"status": "healthy", "service": "Gurbani Recognition API"}
   ```

## Step 5: Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**
   Create a `.env` file in the frontend directory:
   ```bash
   VITE_GURBANI_API_URL=https://api.gurbaninow.com/v2
   VITE_RECOGNITION_API_URL=http://localhost:5000
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   The app should open at `http://localhost:5173`

## Step 6: Testing

1. **Test with simulation mode:**
   - Open the app in your browser
   - Click "Test Without Mic (Simulation)"
   - This will use demo data without requiring microphone access

2. **Test with real audio:**
   - Click the main microphone button
   - Allow microphone permissions
   - Record 3-10 seconds of a Shabad that you've trained
   - The app should identify it and display the lyrics

## Troubleshooting

### Backend Issues

**"Error connecting to MySQL":**
- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in `.env`
- Ensure database `gurbani_db` exists

**"No module named 'dejavu'":**
- Ensure virtual environment is activated
- Run: `pip install -r requirements.txt`

**"FFmpeg not found":**
- Install FFmpeg (see Prerequisites)
- Verify installation: `ffmpeg -version`

### Frontend Issues

**"Cannot connect to backend":**
- Ensure backend server is running on port 5000
- Check CORS settings in `backend/app.py`
- Verify `VITE_RECOGNITION_API_URL` in frontend `.env`

**"Microphone access denied":**
- Use "Test Without Mic" button for testing
- Check browser permissions for microphone access
- Use HTTPS in production (required for microphone)

### Training Issues

**"No audio files found":**
- Ensure files are in `audio_files/` directory
- Check file extensions (.mp3, .wav, .m4a)
- Verify file naming format: `{shabad_id}_{artist}.mp3`

**"Recognition not working":**
- Ensure you've trained the system with audio files
- Verify the audio you're testing matches a trained file
- Check database has entries in `shabad_mappings` table

## Next Steps

- Add more audio files to improve recognition accuracy
- Customize the UI in `frontend/src/components/`
- Add more features like favorites, history, etc.
- Deploy to production (see deployment guide)

## Additional Resources

- [Dejavu Documentation](https://github.com/worldveil/dejavu)
- [GurbaniNow API Docs](https://github.com/gurbaninow/api-public)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)

