/**
 * Application configuration
 */
export const API_BASE_URL = import.meta.env.VITE_GURBANI_API_URL || "https://api.gurbaninow.com/v2";
export const RECOGNITION_API_URL = import.meta.env.VITE_RECOGNITION_API_URL || "http://localhost:5000";
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Demo data for simulation/testing
export const DEMO_SHABADS = [
  { id: '3589', name: 'Thir Ghar Baiso', desc: 'Stabilize your mind within' },
  { id: '1', name: 'Mool Mantar', desc: 'The Root Mantra' },
  { id: '1365', name: 'Tati Vao Na Lagai', desc: 'The hot wind does not touch me' }
];

