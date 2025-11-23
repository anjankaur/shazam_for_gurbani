import React from 'react';
import { Mic, X } from 'lucide-react';

export default function ListeningView({ audioLevel, debugLog, onCancel }) {
  return (
    <div className="absolute inset-0 bg-orange-500 z-50 flex flex-col items-center justify-center text-white overflow-hidden">
      <button
        onClick={onCancel}
        className="absolute top-6 right-6 p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-md"
      >
        <X size={24} />
      </button>

      <div className="relative">
        <div
          className="absolute inset-0 bg-white rounded-full opacity-20 transition-all duration-75 ease-out"
          style={{ transform: `scale(${1 + audioLevel / 50})` }}
        ></div>
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10">
          <Mic size={48} className="text-orange-500 animate-pulse" />
        </div>
      </div>

      <h2 className="mt-12 text-2xl font-semibold tracking-wide animate-pulse">Listening...</h2>
      <p className="mt-2 text-orange-100 opacity-80 text-sm">{debugLog}</p>
    </div>
  );
}

