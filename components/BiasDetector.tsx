
import React, { useState } from 'react';
import { detectBiasInText } from '../services/geminiService';
import type { BiasAnalysisResult } from '../types';

const BiasDetector: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<BiasAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please paste the judgment text into the text area.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysisResult(null);
    try {
      const result = await detectBiasInText(inputText);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Bias detection failed:", err);
      setError('Failed to analyze the text. The AI model may be unable to process this request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-amber-400 mb-4">Bias Detection Engine</h2>
        <p className="text-slate-400 mb-6">Paste a legal judgment or text to analyze it for potential biases. The AI will flag questionable phrases and provide an overall fairness score.</p>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste the judgment text here..."
          className="w-full h-48 bg-slate-900/70 text-slate-200 border border-slate-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
          disabled={isLoading}
        />

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !inputText.trim()}
          className="w-full bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing for Bias...' : 'Analyze Text'}
        </button>
      </div>

      {isLoading && <div className="text-center mt-8"><p>AI is analyzing the text, please wait...</p></div>}

      {analysisResult && (
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-fade-in">
          <h3 className="text-2xl font-bold text-amber-400 mb-6 text-center">Bias Analysis Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`p-4 rounded-lg text-center ${analysisResult.bias_found ? 'bg-red-900/50 border border-red-700' : 'bg-green-900/50 border border-green-700'}`}>
              <h4 className="font-bold text-slate-300 mb-1">Bias Detected</h4>
              <p className={`text-3xl font-bold ${analysisResult.bias_found ? 'text-red-400' : 'text-green-400'}`}>
                {analysisResult.bias_found ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg text-center">
              <h4 className="font-bold text-slate-300 mb-1">Overall Bias Score</h4>
              <p className="text-3xl font-bold text-amber-400">{analysisResult.score} / 10</p>
            </div>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-amber-400 mb-2">Explanation</h4>
            <p className="text-slate-300">{analysisResult.explanation}</p>
          </div>
          {analysisResult.flagged_phrases && analysisResult.flagged_phrases.length > 0 && (
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h4 className="font-bold text-amber-400 mb-2">Flagged Phrases</h4>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                {analysisResult.flagged_phrases.map((phrase, index) => (
                  <li key={index} className="border-l-2 border-amber-500 pl-2">"{phrase}"</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BiasDetector;
