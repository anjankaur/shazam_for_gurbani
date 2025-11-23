import React from 'react';
import { X, ArrowLeft, Sparkles, Volume2, Play, Pause, Loader2 } from 'lucide-react';

export default function ResultView({
  shabadData,
  explanation,
  isGeneratingVoice,
  audioUrl,
  isPlaying,
  onToggleAudio,
  onGenerateExplanation,
  onBack
}) {
  const getLines = () => shabadData?.shabad || [];
  const getMetaData = () => shabadData?.shabadinfo || {};

  return (
    <div className="min-h-full bg-white pb-24">
      {/* Sticky Header */}
      <div className="bg-orange-50 border-b border-orange-100 p-5 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-1">
              {getMetaData().raag ? `Raag ${getMetaData().raag}` : 'Shabad Details'}
            </h2>
            <p className="text-xs text-slate-500">
              Ang {getMetaData().pageNo || '?'} • {getMetaData().writer || 'Unknown'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="p-2 bg-white rounded-full shadow-sm text-slate-600 hover:bg-slate-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* GEMINI VOICE EXPLANATION CARD */}
      <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-indigo-700">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Gemini Insight</span>
            </div>
            {audioUrl && (
              <button
                onClick={onToggleAudio}
                className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-indigo-700 shadow-sm"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                {isPlaying ? 'Pause' : 'Listen'}
              </button>
            )}
          </div>
          {!explanation ? (
            <button
              onClick={onGenerateExplanation}
              disabled={isGeneratingVoice}
              className="w-full py-3 bg-white/80 hover:bg-white text-indigo-600 rounded-lg text-sm font-medium transition-colors border border-indigo-100 flex items-center justify-center gap-2 shadow-sm"
            >
              {isGeneratingVoice ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Volume2 size={16} />
              )}
              {isGeneratingVoice ? "Generating Insight..." : "Explain & Read to me"}
            </button>
          ) : (
            <div className="animate-fadeIn">
              <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                "{explanation}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* LYRICS */}
      <div className="p-4 space-y-8">
        {getLines().map((line) => (
          <div key={line.id} className="space-y-3 border-b border-slate-50 pb-6 last:border-0">
            <p className="text-2xl font-bold text-slate-800 leading-relaxed text-center font-gurmukhi">
              {line.line.gurmukhi.Gurmukhi}
            </p>
            <p className="text-sm text-slate-500 text-center italic font-serif">
              {line.line.transliteration.english}
            </p>
            <p className="text-md text-slate-700 text-center">
              {line.line.translation.english.default}
            </p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg hover:bg-slate-800 transition-transform active:scale-95"
        >
          <ArrowLeft size={18} />
          <span>Identify Another</span>
        </button>
      </div>
    </div>
  );
}

