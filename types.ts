
export type View = 'dashboard' | 'chat' | 'analysis' | 'bias';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface CaseAnalysisResult {
  summary: string;
  relevant_sections: string[];
  predicted_outcome: string;
  confidence_score: number;
  reasoning: string;
}

export interface BiasAnalysisResult {
    bias_found: boolean;
    score: number;
    explanation: string;
    flagged_phrases: string[];
}
