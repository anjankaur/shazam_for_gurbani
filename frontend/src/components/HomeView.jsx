import React from 'react';
import { Mic, Music } from 'lucide-react';

export default function HomeView({ onStartListening, onTestWithoutMic }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Tap to Identify</h1>
        <p className="text-slate-500">Listening for Shabad Kirtan...</p>
      </div>

      {/* Main Action Button */}
      <div className="relative group">
        <div className="absolute inset-0 bg-orange-400 rounded-full opacity-20 animate-ping group-hover:opacity-30 duration-1000"></div>
        <button
          onClick={onStartListening}
          className="relative z-10 w-40 h-40 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-xl shadow-orange-200 transition-transform transform hover:scale-105 active:scale-95"
        >
          <div className="text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Mic size={40} fill="white" />
            </div>
          </div>
        </button>
      </div>

      {/* Fallback Button */}
      <button
        onClick={onTestWithoutMic}
        className="text-xs text-slate-400 hover:text-slate-600 underline mt-4"
      >
        Test Without Mic (Simulation)
      </button>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 w-full mt-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
          <h3 className="font-semibold text-slate-700">Recent Discoveries</h3>
        </div>
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
              <Music size={18} />
            </div>
            <div>
              <p className="font-medium text-sm text-slate-700">Thir Ghar Baiso</p>
              <p className="text-xs text-slate-400">Bhai Harjinder Singh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

