
import React, { useState, useCallback } from 'react';
import { analyzeCaseText } from '../services/geminiService';
import type { CaseAnalysisResult } from '../types';

const CaseAnalysis: React.FC = () => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<CaseAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileContent(e.target?.result as string);
          setError('');
          setAnalysisResult(null);
        };
        reader.readAsText(file);
      } else {
        setError('Please upload a valid .txt file.');
        setFileContent('');
        setFileName('');
      }
    }
  }, []);
  
  const handleAnalyze = async () => {
    if (!fileContent) {
      setError('Please upload a file first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysisResult(null);
    try {
      const result = await analyzeCaseText(fileContent);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError('Failed to analyze the case file. The AI model may be unable to process this request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-amber-400 mb-4">Case Analysis & Prediction</h2>
        <p className="text-slate-400 mb-6">Upload a case document (.txt) to receive an AI-powered summary, identification of relevant laws, and a predicted outcome with a confidence score.</p>

        <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-slate-600 rounded-lg bg-slate-800/50 mb-4">
          <input type="file" id="file-upload" className="hidden" accept=".txt" onChange={handleFileChange} />
          <label htmlFor="file-upload" className="cursor-pointer text-amber-400 hover:text-amber-300 font-semibold">
            {fileName ? `Selected: ${fileName}` : 'Choose a .txt file'}
          </label>
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !fileContent}
          className="w-full bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-amber-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Case Document'}
        </button>
      </div>

      {isLoading && <div className="text-center mt-8"><p>AI is analyzing the document, please wait...</p></div>}
      
      {analysisResult && (
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-amber-400 mb-6 text-center">Analysis Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-400 mb-2">Case Summary</h4>
                    <p className="text-slate-300">{analysisResult.summary}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-400 mb-2">Predicted Outcome</h4>
                    <p className="text-2xl font-semibold text-white">{analysisResult.predicted_outcome}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-400 mb-2">Confidence Score</h4>
                    <p className="text-2xl font-semibold text-white">{(analysisResult.confidence_score * 100).toFixed(1)}%</p>
                </div>
                <div className="md:col-span-2 bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-400 mb-2">Reasoning</h4>
                    <p className="text-slate-300 whitespace-pre-wrap">{analysisResult.reasoning}</p>
                </div>
                 <div className="md:col-span-2 bg-slate-700/50 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-400 mb-2">Relevant Laws & Sections</h4>
                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {analysisResult.relevant_sections.map((section, index) => <li key={index}>{section}</li>)}
                    </ul>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CaseAnalysis;
