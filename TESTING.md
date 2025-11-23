# API Testing Guide

This document describes how to test the API integrations in the Shazam for Gurbani application.

## Overview

The project includes comprehensive API testing utilities for validating:
- **GurbaniNow API** - Gurbani text and translations
- **Recognition API** - Audio fingerprint identification (backend)
- **Gemini API** - AI explanations and text-to-speech

## Testing Tools

### 1. Frontend Test Panel (Interactive UI)

A visual test panel is available in the frontend application.

**How to Access:**
1. Start the frontend: `npm run dev` (in `frontend/` directory)
2. Open the app in your browser
3. Click the **test tube icon** (🧪) in the top-right header
4. Choose test type:
   - **Smoke Test** - Quick validation of essential APIs (2 tests)
   - **Full Test Suite** - Comprehensive testing of all APIs (6 tests)

**Features:**
- Real-time test execution with progress indicators
- Detailed results with pass/fail status
- Response time measurements
- Data validation checks
- Export test results as JSON
- Error messages and debugging information

### 2. Backend Test Script (CLI)

A Python script for testing backend APIs from the command line.

**Installation:**
```bash
cd backend
pip install -r requirements.txt
```

**Usage:**

Run all tests:
```bash
python test_apis.py
```

Run smoke test only:
```bash
python test_apis.py --smoke
```

**Tests Included:**
- ✅ Health Check Endpoint (`/health`)
- ✅ GurbaniNow API Connectivity
- ✅ Multiple Shabads Fetching
- ✅ Response Time Measurement
- ✅ Error Handling Validation

**Output:**
```
🧪 Backend API Test Suite
============================================================

✓ Health Check Endpoint (45ms)
  Service is healthy: Gurbani Recognition API

✓ GurbaniNow API (523ms)
  Successfully fetched Shabad (1) with 8 lines

📊 Test Summary
============================================================
Total Tests:  5
Passed:       5
Failed:       0
Pass Rate:    100.0%

✅ All tests passed!
```

### 3. Validation Utilities (Code-Level)

All API responses are automatically validated using utilities in `frontend/src/utils/validation.js`.

**Validators Available:**
- `validateShabadResponse()` - Validates GurbaniNow Shabad data
- `validateRecognitionResponse()` - Validates recognition API responses
- `validateExplanationResponse()` - Validates Gemini explanation text
- `validateVoiceResponse()` - Validates Gemini TTS audio data

**Usage Example:**
```javascript
import { validateShabadResponse } from './utils/validation';

const data = await fetchShabad('3589');
const validation = validateShabadResponse(data);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## What Gets Tested

### GurbaniNow API Tests

| Test | Description | Pass Criteria |
|------|-------------|---------------|
| Basic Connectivity | Fetch Shabad ID 1 (Mool Mantar) | HTTP 200 + valid data structure |
| Multiple Shabads | Fetch IDs 1, 3589, 1365 | All 3 Shabads fetched successfully |
| Response Time | Measure avg response time | Average < 2 seconds |
| Data Validation | Verify response structure | All required fields present |

**Expected Response Structure:**
```json
{
  "shabad": [
    {
      "line": {
        "gurmukhi": { "Gurmukhi": "..." },
        "transliteration": { "english": "..." },
        "translation": { "english": { "default": "..." } }
      }
    }
  ],
  "shabadinfo": {
    "raag": "...",
    "pageNo": "...",
    "writer": "..."
  }
}
```

### Recognition API Tests

| Test | Description | Pass Criteria |
|------|-------------|---------------|
| Health Check | GET `/health` | HTTP 200 + `{"status": "healthy"}` |
| Audio Recognition | POST `/identify` with audio file | Valid response with shabad_id |

**Expected Response Structure:**
```json
{
  "success": true,
  "shabad_id": "3589",
  "confidence": 0.95,
  "song_name": "3589_bhai_harjinder_singh"
}
```

### Gemini API Tests

| Test | Description | Pass Criteria |
|------|-------------|---------------|
| Text Generation | Generate explanation from text | Valid string response |
| Text-to-Speech | Generate audio from text | Valid base64 PCM audio data |

**Notes:**
- Requires `VITE_GEMINI_API_KEY` environment variable
- Tests are skipped if API key not configured
- May incur API usage costs

## Troubleshooting

### Frontend Tests Fail

**Problem:** "Cannot connect to Recognition API"
**Solution:**
- Ensure backend server is running (`python backend/app.py`)
- Check `VITE_RECOGNITION_API_URL` in `.env`
- Default: `http://localhost:5000`

**Problem:** "Access denied to GurbaniNow API"
**Solution:**
- The API may have rate limiting
- Try again after a few minutes
- Check internet connectivity

**Problem:** "Gemini API key not configured"
**Solution:**
- Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Add to `.env`: `VITE_GEMINI_API_KEY=your_key_here`
- Restart frontend dev server

### Backend Tests Fail

**Problem:** "Cannot connect to backend server"
**Solution:**
- Start backend: `python backend/app.py`
- Verify it's running on `http://localhost:5000`
- Check firewall settings

**Problem:** "Database connection failed"
**Solution:**
- Ensure MySQL is running
- Check `backend/config.py` database settings
- Verify credentials in `.env`

## Continuous Integration

The test scripts can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Backend API Tests
  run: |
    cd backend
    python test_apis.py
```

The test script exits with code 1 on failure, making it suitable for CI/CD gates.

## Manual Testing Checklist

- [ ] Backend `/health` endpoint responds
- [ ] GurbaniNow API fetches Shabad data
- [ ] Recognition API identifies audio
- [ ] Gemini generates explanations (if configured)
- [ ] Gemini TTS generates voice (if configured)
- [ ] All response data structures are valid
- [ ] Error handling works correctly
- [ ] Response times are acceptable (< 2s)

## Testing Best Practices

1. **Run tests before commits** - Ensure APIs are working
2. **Test after environment changes** - Verify config updates
3. **Monitor response times** - Track API performance
4. **Check validation errors** - Review console logs
5. **Export test results** - Keep records for debugging
6. **Test error scenarios** - Try invalid IDs, missing keys

## Support

If tests consistently fail:
1. Check the [SETUP.md](./SETUP.md) for configuration
2. Review API endpoints in [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Report issues with test results attached

---

**Last Updated:** 2025-11-23
