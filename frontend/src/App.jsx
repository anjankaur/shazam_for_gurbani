import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Volume2 } from 'lucide-react';
import HomeView from './components/HomeView';
import ListeningView from './components/ListeningView';
import ResultView from './components/ResultView';
import { identifyShabad, fetchShabad, generateExplanation, generateVoiceExplanation } from './services/api';
import { recordAudio } from './utils/audioUtils';
import { base64ToUint8Array, pcm16ToWav } from './utils/audioUtils';
import { DEMO_SHABADS, GEMINI_API_KEY } from './config';

export default function App() {
  // App States
  const [view, setView] = useState('home'); // home, listening, result, error
  const [shabadData, setShabadData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [debugLog, setDebugLog] = useState("Ready.");

  // Gemini Voice States
  const [explanation, setExplanation] = useState("");
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef(null);

  // Audio Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Helper: Log to UI
  const log = (msg) => {
    console.log(msg);
    setDebugLog(msg);
  };

  // --- AUDIO HANDLING (MIC) ---
  const startListening = async (isSimulation = false) => {
    try {
      setView('listening');
      setAudioLevel(0);

      if (isSimulation) {
        log("Simulation Mode: Generating fake audio levels...");
        // Fake audio visualizer loop
        const fakeLoop = () => {
          setAudioLevel(Math.random() * 100);
          animationFrameRef.current = requestAnimationFrame(fakeLoop);
        };
        fakeLoop();
      } else {
        log("Requesting Mic Permissions...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        log("Mic Active. Analyzing audio...");

        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);

        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        const updateAudioLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArrayRef.current[i];
          }
          setAudioLevel(sum / bufferLength);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        };
        updateAudioLevel();
      }

      // Wait 3 seconds then "find" the shabad
      setTimeout(() => {
        stopListening();
        identifyShabadFromAudio(isSimulation);
      }, 3000);
    } catch (err) {
      log(`Error: ${err.message}. Try 'Test Without Mic'.`);
      alert("Microphone access failed. Try the 'Test Without Mic' button.");
      setView('home');
    }
  };

  const stopListening = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    if (sourceRef.current) sourceRef.current.disconnect();
    setAudioLevel(0);
  };

  const identifyShabadFromAudio = async (isSimulation = false) => {
    setLoading(true);
    log("Analyzing audio fingerprint...");

    try {
      let shabadId;

      if (isSimulation) {
        // Use demo data for simulation
        const randomShabad = DEMO_SHABADS[Math.floor(Math.random() * DEMO_SHABADS.length)];
        shabadId = randomShabad.id;
        log(`Simulation: Using demo Shabad ID ${shabadId}`);
      } else {
        // Record audio and send to backend
        log("Recording audio...");
        const audioBlob = await recordAudio(3000);
        log("Sending to recognition server...");

        const result = await identifyShabad(audioBlob);
        
        if (result.success && result.shabad_id) {
          shabadId = result.shabad_id;
          log(`Match found: Shabad ID ${shabadId} (confidence: ${result.confidence?.toFixed(2) || 'N/A'})`);
        } else {
          throw new Error(result.message || "No match found");
        }
      }

      // Fetch Shabad details
      log(`Fetching lyrics for Shabad ${shabadId}...`);
      const data = await fetchShabad(shabadId);

      if (data) {
        setShabadData(data);
        setExplanation("");
        setAudioUrl(null);
        setIsPlaying(false);
        setView('result');
        log("Data loaded successfully.");
      } else {
        throw new Error("No data found");
      }
    } catch (err) {
      log(`API Error: ${err.message}`);
      setView('error');
    } finally {
      setLoading(false);
    }
  };

  // --- GEMINI INTEGRATION ---
  const handleGeminiExplain = async () => {
    if (explanation) return;
    setIsGeneratingVoice(true);
    log("Contacting Gemini AI...");

    try {
      // Check API Key
      if (!GEMINI_API_KEY || GEMINI_API_KEY === "") {
        log("API Key missing. Using Simulation.");
        await new Promise((r) => setTimeout(r, 1500));
        setExplanation(
          "The key to happiness lies in surrendering the ego and realizing that the Divine Light is within us all. Just as water blends with water, let your soul blend with the Truth."
        );
        setIsGeneratingVoice(false);
        return;
      }

      const lines = shabadData.shabad
        .map((line) => line.line.translation.english.default)
        .join(" ");

      // Generate Text
      log("Gemini: Generating explanation...");
      const generatedText = await generateExplanation(lines, GEMINI_API_KEY);
      setExplanation(generatedText);

      // Generate Audio (TTS)
      log("Gemini: Generating voice...");
      const audioBase64 = await generateVoiceExplanation(generatedText, GEMINI_API_KEY);

      if (audioBase64) {
        log("Voice generated. Playing...");
        const pcmData = base64ToUint8Array(audioBase64);
        const wavBlob = pcm16ToWav(pcmData.buffer);
        const url = URL.createObjectURL(wavBlob);
        setAudioUrl(url);

        // Auto-play
        setTimeout(() => {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.src = url;
            audioPlayerRef.current.play().catch((e) => log("Auto-play blocked. Click Play manually."));
            setIsPlaying(true);
          }
        }, 100);
      }
    } catch (error) {
      log(`Error: ${error.message}`);
      setExplanation("Unable to generate explanation. (API Key may be invalid or quota exceeded)");
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const toggleAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
    } else {
      audioPlayerRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden max-w-md mx-auto shadow-2xl border-x border-slate-200 relative">
      <audio
        ref={audioPlayerRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md p-4 sticky top-0 z-20 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
            ੴ
          </div>
          <span className="font-bold text-lg text-slate-800 tracking-tight">GurbaniDetect</span>
        </div>
        <div className="flex gap-2 items-center">
          {isPlaying && (
            <span className="animate-pulse text-orange-500 text-xs font-bold uppercase">Speaking</span>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative overflow-y-auto pb-10">
        {/* VIEW: HOME */}
        {view === 'home' && (
          <HomeView
            onStartListening={() => startListening(false)}
            onTestWithoutMic={() => startListening(true)}
          />
        )}

        {/* VIEW: LISTENING */}
        {view === 'listening' && (
          <ListeningView
            audioLevel={audioLevel}
            debugLog={debugLog}
            onCancel={() => {
              stopListening();
              setView('home');
            }}
          />
        )}

        {/* VIEW: LOADING */}
        {loading && view !== 'listening' && (
          <div className="h-full flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
            <p className="text-slate-500">Fetching Gurbani...</p>
            <p className="text-xs text-slate-300 mt-2">{debugLog}</p>
          </div>
        )}

        {/* VIEW: RESULT */}
        {view === 'result' && shabadData && (
          <ResultView
            shabadData={shabadData}
            explanation={explanation}
            isGeneratingVoice={isGeneratingVoice}
            audioUrl={audioUrl}
            isPlaying={isPlaying}
            onToggleAudio={toggleAudio}
            onGenerateExplanation={handleGeminiExplain}
            onBack={() => setView('home')}
          />
        )}

        {/* VIEW: ERROR */}
        {view === 'error' && (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
              <Volume2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Match Found</h3>
            <p className="text-xs text-slate-400 mb-4">{debugLog}</p>
            <button
              onClick={() => setView('home')}
              className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Debug Log Footer */}
      <div className="bg-slate-900 text-slate-500 text-[10px] p-1 text-center font-mono">
        Status: {debugLog}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mukta+Mahee:wght@300;400;700&display=swap');
        .font-gurmukhi { font-family: 'Mukta Mahee', sans-serif; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

