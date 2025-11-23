/**
 * API service functions for communicating with backend and GurbaniNow API
 */
import { API_BASE_URL, RECOGNITION_API_URL } from '../config';

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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
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
    const response = await fetch(`${API_BASE_URL}/shabad/${shabadId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
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
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "This Shabad speaks of finding peace within.";
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
      throw new Error(`Gemini TTS API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error('Gemini TTS API error:', error);
    throw error;
  }
}

