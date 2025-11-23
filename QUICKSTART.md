# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Python version (need 3.8+)
python --version

# Check Node.js version (need 16+)
node --version

# Check if MySQL is running
mysql --version

# Check if FFmpeg is installed
ffmpeg -version
```

## Quick Setup

### 1. Database Setup (One-time)

```bash
# Login to MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE gurbani_db;
# (Optional) Create a user:
CREATE USER 'gurbani_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON gurbani_db.* TO 'gurbani_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from example)
cp ../.env.example ../.env
# Edit ../.env with your MySQL credentials

# Start server
python app.py
```

Backend should now be running on `http://localhost:5000`

### 3. Frontend Setup

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend should now be running on `http://localhost:5173`

### 4. Train the System (Before Testing)

```bash
# Add your MP3 files to audio_files/ directory
# Name them as: {shabad_id}_{artist}.mp3
# Example: 3589_bhai_harjinder_singh.mp3

# Run training (from backend directory with venv activated)
python train.py
```

### 5. Test the App

1. Open `http://localhost:5173` in your browser
2. Click "Test Without Mic (Simulation)" to test without microphone
3. Or click the microphone button to test with real audio

## Common Issues

**Backend won't start:**
- Check MySQL is running
- Verify database credentials in `.env`
- Ensure virtual environment is activated

**Frontend won't start:**
- Run `npm install` again
- Check Node.js version (need 16+)

**Recognition not working:**
- Make sure you've run `python train.py` with audio files
- Check that audio files are named correctly: `{shabad_id}_{artist}.mp3`

## Next Steps

- Add more audio files to improve accuracy
- Customize the UI
- Deploy to production

For detailed setup, see [SETUP.md](./SETUP.md)

