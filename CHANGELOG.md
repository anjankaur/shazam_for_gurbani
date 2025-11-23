# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Docker support for containerized deployment
- CI/CD pipeline with GitHub Actions
- Comprehensive documentation (CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md)
- Code quality tools (ESLint, Prettier, Black, Flake8)
- Pre-commit hooks configuration
- Environment configuration template (.env.example)

## [1.0.0] - 2025-01-23

### Added
- Initial release of Shazam for Gurbani
- Audio fingerprinting using Dejavu library
- Flask REST API backend
  - `/health` endpoint for health checks
  - `/identify` endpoint for audio recognition
  - `/shabad/<id>` endpoint for fetching Shabad details
- React frontend with three main views:
  - Home view with microphone access
  - Listening view with audio visualization
  - Result view with Shabad lyrics and translation
- MySQL database integration for audio fingerprints
- Shabad mapping system linking audio files to Shabad IDs
- GurbaniNow API integration for fetching Shabad content
- Google Gemini API integration for AI-powered explanations
- Audio processing support for MP3, WAV, and M4A formats
- Training script for fingerprinting audio library
- Setup verification script
- Comprehensive documentation:
  - README.md with architecture overview
  - QUICKSTART.md for quick setup
  - SETUP.md for detailed installation
  - ARCHITECTURE.md for system design
- File upload validation and security
- CORS support for frontend-backend communication
- Error handling and logging
- Responsive mobile-first UI design
- Gurmukhi font support

### Technical Details
- **Backend**: Python 3.8+, Flask 3.0, PyDejavu 1.0
- **Frontend**: React 18, Vite 5, Tailwind CSS 3
- **Database**: MySQL 8.0+
- **Audio Processing**: FFmpeg

### Known Limitations
- Requires manual training with audio files
- No user authentication system
- Limited to pre-fingerprinted audio library
- CORS configured for development (allow all origins)
- No rate limiting on API endpoints

## [0.1.0] - 2025-01-15

### Added
- Project structure setup
- Basic Flask server skeleton
- React frontend scaffolding
- Database schema design
- Audio file naming convention documentation

---

## Version History Summary

- **1.0.0** - Full-featured release with audio recognition
- **0.1.0** - Initial project setup

## Upgrade Guide

### From 0.1.0 to 1.0.0

1. Update dependencies:
   ```bash
   cd backend && pip install -r requirements.txt
   cd frontend && npm install
   ```

2. Create and configure `.env` file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Set up MySQL database:
   ```sql
   CREATE DATABASE gurbani_db;
   ```

4. Run training script:
   ```bash
   python backend/train.py
   ```

5. Start servers:
   ```bash
   # Backend
   python backend/app.py

   # Frontend
   cd frontend && npm run dev
   ```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute to this project.

## Security

See [SECURITY.md](SECURITY.md) for security policy and vulnerability reporting.
