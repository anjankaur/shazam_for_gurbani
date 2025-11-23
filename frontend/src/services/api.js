/**
 * API service functions for communicating with backend and GurbaniNow API
 */
import { API_BASE_URL, RECOGNITION_API_URL } from '../config';
import {
  validateShabadResponse,
  validateRecognitionResponse,
  validateExplanationResponse,
  validateVoiceResponse,
  formatValidationError
} from '../utils/validation';

/**
 * Identify a Shabad from an audio file
 */
export async function identifyShabad(audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.wav');

  try {
    const response = await fetch(`${RECOGNITION_API_URL}/identify`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Recognition API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // Validate response structure
    const validation = validateRecognitionResponse(data);
    if (!validation.valid) {
      const errorMsg = formatValidationError('Recognition API', validation.errors);
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error('Recognition API error:', error);
    throw error;
  }
}

/**
 * Fetch Shabad details from GurbaniNow API
 */
export async function fetchShabad(shabadId) {
  try {
    const response = await fetch(`${API_BASE_URL}/shabad/${shabadId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Shabad ID ${shabadId} not found`);
      } else if (response.status === 403) {
        throw new Error(`Access denied to GurbaniNow API`);
      } else {
        throw new Error(`GurbaniNow API error (${response.status})`);
      }
    }

    const data = await response.json();

    // Validate response structure
    const validation = validateShabadResponse(data);
    if (!validation.valid) {
      const errorMsg = formatValidationError('GurbaniNow API', validation.errors);
      console.error(errorMsg);
      console.error('Received data:', data);
      throw new Error(`Invalid response structure from GurbaniNow API. Please check the API documentation.`);
    }

    return data;
  } catch (error) {
    console.error('GurbaniNow API error:', error);
    throw error;
  }
}

/**
 * Generate explanation using Gemini API
 */
export async function generateExplanation(shabadText, apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API key not provided');
  }

  const prompt = `Explain the spiritual meaning of this Gurbani shabad concisely in 2 sentences. Focus on the core message. Shabad translation: "${shabadText.substring(0, 500)}..."`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text || "This Shabad speaks of finding peace within.";

    // Validate explanation
    const validation = validateExplanationResponse(explanation);
    if (!validation.valid) {
      console.warn('Gemini explanation validation warnings:', validation.errors);
    }

    return explanation;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

/**
 * Generate voice explanation using Gemini TTS
 */
export async function generateVoiceExplanation(text, apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API key not provided');
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Kore" }
              }
            }
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini TTS API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const audioBase64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    // Validate audio data
    if (audioBase64) {
      const validation = validateVoiceResponse(audioBase64);
      if (!validation.valid) {
        console.warn('Gemini TTS validation warnings:', validation.errors);
      }
    }

    return audioBase64;
  } catch (error) {
    console.error('Gemini TTS API error:', error);
    throw error;
  }
}

